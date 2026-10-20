import { ALGORITHM_METADATA, PARAM_FIELDS } from "../../../data/configData";
import type {
    AlgorithmParamType,
    AlgorithmType,
    ExperimentConfigState,
    ValidationIssue,
} from "../types";

export function validateConfig(
    algorithm: AlgorithmType,
    params: AlgorithmParamType,
    experiment: ExperimentConfigState,
): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    const add = (
        field: ValidationIssue["field"],
        message: string,
        severity: ValidationIssue["severity"] = "error",
    ) => issues.push({ field, message, severity });

    // 1. Aturan generik per parameter milik algoritma terpilih
    for (const key of ALGORITHM_METADATA[algorithm].paramKeys) {
        const def = PARAM_FIELDS[key];
        const value = params[key];

        if (!Number.isFinite(value)) {
            add(key, "Enter a number.");
        } else if (def.integer && !Number.isInteger(value)) {
            add(key, "Must be a whole number.");
        } else if (def.min !== undefined && value < def.min) {
            add(key, `Must be at least ${def.min}.`);
        } else if (def.max !== undefined && value > def.max) {
            add(key, `Must be at most ${def.max}.`);
        }
    }

    const has = (key: keyof AlgorithmParamType) => !issues.some((i) => i.field === key);

    // 2. Aturan khusus algoritma
    if (algorithm === "RANDOMR_HC" && has("maxIterationsPerRestart") && params.maxIterationsPerRestart < 1) {
        add("maxIterationsPerRestart", "Iterations per restart must be at least 1.");
    }

    if (algorithm === "STOCHASTIC_HC" && has("maxIterations") && params.maxIterations < 10) {
        add("maxIterations", "Max iterations is low; search may end prematurely.", "warning");
    }

    if (algorithm === "SIM_ANNEALING") {
        if (has("initialTemp") && params.initialTemp < 10) {
            add("initialTemp", "T₀ is low; little room for exploration.", "warning");
        }
        if (has("initialTemp") && has("minTemp") && params.minTemp >= params.initialTemp) {
            add("minTemp", "Minimum temperature must be lower than the initial temperature.");
        }
    }

    if (algorithm === "GENETIC_ALG" && has("iteration") && params.iteration < 10) {
        add("iteration", "Iterations are low; the population may not converge.", "warning");
    }

    // 3. Konfigurasi eksperimen
    if (!Number.isInteger(experiment.runRepetition) || experiment.runRepetition < 1) {
        add("runRepetition", "Run repetition must be a whole number of at least 1.");
    }

    if (algorithm === "GENETIC_ALG") {
        // POPULATION_CTRL: populasi tetap, iterasi divariasikan (dan sebaliknya)
        const varyPopulation = experiment.GAMode === "ITERATION_CTRL";
        const field = varyPopulation ? "populationVariation" : "iterationVariation";
        const values = varyPopulation ? experiment.populationVariation : experiment.iterationVariation;
        const minValue = varyPopulation ? PARAM_FIELDS.sumPopulation.min! : 1;

        if (values.length !== 3) {
            add(field, "Provide exactly 3 variations.");
        } else if (values.some((v) => !Number.isInteger(v) || v < minValue)) {
            add(field, `Each value must be a whole number of at least ${minValue}.`);
        } else if (new Set(values).size !== values.length) {
            add(field, "The 3 variations must be different from each other.");
        }
    }

    return issues;
}
