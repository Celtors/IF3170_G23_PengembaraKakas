export type AlgorithmType =
    | "STEEPEST_HC"
    | "SIDEMOVE_HC"
    | "RANDOMR_HC"
    | "STOCHASTIC_HC"
    | "SIM_ANNEALING"
    | "GENETIC_ALG";

export interface AlgorithmParamType {
    // Hill-climbing
    maxSidewaysMove: number;   // SIDEMOVE_HC
    maxRestart: number;        // RANDOMR_HC
    maxIterations: number;     // STOCHASTIC_HC
    // Genetic Algorithm
    sumPopulation: number;
    iteration: number;
    mutationRate: number;
    // Simulated Annealing
    initialTemp: number;
    coolingRate: number;
    minTemp: number;
}

export type ParamKey = keyof AlgorithmParamType;

export type GAExperimentMode = "POPULATION_CTRL" | "ITERATION_CTRL";

export interface ExperimentConfigState {
    experimentName: string;
    runRepetition: number;
    GAMode: GAExperimentMode;
    populationVariation: number[];
    iterationVariation: number[];
}

export type PresetName = "FAST_TEST" | "ACADEMIC_BENCHMARK" | "DEEP_SEARCH";

export interface ParamFieldDef {
    label: string;
    step: number;
    integer: boolean;
    min?: number;
    max?: number;
    hint?: string;
}

export interface AlgorithmMeta {
    label: string;
    description: string;
    paramKeys: ParamKey[];
}

export type IssueSeverity = "error" | "warning";

export interface ValidationIssue {
    field: ParamKey | keyof ExperimentConfigState;
    message: string;
    severity: IssueSeverity;
}

export type UpdateParamFn = <K extends ParamKey>(key: K, value: AlgorithmParamType[K]) => void;

export type UpdateExperimentFn = <K extends keyof ExperimentConfigState>(
    key: K,
    value: ExperimentConfigState[K],
) => void;
