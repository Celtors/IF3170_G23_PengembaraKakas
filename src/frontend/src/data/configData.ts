import type {
    AlgorithmMeta,
    AlgorithmParamType,
    AlgorithmType,
    ExperimentConfigState,
    ParamFieldDef,
    ParamKey,
    PresetName,
} from "../features/algorithm-config/types";
import type {
    DimensionAxis,
    NumberFieldDef,
    PackageNumberField,
} from "../features/truck-config/types";
import type { PackageSpec } from "../types/package";
import type { TruckSpec } from "../types/truck";

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

// ---------------------------------------------------------------------------
// Truck & package config (features/truck-config)
// ---------------------------------------------------------------------------

export const DEFAULT_TRUCK: TruckSpec = {
    dimensions: { w: 10, l: 20, h: 5 },
    maxCapacity: 500,
};

// Total volume (1445) > volume peti kemas (1000) dan total berat (775) > kapasitas (500),
// sehingga tidak semua paket muat dan pencarian punya trade-off yang nyata.
export const DEFAULT_PACKAGES: PackageSpec[] = [
    { id: "PKG-1",  dimensions: { w: 4, l: 6,  h: 3 }, value: 120, weight: 40,  isFragile: false, eta: 2 },
    { id: "PKG-2",  dimensions: { w: 5, l: 8,  h: 4 }, value: 220, weight: 90,  isFragile: false, eta: 3 },
    { id: "PKG-3",  dimensions: { w: 3, l: 4,  h: 1 }, value: 60,  weight: 5,   isFragile: false, eta: 3 },
    { id: "PKG-4",  dimensions: { w: 6, l: 10, h: 3 }, value: 260, weight: 110, isFragile: true,  eta: 1 },
    { id: "PKG-5",  dimensions: { w: 4, l: 4,  h: 4 }, value: 90,  weight: 30,  isFragile: false, eta: 5 },
    { id: "PKG-6",  dimensions: { w: 2, l: 5,  h: 2 }, value: 45,  weight: 12,  isFragile: true,  eta: 4 },
    { id: "PKG-7",  dimensions: { w: 8, l: 12, h: 5 }, value: 520, weight: 200, isFragile: false, eta: 2 },
    { id: "PKG-8",  dimensions: { w: 5, l: 5,  h: 2 }, value: 70,  weight: 25,  isFragile: false, eta: 6 },
    { id: "PKG-9",  dimensions: { w: 7, l: 9,  h: 4 }, value: 310, weight: 140, isFragile: false, eta: 3 },
    { id: "PKG-10", dimensions: { w: 3, l: 6,  h: 3 }, value: 80,  weight: 20,  isFragile: true,  eta: 2 },
    { id: "PKG-11", dimensions: { w: 6, l: 6,  h: 5 }, value: 200, weight: 85,  isFragile: false, eta: 4 },
    { id: "PKG-12", dimensions: { w: 4, l: 7,  h: 2 }, value: 75,  weight: 18,  isFragile: false, eta: 7 },
];

/** Template paket baru; `id` dibuat otomatis oleh useTruckConfig. */
export const DEFAULT_NEW_PACKAGE: Omit<PackageSpec, "id"> = {
    dimensions: { w: 2, l: 2, h: 2 },
    value: 10,
    weight: 5,
    isFragile: false,
    eta: 3,
};

export const DIMENSION_AXES: { axis: DimensionAxis; label: string; short: string }[] = [
    { axis: "w", label: "Width", short: "W" },
    { axis: "l", label: "Length", short: "L" },
    { axis: "h", label: "Height", short: "H" },
];

// Koordinat bilangan bulat -> dimensi harus bilangan bulat >= 1.
export const DIMENSION_FIELD: NumberFieldDef = { label: "Dimension", step: 1, integer: true, min: 1 };

export const MAX_CAPACITY_FIELD: NumberFieldDef = {
    label: "Max capacity",
    step: 1,
    integer: true,
    min: 1,
    hint: "Total package weight the truck may carry.",
};

export const PACKAGE_NUMBER_FIELDS: Record<PackageNumberField, NumberFieldDef> = {
    value: { label: "Value", step: 1, integer: true, min: 0 },
    weight: { label: "Weight", step: 1, integer: true, min: 1 },
    eta: { label: "ETA (days)", step: 1, integer: true, min: 0 },
};
