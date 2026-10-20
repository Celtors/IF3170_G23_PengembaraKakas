import React from "react";
import type { ExperimentAlgorithm, ExperimentRun } from "../types";

interface Props {
    algorithm: ExperimentAlgorithm;
    onAlgorithmChange: (algorithm: ExperimentAlgorithm) => void;
    runs: ExperimentRun[];
    selectedRunId: string;
    onRunChange: (id: string) => void;
}

export const ExperimentSelector: React.FC<Props> = ({ algorithm, onAlgorithmChange, runs, selectedRunId, onRunChange }) => (
    <div className="experiment-selectors">
        <label>Algorithm<select value={algorithm} onChange={(event) => onAlgorithmChange(event.target.value as ExperimentAlgorithm)}><option>Hill Climbing</option><option>Random-Restart Hill Climbing</option><option>Simulated Annealing</option><option>Genetic Algorithm</option></select></label>
        <label>Run<select value={selectedRunId} onChange={(event) => onRunChange(event.target.value)}>{runs.map((run) => <option value={run.id} key={run.id}>{run.name}</option>)}</select></label>
    </div>
);
