import type {
    AlgorithmMeta,
    AlgorithmParamType,
    AlgorithmType,
    ExperimentConfigState,
    ParamFieldDef,
    ParamKey,
    PresetName,
} from "../features/algorithm-config/types";

// Sama dengan preset MODERATE_SEARCH.
export const DEFAULT_PARAMS: AlgorithmParamType = {
    maxSidewaysMove: 10,
    maxRestart: 5,
    maxIterations: 100,
    sumPopulation: 20,
    iteration: 100,
    mutationRate: 0.1,
    initialTemp: 500,
    coolingRate: 0.95,
    minTemp: 1,
};

export const DEFAULT_EXPERIMENT_CONFIG: ExperimentConfigState = {
    experimentName: "",
    runRepetition: 3,
    GAMode: "POPULATION_CTRL",
    populationVariation: [10, 20, 40],
    iterationVariation: [50, 100, 200],
};

export const PRESETS: Record<PresetName, { label: string; params: Partial<AlgorithmParamType> }> = {
    FAST_SEARCH: {
        label: "Fast search",
        params: {
            maxIterations: 30,
            iteration: 30,
            maxSidewaysMove: 5,
            maxRestart: 3,
            initialTemp: 200,
            coolingRate: 0.9,
            sumPopulation: 10,
        },
    },
    MODERATE_SEARCH: {
        label: "Moderate Search",
        params: {
            maxIterations: 100,
            iteration: 100,
            maxSidewaysMove: 10,
            maxRestart: 5,
            initialTemp: 500,
            coolingRate: 0.95,
            sumPopulation: 20,
        },
    },
    DEEP_SEARCH: {
        label: "Deep search",
        params: {
            maxIterations: 300,
            iteration: 300,
            maxSidewaysMove: 25,
            maxRestart: 10,
            initialTemp: 1000,
            coolingRate: 0.98,
            sumPopulation: 50,
        },
    },
};

export const PARAM_FIELDS: Record<ParamKey, ParamFieldDef> = {
    maxSidewaysMove: { label: "Max sideways move", step: 1, integer: true, min: 1,
        hint: "Search stops once this many sideways moves have been made." },
    maxRestart: { label: "Max restart", step: 1, integer: true, min: 1,
        hint: "Search stops once this many restarts have been made." },
    maxIterations: { label: "Max iterations", step: 1, integer: true, min: 1,
        hint: "Upper bound on iterations before the search stops." },
    sumPopulation: { label: "Population size", step: 1, integer: true, min: 4,
        hint: "At least 4 so crossover has enough parents." },
    iteration: { label: "Iterations (generations)", step: 1, integer: true, min: 1 },
    mutationRate: { label: "Mutation rate", step: 0.01, integer: false, min: 0, max: 1 },
    initialTemp: { label: "Initial temperature (T₀)", step: 1, integer: false, min: 0.001 },
    coolingRate: { label: "Cooling rate (α)", step: 0.001, integer: false, min: 0.5, max: 0.999,
        hint: "T ← T × α each iteration." },
    minTemp: { label: "Minimum temperature", step: 0.01, integer: false, min: 0.0001,
        hint: "Search stops when T falls below this value." },
};

export const ALGORITHM_METADATA: Record<AlgorithmType, AlgorithmMeta> = {
    STEEPEST_HC: {
        label: "Steepest-Ascent Hill Climbing",
        description: "Always moves to the best neighbor; stops at a local optimum.",
        paramKeys: [],
    },
    STOCHASTIC_HC: {
        label: "Stochastic Hill Climbing",
        description: "Picks a random improving neighbor each iteration.",
        paramKeys: ["maxIterations"],
    },
    SIDEMOVE_HC: {
        label: "Hill Climbing with Sideways Move",
        description: "Allows moves to equal-valued neighbors, up to a limit.",
        paramKeys: ["maxSidewaysMove"],
    },
    RANDOMR_HC: {
        label: "Random-Restart Hill Climbing",
        description: "Repeats hill climbing from random initial states.",
        paramKeys: ["maxRestart"],
    },
    SIM_ANNEALING: {
        label: "Simulated Annealing",
        description: "Accepts worse moves with probability e^(ΔE/T) while T cools.",
        paramKeys: ["initialTemp", "coolingRate", "minTemp"],
    },
    GENETIC_ALG: {
        label: "Genetic Algorithm",
        description: "Evolves a population through selection, crossover and mutation.",
        paramKeys: ["sumPopulation", "iteration", "mutationRate"],
    },
};

export const ALGORITHM_ORDER: AlgorithmType[] = [
    "STEEPEST_HC",
    "STOCHASTIC_HC",
    "SIDEMOVE_HC",
    "RANDOMR_HC",
    "SIM_ANNEALING",
    "GENETIC_ALG",
];
