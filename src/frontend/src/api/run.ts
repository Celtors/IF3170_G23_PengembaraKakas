import type { AlgorithmParamType, AlgorithmType, ExperimentConfigState } from "../features/algorithm-config/types";
import type { Dimensions, PackageSpec } from "../types/package";
import type { TruckSpec } from "../types/truck";
import type { Orientation, SolutionState } from "../types/state";

/** Backend algorithm identifiers accepted by backend/app/api/schemas.py. */
const ALGORITHM_NAME: Record<AlgorithmType, string> = {
    STEEPEST_HC: "steepest",
    SIDEMOVE_HC: "sideways",
    RANDOMR_HC: "random_restart",
    STOCHASTIC_HC: "stochastic",
    SIM_ANNEALING: "simulated_annealing",
    GENETIC_ALG: "genetic",
};

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000").replace(/\/$/, "");

type Axis = "x" | "y" | "z";
type PlacementStatus = "inside" | "outside" | "stuck";
export interface DimensionsIO { width: number; length: number; height: number }
export interface PackageIO {
    id: string;
    dimensions: DimensionsIO;
    weight: number;
    value: number;
    is_fragile: boolean;
    eta: number;
    model_url?: string | null;
}
export interface PlacementOut {
    package_id: string;
    position: [number, number, number];
    orientation: { w: Axis; l: Axis; h: Axis };
    size: [number, number, number];
    placement: PlacementStatus;
}
export interface StateOut {
    state: "init" | "final";
    objective_value: number;
    placements: PlacementOut[];
}
export interface RunResponse {
    schema_version: "1.0";
    run: {
        run_id: string;
        algorithm: string;
        status: "completed";
        started_at: string;
        duration_ms: number;
    };
    problem: { truck: DimensionsIO & { max_capacity: number }; packages: PackageIO[] };
    states: StateOut[];
    experiment: {
        iterations: number;
        initial_objective: number;
        final_objective: number;
        best_objective: number;
        objective_history: number[];
        algorithm_metrics: Record<string, unknown>;
    };
}
export interface ExperimentResponse {
    schema_version: "1.0";
    name: string;
    algorithm: string;
    variations: { params: Record<string, number>; runs: RunResponse[] }[];
}

const dims = (d: Dimensions): DimensionsIO => ({ width: d.w, length: d.l, height: d.h });

function buildBody(
    algorithm: AlgorithmType,
    p: AlgorithmParamType,
    truck: TruckSpec,
    packages: PackageSpec[],
    seed?: number,
) {
    return {
        algorithm: ALGORITHM_NAME[algorithm],
        seed: seed ?? null,
        objective: "score",
        params: {
            max_sideways: p.maxSidewaysMove,
            max_restart: p.maxRestart,
            max_iterations: p.maxIterations,
            population_size: p.sumPopulation,
            iterations: p.iteration,
            mutation_rate: p.mutationRate,
            initial_temp: p.initialTemp,
            cooling_rate: p.coolingRate,
            min_temp: p.minTemp,
        },
        problem: {
            truck: { ...dims(truck.dimensions), max_capacity: truck.maxCapacity },
            packages: packages.map((pkg) => ({
                id: pkg.id,
                dimensions: dims(pkg.dimensions),
                weight: pkg.weight,
                value: pkg.value,
                is_fragile: pkg.isFragile,
                eta: pkg.eta,
            })),
        },
    };
}

async function post<T>(path: string, body: unknown, signal?: AbortSignal): Promise<T> {
    let response: Response;
    try {
        response = await fetch(`${API_BASE_URL}${path}`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify(body),
            signal,
        });
    } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") throw error;
        throw new Error(`Tidak dapat terhubung ke backend di ${API_BASE_URL}. Pastikan FastAPI berjalan dan VITE_API_BASE_URL benar.`);
    }

    const text = await response.text();
    let payload: unknown;
    try { payload = text ? JSON.parse(text) : null; }
    catch { payload = text; }

    if (!response.ok) {
        const detail = typeof payload === "object" && payload !== null && "detail" in payload
            ? JSON.stringify((payload as { detail: unknown }).detail)
            : typeof payload === "string" ? payload : JSON.stringify(payload);
        throw new Error(`Backend ${response.status}: ${detail || response.statusText}`);
    }
    return payload as T;
}

/** POST /api/run. The backend route calls app.services.normal_run.run_once. */
export function runAlgorithm(
    algorithm: AlgorithmType,
    p: AlgorithmParamType,
    truck: TruckSpec,
    packages: PackageSpec[],
    seed?: number,
    signal?: AbortSignal,
): Promise<RunResponse> {
    return post<RunResponse>("/api/run", buildBody(algorithm, p, truck, packages, seed), signal);
}

/** POST /api/experiment. Experiments are handled separately by the backend experiment service. */
export function runExperiment(
    algorithm: AlgorithmType,
    p: AlgorithmParamType,
    exp: ExperimentConfigState,
    truck: TruckSpec,
    packages: PackageSpec[],
    seed?: number,
    signal?: AbortSignal,
): Promise<ExperimentResponse> {
    return post<ExperimentResponse>("/api/experiment", {
        ...buildBody(algorithm, p, truck, packages, seed),
        experiment: {
            name: exp.experimentName,
            repetitions: exp.runRepetition,
            // Backend schema defines ga_mode as "population" or "iteration".
            ga_mode: exp.GAMode === "POPULATION_CTRL" ? "population" : "iteration",
            population_variation: exp.populationVariation,
            iteration_variation: exp.iterationVariation,
        },
    }, signal);
}

/** Adapt backend tuple/snake_case response data to the frontend's existing state types. */
export function toSolutionStates(response: RunResponse): SolutionState[] {
    return response.states.map((state, index) => ({
        index,
        iteration: index === 0 ? 0 : response.experiment.iterations,
        objectiveValue: state.objective_value,
        placements: state.placements.map((placement) => ({
            packageId: placement.package_id,
            orientation: placement.orientation as Orientation,
            // Frontend uses null to stage packages outside the container. The backend's
            // placement status is authoritative; outside/stuck coordinates aren't rendered as inside.
            position: placement.placement === "inside"
                ? { x: placement.position[0], y: placement.position[1], z: placement.position[2] }
                : null,
        })),
    }));
}

export function toRunSummary(response: RunResponse) {
    return {
        totalIterations: response.experiment.iterations,
        initialObjective: response.experiment.initial_objective,
        bestObjective: response.experiment.best_objective,
        finalObjective: response.experiment.final_objective,
    };
}
