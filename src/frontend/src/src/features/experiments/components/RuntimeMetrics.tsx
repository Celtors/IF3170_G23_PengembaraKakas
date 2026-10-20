import React from "react";
import type { ExperimentRun } from "../types";

export const RuntimeMetrics: React.FC<{ run: ExperimentRun }> = ({ run }) => {
    const metrics = [
        { label: "Initial objective", value: run.summary.initialObjective.toLocaleString() },
        { label: "Best objective", value: run.summary.bestObjective.toLocaleString() },
        { label: "Final objective", value: run.summary.finalObjective.toLocaleString() },
        { label: "Recorded iterations", value: run.summary.totalIterations.toLocaleString() },
        { label: "Runtime", value: run.runtimeMs === null ? "Not reported" : `${run.runtimeMs.toFixed(2)} ms` },
    ];
    return <div className="experiment-metrics-grid">{metrics.map((metric) => <div className="experiment-metric" key={metric.label}><span>{metric.label}</span><strong>{metric.value}</strong></div>)}</div>;
};
