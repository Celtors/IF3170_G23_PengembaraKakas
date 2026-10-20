import random
import uuid
from datetime import datetime, timezone

from app.api.schemas import (
    AlgorithmName, AlgorithmParams, ExperimentStats,
    PlacementOut, Problem, RunInfo, RunRequest, RunResponse, StateOut,
)
from app.algorithms.genetic_algorithm import GeneticAlgorithm
from app.algorithms.hill_climbing_rr import HillClimbingRR
from app.algorithms.hill_climbing_sa import HillClimbingSA
from app.algorithms.hill_climbing_sideways import HillClimbingSideways
from app.algorithms.hill_climbing_stochastic import HillClimbingStochastic
from app.algorithms.simulated_annealing import SimulatedAnnealing
from app.models.dimensions import Dimensions
from app.models.package import Package
from app.models.state import State
from app.models.truck import Truck
from app.utils.geometry import Placement, package_box, placement_in_truck
from app.utils.neighbors import random_state
from app.utils.objective import score, score_plus_plus

OBJECTIVES = {"score": score, "score_plus_plus": score_plus_plus}
AXES = "xyz"
EXTRA_METRICS = ("prob_history", "stuck_frequency", "sideways_moves", "restarts", "iterations_per_restart")


def build_algorithm(algorithm: AlgorithmName, p: AlgorithmParams, rng: random.Random):
    match algorithm:
        case "steepest":
            return HillClimbingSA()
        case "sideways":
            return HillClimbingSideways(max_sideways=p.max_sideways, rng=rng)
        case "random_restart":
            return HillClimbingRR(max_restart=p.max_restart, rng=rng)
        case "stochastic":
            return HillClimbingStochastic(max_iterations=p.max_iterations, rng=rng)
        case "simulated_annealing":
            return SimulatedAnnealing(p.initial_temp, p.cooling_rate, p.min_temp, rng=rng)
        case "genetic":
            return GeneticAlgorithm(p.population_size, p.iterations, p.mutation_rate, rng=rng)


def to_domain(problem: Problem) -> tuple[Truck, list[Package]]:
    t = problem.truck
    truck = Truck(Dimensions(w=t.width, l=t.length, h=t.height), t.max_capacity)
    packages = [
        Package(p.id, Dimensions(w=p.dimensions.width, l=p.dimensions.length, h=p.dimensions.height),
                p.value, p.weight, p.is_fragile, p.eta)
        for p in problem.packages
    ]
    return truck, packages


def state_out(name: str, state: State, obj_fn) -> StateOut:
    return StateOut(
        state=name,
        objective_value=obj_fn(state),
        placements=[
            PlacementOut(
                package_id=rep.package_id,
                position=rep.position.get_xyz(),
                orientation=tuple(AXES[i] for i in rep.orientation.value),
                placement=placement_in_truck(package_box(pkg, rep), state.truck).value
            )
            for pkg, rep in zip(state.packages, state.shape_pack_models)
        ],
    )


def run_once(req: RunRequest, params: AlgorithmParams | None = None, seed: int | None = None) -> RunResponse:
    params = params or req.params
    rng = random.Random(req.seed if seed is None else seed)
    obj_fn = OBJECTIVES[req.objective]
    started_at = datetime.now(timezone.utc)

    truck, packages = to_domain(req.problem)
    init = random_state(truck, packages, rng)
    algo = build_algorithm(req.algorithm, params, rng)
    final = algo.run(init, obj_fn)

    metrics = {k: getattr(algo, k) for k in EXTRA_METRICS if hasattr(algo, k)}
    history = algo.history
    if req.algorithm == "genetic":
        history, metrics["avg_history"] = [b for b, _ in history], [a for _, a in history]

    init_out, final_out = state_out("init", init, obj_fn), state_out("final", final, obj_fn)
    return RunResponse(
        run=RunInfo(
            run_id=str(uuid.uuid4()),
            algorithm=req.algorithm,
            started_at=started_at,
            duration_ms=round(algo.duration * 1000),
        ),
        problem=req.problem,
        states=[init_out, final_out],
        experiment=ExperimentStats(
            iterations=max(len(history) - 1, 0),
            initial_objective=init_out.objective_value,
            final_objective=final_out.objective_value,
            best_objective=max([*history, final_out.objective_value]),
            objective_history=history,
            algorithm_metrics=metrics,
        ),
    )
