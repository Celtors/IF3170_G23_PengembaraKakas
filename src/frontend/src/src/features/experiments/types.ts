import type { RunSummary, SolutionState } from "../../types/state";

export type ExperimentAlgorithm = "Hill Climbing" | "Random-Restart Hill Climbing" | "Simulated Annealing" | "Genetic Algorithm";

export interface ExperimentRun {
    id: string;
    name: string;
    algorithm: ExperimentAlgorithm;
    states: SolutionState[];
    summary: RunSummary;
    runtimeMs: number | null;
    populationSize?: number;
    configuredIterations?: number;
    metrics: Record<string, unknown>;
    /** Optional backend telemetry. Missing values are shown as unavailable, never synthesized. */
    acceptanceProbabilityHistory?: { iteration: number; value: number }[];
    stuckFrequency?: number;
    populationObjectiveHistory?: { iteration: number; maximum: number; average: number }[];
    restartHistory?: { restart: number; iterations: number; objectiveValue?: number }[];
    source: "mock" | "backend";
}