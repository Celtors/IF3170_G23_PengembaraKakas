import { PARAM_FIELDS, PRESETS } from "../../../data/configData";
import type {
    AlgorithmMeta,
    AlgorithmParamType,
    PresetName,
    UpdateParamFn,
    ValidationIssue,
} from "../types";
import { findIssue } from "../utils/findIssue";
import { FormField } from "./FormField";
import "./AlgorithmParameters.css";

interface AlgorithmParametersProps {
    meta: AlgorithmMeta;
    params: AlgorithmParamType;
    issues: ValidationIssue[];
    onUpdateParam: UpdateParamFn;
    onApplyPreset: (preset: PresetName) => void;
    onReset: () => void;
}

export function AlgorithmParameters({
    meta,
    params,
    issues,
    onUpdateParam,
    onApplyPreset,
    onReset,
}: AlgorithmParametersProps) {
    const hasParams = meta.paramKeys.length > 0;

    return (
        <section className="algorithm-parameters">
            <div className="algorithm-parameters__header">
                <h3 className="algorithm-parameters__title">Parameters</h3>
                <button
                    type="button"
                    className="algorithm-parameters__reset"
                    title="Reset parameters and experiment settings to defaults"
                    onClick={onReset}
                >
                    Reset
                </button>
            </div>

            {!hasParams && (
                <p className="algorithm-parameters__empty">
                    This algorithm has no tunable parameters.
                </p>
            )}

            {hasParams && (
                <>
                    <div className="algorithm-parameters__presets" role="group" aria-label="Presets">
                        {(Object.keys(PRESETS) as PresetName[]).map((name) => (
                            <button
                                key={name}
                                type="button"
                                className="algorithm-parameters__preset"
                                onClick={() => onApplyPreset(name)}
                            >
                                {PRESETS[name].label}
                            </button>
                        ))}
                    </div>

                    <div className="algorithm-parameters__fields">
                        {meta.paramKeys.map((key) => {
                            const def = PARAM_FIELDS[key];
                            const value = params[key];
                            return (
                                <FormField
                                    key={key}
                                    label={def.label}
                                    hint={def.hint}
                                    issue={findIssue(issues, key)}
                                >
                                    <input
                                        type="number"
                                        min={def.min}
                                        max={def.max}
                                        step={def.step}
                                        value={Number.isNaN(value) ? "" : value}
                                        onChange={(e) => onUpdateParam(key, e.target.valueAsNumber)}
                                    />
                                </FormField>
                            );
                        })}
                    </div>
                </>
            )}
        </section>
    );
}
