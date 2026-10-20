export type Axis = "x" | "y" | "z";
export type PlacementStatus = "inside" | "outside" | "stuck";

export interface PlacementOut {
    package_id: string;
    position: [number, number, number]; // [x, y, z]
    orientation: [Axis, Axis, Axis];
    placement: PlacementStatus;
}

export interface StateOut {
    state: "init" | "final";
    objective_value: number;
    placements: PlacementOut[];
}

export interface ExperimentStats {
    iterations: number;
    initial_objective: number;
    final_objective: number;
    best_objective: number;
    objective_history: number[];
    algorithm_metrics: Record<string, any>;
}

export interface RunInfo {
    run_id: string;
    algorithm: string;
    status: "completed";
    started_at: string;
    duration_ms: number;
}

export interface RunResponse {
    schema_version: string;
    run: RunInfo;
    problem: any;
    states: StateOut[];
    experiment: ExperimentStats;
}