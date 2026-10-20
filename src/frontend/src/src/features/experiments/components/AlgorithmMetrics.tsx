import React from "react";
import type { ExperimentRun } from "../types";
import "./AlgorithmMetrics.css";

type Point = { iteration: number; value: number };

function MetricLineChart({ title, yLabel, series }: {
    title: string;
    yLabel: string;
    series: { label: string; points: Point[]; className?: string }[];
}) {
    const all = series.flatMap((item) => item.points).filter((point) => Number.isFinite(point.value));
    if (all.length < 2) return <section className="algorithm-metric-chart"><h4>{title}</h4><p className="algorithm-metrics__empty">Telemetry is not available for this run. The backend must return the per-iteration series.</p></section>;
    const width = 680, height = 220, left = 58, right = 18, top = 24, bottom = 34;
    const minX = Math.min(0, ...all.map((p) => p.iteration));
    const maxX = Math.max(1, ...all.map((p) => p.iteration));
    const minY = Math.min(0, ...all.map((p) => p.value));
    const maxY = Math.max(minY + 1, ...all.map((p) => p.value));
    const x = (v: number) => left + (v - minX) / (maxX - minX) * (width - left - right);
    const y = (v: number) => top + (1 - (v - minY) / (maxY - minY)) * (height - top - bottom);
    return <section className="algorithm-metric-chart"><div className="algorithm-metric-chart__heading"><h4>{title}</h4><span>{yLabel}</span></div>
        <div className="algorithm-metric-chart__legend">{series.map((item) => <span key={item.label} className={item.className}>{item.label}</span>)}</div>
        <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title}>
            {[0, 1, 2, 3].map((i) => { const value = minY + (maxY - minY) * i / 3; return <g key={i}><line x1={left} x2={width-right} y1={y(value)} y2={y(value)} className="algorithm-metric-chart__grid"/><text x={left-8} y={y(value)+4} textAnchor="end" className="algorithm-metric-chart__tick">{value.toPrecision(3)}</text></g>; })}
            {series.map((item) => { const points = item.points.filter((p) => Number.isFinite(p.value)); const d = points.map((p, i) => `${i ? "L" : "M"}${x(p.iteration)},${y(p.value)}`).join(" "); return <path key={item.label} d={d} className={`algorithm-metric-chart__line ${item.className ?? ""}`} />; })}
            <text x={left} y={height-8} className="algorithm-metric-chart__tick">Iteration {minX}</text><text x={width-right} y={height-8} textAnchor="end" className="algorithm-metric-chart__tick">Iteration {maxX}</text>
        </svg>
    </section>;
}

const number = (value: unknown): number | null => typeof value === "number" && Number.isFinite(value) ? value : null;

export const AlgorithmMetrics: React.FC<{ run: ExperimentRun }> = ({ run }) => {
    if (run.algorithm === "Random-Restart Hill Climbing") {
        const rows = [
            ["Maximum restarts", run.metrics["Maximum restarts"] ?? run.metrics.max_restart],
            ["Iterations per restart", run.metrics["Iterations per restart"] ?? run.metrics.iterations_per_restart],
            ["Restarts completed", run.restartHistory?.length || run.metrics.restarts_completed],
        ] as const;
        return <section className="algorithm-metrics"><h3>Random-Restart Hill-Climbing metrics</h3><table className="algorithm-metrics__table"><thead><tr><th>Metric</th><th>Value</th></tr></thead><tbody>{rows.map(([label, value]) => <tr key={label}><td>{label}</td><td>{value === undefined || value === null || value === "" ? "Not reported" : String(value)}</td></tr>)}</tbody></table>
            {run.restartHistory?.length ? <table className="algorithm-metrics__table"><thead><tr><th>Restart</th><th>Iterations</th><th>Objective</th></tr></thead><tbody>{run.restartHistory.map((row) => <tr key={row.restart}><td>{row.restart}</td><td>{row.iterations}</td><td>{row.objectiveValue ?? "Not reported"}</td></tr>)}</tbody></table> : <p className="algorithm-metrics__note">Per-restart details appear when the backend supplies <code>restartHistory</code>.</p>}</section>;
    }
    if (run.algorithm === "Simulated Annealing") {
        const points = run.acceptanceProbabilityHistory ?? (Array.isArray(run.metrics.acceptance_probability_history) ? run.metrics.acceptance_probability_history as Point[] : []);
        const stuck = number(run.stuckFrequency ?? run.metrics.stuck_frequency ?? run.metrics.stuck_count);
        return <section className="algorithm-metrics"><h3>Simulated Annealing metrics</h3><div className="algorithm-metric-summary"><span>Stuck frequency</span><strong>{stuck === null ? "Not reported" : stuck.toLocaleString()}</strong><small>{run.metrics.stuck_frequency !== undefined ? "Backend-reported value" : "Count/frequency must be supplied by backend"}</small></div>
            <MetricLineChart title="Acceptance term e^(ΔE/T) per iteration" yLabel="e^(ΔE/T)" series={[{ label: "e^(ΔE/T)", points: points.map((p) => ({ iteration: p.iteration, value: p.value })) }]} />
        </section>;
    }
    if (run.algorithm === "Genetic Algorithm") {
        const history = run.populationObjectiveHistory ?? (Array.isArray(run.metrics.population_objective_history) ? run.metrics.population_objective_history as { iteration: number; maximum: number; average: number }[] : []);
        const population = number(run.populationSize ?? run.metrics.population_size ?? run.metrics["Population size"]);
        return <section className="algorithm-metrics"><h3>Genetic Algorithm metrics</h3><div className="algorithm-metric-summary"><span>Population size for this run</span><strong>{population === null ? "Not reported" : population.toLocaleString()}</strong></div>
            <MetricLineChart title="Population objective per iteration" yLabel="Objective value" series={[
                { label: "Maximum objective", points: history.map((p) => ({ iteration: p.iteration, value: p.maximum })), className: "algorithm-metric-chart__line--max" },
                { label: "Average objective", points: history.map((p) => ({ iteration: p.iteration, value: p.average })), className: "algorithm-metric-chart__line--average" },
            ]} />
        </section>;
    }
    return <section className="algorithm-metrics"><h3>Algorithm-specific metrics</h3><table className="algorithm-metrics__table"><thead><tr><th>Metric</th><th>Value</th></tr></thead><tbody>{Object.entries(run.metrics).map(([label, value]) => <tr key={label}><td>{label}</td><td>{value === null || value === undefined ? "Not reported" : String(value)}</td></tr>)}</tbody></table></section>;
};
