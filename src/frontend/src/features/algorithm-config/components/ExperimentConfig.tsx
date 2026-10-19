import type {
    AlgorithmParamType,
    AlgorithmType,
    ExperimentConfigState,
    GAExperimentMode,
    UpdateExperimentFn,
    ValidationIssue,
} from "../types";
import { findIssue } from "../utils/findIssue";
import { FormField } from "./FormField";
import "./ExperimentConfig.css";

interface ExperimentConfigProps {
    selectedAlgorithm: AlgorithmType;
    params: AlgorithmParamType;
    experimentConfig: ExperimentConfigState;
    issues: ValidationIssue[];
    onUpdate: UpdateExperimentFn;
}

export function ExperimentConfig({
    selectedAlgorithm,
    params,
    experimentConfig,
    issues,
    onUpdate,
}: ExperimentConfigProps) {
    const isGA = selectedAlgorithm === "GENETIC_ALG";
    const { GAMode } = experimentConfig;

    // POPULATION_CTRL: populasi dijaga tetap, iterasi divariasikan (dan sebaliknya)
    const varyKey = GAMode === "POPULATION_CTRL" ? "iterationVariation" : "populationVariation";
    const variations = experimentConfig[varyKey];

    const gaModes: { value: GAExperimentMode; title: string; detail: string }[] = [
        {
            value: "POPULATION_CTRL",
            title: "Population control",
            detail: `Population fixed at ${params.sumPopulation}; vary iterations.`,
        },
        {
            value: "ITERATION_CTRL",
            title: "Iteration control",
            detail: `Iterations fixed at ${params.iteration}; vary population.`,
        },
    ];

    const setVariation = (index: number, value: number) => {
        const next = [...variations];
        next[index] = value;
        onUpdate(varyKey, next);
    };

    return (
        <section className="experiment-config">
            <h3 className="experiment-config__title">Experiment</h3>

            <FormField label="Experiment name (optional)">
                <input
                    type="text"
                    placeholder="e.g. SA baseline"
                    value={experimentConfig.experimentName}
                    onChange={(e) => onUpdate("experimentName", e.target.value)}
                />
            </FormField>

            <FormField
                label="Runs per configuration"
                hint="The assignment requires 3 runs per configuration."
                issue={findIssue(issues, "runRepetition")}
            >
                <input
                    type="number"
                    min={1}
                    step={1}
                    value={Number.isNaN(experimentConfig.runRepetition) ? "" : experimentConfig.runRepetition}
                    onChange={(e) => onUpdate("runRepetition", e.target.valueAsNumber)}
                />
            </FormField>

            {isGA && (
                <>
                    <fieldset className="experiment-config__modes">
                        <legend className="experiment-config__modes-legend">GA experiment mode</legend>
                        {gaModes.map((mode) => (
                            <label
                                key={mode.value}
                                className={
                                    "experiment-config__mode" +
                                    (GAMode === mode.value ? " experiment-config__mode--active" : "")
                                }
                            >
                                <input
                                    type="radio"
                                    name="ga-experiment-mode"
                                    value={mode.value}
                                    checked={GAMode === mode.value}
                                    onChange={() => onUpdate("GAMode", mode.value)}
                                />
                                <span className="experiment-config__mode-text">
                                    <span className="experiment-config__mode-title">{mode.title}</span>
                                    <span className="experiment-config__mode-detail">{mode.detail}</span>
                                </span>
                            </label>
                        ))}
                    </fieldset>

                    <FormField
                        group
                        label={GAMode === "POPULATION_CTRL" ? "3 iteration values" : "3 population values"}
                        issue={findIssue(issues, varyKey)}
                    >
                        <div className="form-field__row">
                            {variations.map((value, index) => (
                                <input
                                    key={index}
                                    type="number"
                                    min={1}
                                    step={1}
                                    aria-label={`Variation ${index + 1}`}
                                    value={Number.isNaN(value) ? "" : value}
                                    onChange={(e) => setVariation(index, e.target.valueAsNumber)}
                                />
                            ))}
                        </div>
                    </FormField>
                </>
            )}
        </section>
    );
}
