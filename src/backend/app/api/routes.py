import random
from fastapi import APIRouter
from app.api.schemas import PlacementOut, SolveRequest, SolveResponse, StateOut
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
from app.utils.constraints import cnt_violations
from app.utils.geometry import Placement, package_box, placement_in_truck
from app.utils.neighbors import random_state
from app.utils.objective import objective, objective_plus_plus, score, score_plus_plus

router = APIRouter(prefix="/api")

OBJECTIVES = {
    "score": (objective, score),
    "score_plus_plus": (objective_plus_plus, score_plus_plus),
}


def build_algorithm(req: SolveRequest, rng: random.Random):
    match req.algorithm:
        case "steepest":
            return HillClimbingSA()
        case "sideways":
            return HillClimbingSideways(max_sideways=req.max_sideways, rng=rng)
        case "random_restart":
            return HillClimbingRR(max_restart=req.max_restart, rng=rng)
        case "stochastic":
            return HillClimbingStochastic(max_iterations=req.max_iterations, rng=rng)
        case "simulated_annealing":
            return SimulatedAnnealing(req.initial_temp, req.cooling_rate, req.min_temp, rng=rng)
        case "genetic":
            return GeneticAlgorithm(req.population_size, req.iterations, req.mutation_rate, rng=rng)


def state_out(state: State, objective_name: str) -> StateOut:
    obj_fn, score_fn = OBJECTIVES[objective_name]
    placements = []
    for package, rep in zip(state.packages, state.shape_pack_models):
        w, l, h = package.get_dimension().get_dimension_orient(rep.orientation)
        x, y, z = rep.position.get_xyz()
        inside = placement_in_truck(package_box(package, rep), state.truck) == Placement.INSIDE
        placements.append(PlacementOut(
            package_id=rep.package_id, x=x, y=y, z=z, w=w, l=l, h=h,
            orientation=rep.orientation.name, inside=inside,
        ))
    return StateOut(
        placements=placements,
        objective=obj_fn(state),
        score=score_fn(state),
        violations=cnt_violations(state)._asdict(),
    )


@router.post("/solve", response_model=SolveResponse)
def solve(req: SolveRequest):
    rng = random.Random(req.seed)
    truck = Truck(Dimensions(w=req.truck.w, l=req.truck.l, h=req.truck.h), req.truck.max_cap)
    packages = [
        Package(p.id, Dimensions(w=p.w, l=p.l, h=p.h), p.value, p.weight, p.is_fragile, p.eta)
        for p in req.packages
    ]
    init = random_state(truck, packages, rng)
    algo = build_algorithm(req, rng)
    final = algo.run(init, OBJECTIVES[req.objective][1])

    history = getattr(algo, "history", [])
    history_avg = None
    if req.algorithm == "genetic":
        history, history_avg = [b for b, _ in history], [a for _, a in history]

    return SolveResponse(
        algorithm=req.algorithm,
        initial=state_out(init, req.objective),
        final=state_out(final, req.objective),
        history=history,
        history_avg=history_avg,
        prob_history=getattr(algo, "prob_history", None),
        stuck_frequency=getattr(algo, "stuck_frequency", None),
        iterations=max(len(history) - 1, 0),
        duration=getattr(algo, "duration", 0.0),
    )
