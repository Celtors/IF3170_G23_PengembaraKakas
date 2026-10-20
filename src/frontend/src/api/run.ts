import type { AlgorithmParamType, AlgorithmType } from "../features/algorithm-config/types";
import type { Dimensions, PackageSpec } from "../types/package";
import type { TruckSpec } from "../types/truck";

const ALGORITHM_NAME: Record<AlgorithmType, string> = {
    STEEPEST_HC: "steepest",
    SIDEMOVE_HC: "sideways",
    RANDOMR_HC: "random_restart",
    STOCHASTIC_HC: "stochastic",
    SIM_ANNEALING: "simulated_annealing",
    GENETIC_ALG: "genetic",
};

export type Axis = "x" | "y" | "z";
export type PlacementStatus = "inside" | "outside" | "stuck";

export interface PlacementOut {
    package_id: string;
    position: [number, number, number];
    orientation: { w: Axis; l: Axis; h: Axis };
    size: [number, number, number];
    placement: PlacementStatus;
}

export interface DimensionsIO { width: number; length: number; height: number }

export interface PackageIO {
    id: string;
    dimensions: DimensionsIO;
    weight: number;
    value: number;
    is_fragile: boolean;
    eta: number;
}

export interface StateOut {
    state: "init" | "final";
    objective_value: number;
    placements: PlacementOut[];
}

export interface RunResponse {
    run: { run_id: string; algorithm: string; started_at: string; duration_ms: number };
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

const dims = (d: Dimensions) => ({ width: d.w, length: d.l, height: d.h });

export async function runAlgorithm(
    algorithm: AlgorithmType,
    p: AlgorithmParamType,
    truck: TruckSpec,
    packages: PackageSpec[],
    seed?: number,
): Promise<RunResponse> {
    const body = {
        algorithm: ALGORITHM_NAME[algorithm],
        seed: seed ?? null,
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

    const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Backend error ${res.status}: ${await res.text()}`);
    return res.json();
}
