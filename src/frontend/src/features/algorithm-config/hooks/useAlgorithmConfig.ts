import { useCallback, useMemo, useState } from "react";
import {
    ALGORITHM_METADATA,
    DEFAULT_EXPERIMENT_CONFIG,
    DEFAULT_PARAMS,
    PRESETS,
} from "../../../data/configData";
import type {
    AlgorithmParamType,
    AlgorithmType,
    ExperimentConfigState,
    PresetName,
    ValidationIssue,
} from "../types";
import { validateConfig } from "../utils/validateConfig";

export function useAlgorithmConfig(
    initialAlgorithm: AlgorithmType = "STEEPEST_HC",
    initialParams: Partial<AlgorithmParamType> = {},
    initialExperiment: Partial<ExperimentConfigState> = {},
) {
    const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>(initialAlgorithm);
    const [params, setParams] = useState<AlgorithmParamType>({ ...DEFAULT_PARAMS, ...initialParams });
    const [experimentConfig, setExperimentConfig] = useState<ExperimentConfigState>({
        ...DEFAULT_EXPERIMENT_CONFIG,
        ...initialExperiment,
    });

    const updateParam = useCallback(
        <K extends keyof AlgorithmParamType>(key: K, value: AlgorithmParamType[K]) => {
            setParams((prev) => ({ ...prev, [key]: value }));
        },
        [],
    );

    const updateExperimentConfig = useCallback(
        <K extends keyof ExperimentConfigState>(key: K, value: ExperimentConfigState[K]) => {
            setExperimentConfig((prev) => ({ ...prev, [key]: value }));
        },
        [],
    );

    const applyPreset = useCallback((presetName: PresetName) => {
        setParams((prev) => ({ ...prev, ...PRESETS[presetName].params }));
    }, []);

    const resetToDefaults = useCallback(() => {
        setParams(DEFAULT_PARAMS);
        setExperimentConfig(DEFAULT_EXPERIMENT_CONFIG);
    }, []);

    const validationIssues = useMemo<ValidationIssue[]>(
        () => validateConfig(selectedAlgorithm, params, experimentConfig),
        [selectedAlgorithm, params, experimentConfig],
    );

    const isValid = useMemo(
        () => !validationIssues.some((issue) => issue.severity === "error"),
        [validationIssues],
    );

    return {
        selectedAlgorithm,
        setSelectedAlgorithm,
        params,
        updateParam,
        experimentConfig,
        updateExperimentConfig,
        resetToDefaults,
        applyPreset,
        validationIssues,
        isValid,
        currentMeta: ALGORITHM_METADATA[selectedAlgorithm],
    };
}
