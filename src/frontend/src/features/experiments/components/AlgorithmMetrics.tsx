import React from "react";
import type { ExperimentRun } from "../types";

export const AlgorithmMetrics: React.FC<{ run: ExperimentRun }> = ({ run }) => (
    <section className="algorithm-metrics">
        <h3>Algorithm-specific metrics</h3>
        <dl>{Object.entries(run.metrics).map(([label, value]) => <div className="algorithm-metric-row" key={label}><dt>{label}</dt><dd>{value === null || value === undefined ? "Not reported" : String(value)}</dd></div>)}</dl>
        {run.algorithm === "Genetic Algorithm" && <p className="algorithm-metrics__note">The assignment requires maximum and average population objective history. This fixture contains only a single objective value per recorded state; connect the backend's population statistics to display both curves.</p>}
        {run.algorithm === "Simulated Annealing" && <p className="algorithm-metrics__note">Temperature, acceptance probability (e^(ΔE/T)), and stuck-frequency metrics require corresponding backend telemetry.</p>}
    </section>
);
