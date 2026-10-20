import type { RunSummary, SolutionState } from "../../types/state";

export type ExperimentAlgorithm = "Hill Climbing" | "Simulated Annealing" | "Genetic Algorithm";

export interface ExperimentRun {
    id: string;
    name: string;
    algorithm: ExperimentAlgorithm;
    states: SolutionState[];
    summary: RunSummary;
    runtimeMs: number | null;
    populationSize?: number;
    configuredIterations?: number;
    metrics: Record<string, number | string | null>;
    source: "mock" | "backend";
}