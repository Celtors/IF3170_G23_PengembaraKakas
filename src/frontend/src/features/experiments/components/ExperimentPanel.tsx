import React from "react";
import { useExperimentResults } from "../hooks/useExperimentResults";
import { AlgorithmMetrics } from "./AlgorithmMetrics";
import { ExperimentSelector } from "./ExperimentSelector";
import { ObjectiveChart } from "./ObjectiveChart";
import { RuntimeMetrics } from "./RuntimeMetrics";
import "./ExperimentPanel.css";

export const ExperimentPanel: React.FC = () => {
    const { selectedAlgorithm, setSelectedAlgorithm, runs, selectedRun, setSelectedRunId } = useExperimentResults();
    return <div className="experiment-panel">
        <div className="experiment-panel__intro"><div><h2>Experiment results</h2><p>Compare objective history and algorithm metrics.</p></div><span className="experiment-source-badge">{selectedRun.source === "mock" ? "MOCK DATA" : "BACKEND"}</span></div>
        <ExperimentSelector algorithm={selectedAlgorithm} onAlgorithmChange={setSelectedAlgorithm} runs={runs} selectedRunId={selectedRun.id} onRunChange={setSelectedRunId} />
        <div className="experiment-panel__notice">This is demonstration data from the frontend fixture, not a measured algorithm run. Runtime and unavailable telemetry are intentionally shown as unavailable.</div>
        <RuntimeMetrics run={selectedRun} />
        <ObjectiveChart states={selectedRun.states} />
        <AlgorithmMetrics run={selectedRun} />
    </div>;
};
