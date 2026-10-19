import { useId } from "react";
import { ALGORITHM_METADATA, ALGORITHM_ORDER } from "../../../data/configData";
import type { AlgorithmType } from "../types";
import "./AlgorithmSelector.css";

interface AlgorithmSelectorProps {
    selectedAlgorithm: AlgorithmType;
    onSelectAlgorithm: (algorithm: AlgorithmType) => void;
}

export function AlgorithmSelector({ selectedAlgorithm, onSelectAlgorithm }: AlgorithmSelectorProps) {
    const selectId = useId();

    return (
        <div className="algorithm-selector">
            <div className="algorithm-selector__header">
                <label className="algorithm-selector__label" htmlFor={selectId}>
                    Optimization Algorithm
                </label>
            </div>

            <select
                id={selectId}
                className="algorithm-selector__select"
                value={selectedAlgorithm}
                onChange={(e) => onSelectAlgorithm(e.target.value as AlgorithmType)}
            >
                {ALGORITHM_ORDER.map((id) => (
                    <option key={id} value={id}>
                        {ALGORITHM_METADATA[id].label}
                    </option>
                ))}
            </select>

            <p className="algorithm-selector__description">
                {ALGORITHM_METADATA[selectedAlgorithm].description}
            </p>
        </div>
    );
}
