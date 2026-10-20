import React from "react";
import type { RunResponse } from "../../../api/run";
import { AlgorithmMetrics } from "./AlgorithmMetrics";
import type { ExperimentRun } from "../types";

const asNumber = (value: unknown): number | null => typeof value === "number" && Number.isFinite(value) ? value : null;
const pick = (metrics: Record<string, unknown>, ...keys: string[]) => keys.map((key) => metrics[key]).find((value) => value !== undefined && value !== null);

/** Renders telemetry returned by the real API. Missing telemetry stays explicitly unavailable. */
export function BackendAlgorithmMetrics({ response }: { response: RunResponse }) {
    const algorithm = response.run.algorithm.toLowerCase();
    const metrics = response.experiment.algorithm_metrics ?? {};
    const metricNumber = (...keys: string[]) => asNumber(pick(metrics, ...keys));
    const rawAcceptance = pick(metrics, "acceptance_probability_history", "exp_delta_e_over_t_history", "e_delta_e_over_t_history", "delta_e_over_t_history");
    const acceptanceHistory = Array.isArray(rawAcceptance) ? rawAcceptance.map((item, index) => {
        const point = item as Record<string, unknown>;
        return { iteration: asNumber(point.iteration) ?? index, value: asNumber(point.value ?? point.exp_delta_e_over_t ?? point.e_delta_e_over_t ?? point.probability) ?? Number.NaN };
    }) : undefined;
    const rawPopulation = pick(metrics, "population_objective_history", "population_history");
    const populationHistory = Array.isArray(rawPopulation) ? rawPopulation.map((item, index) => {
        const point = item as Record<string, unknown>;
        return { iteration: asNumber(point.iteration) ?? index, maximum: asNumber(point.maximum ?? point.max_objective ?? point.objective_max) ?? Number.NaN, average: asNumber(point.average ?? point.avg_objective ?? point.objective_average) ?? Number.NaN };
    }) : undefined;
    const toRun = (name: ExperimentRun["algorithm"]): ExperimentRun => ({
        id: response.run.run_id, name: response.run.run_id, algorithm: name,
        states: [], summary: { totalIterations: response.experiment.iterations, initialObjective: response.experiment.initial_objective, bestObjective: response.experiment.best_objective, finalObjective: response.experiment.final_objective },
        runtimeMs: response.run.duration_ms, metrics, source: "backend",
        populationSize: metricNumber("population_size", "populationSize" ) ?? undefined,
        configuredIterations: response.experiment.iterations,
        acceptanceProbabilityHistory: acceptanceHistory,
        stuckFrequency: metricNumber("stuck_frequency", "stuck_count", "stuck_events") ?? undefined,
        populationObjectiveHistory: populationHistory,
        restartHistory: (pick(metrics, "restart_history", "per_restart") as { restart: number; iterations: number; objectiveValue?: number }[] | undefined),
    });

    if (algorithm.includes("simulated") || algorithm.includes("anneal")) return <AlgorithmMetrics run={toRun("Simulated Annealing")} />;
    if (algorithm.includes("genetic")) return <AlgorithmMetrics run={toRun("Genetic Algorithm")} />;
    if (algorithm.includes("random_restart") || algorithm.includes("random-restart") || algorithm.includes("random restart")) {
        const run = toRun("Random-Restart Hill Climbing");
        const restartCount = metricNumber("max_restart", "maximum_restarts", "max_restarts");
        const perRestart = metricNumber("iterations_per_restart", "max_iterations_per_restart");
        return <section className="algorithm-metrics"><h3>Random-Restart Hill-Climbing metrics</h3><table className="algorithm-metrics__table"><thead><tr><th>Metric</th><th>Value</th></tr></thead><tbody>
            <tr><td>Maximum restarts</td><td>{restartCount ?? "Not reported"}</td></tr>
            <tr><td>Iterations per restart</td><td>{perRestart ?? "Not reported"}</td></tr>
            <tr><td>Restarts completed</td><td>{run.restartHistory?.length || metricNumber("restarts_completed") || "Not reported"}</td></tr>
        </tbody></table>{run.restartHistory?.length ? <table className="algorithm-metrics__table"><thead><tr><th>Restart</th><th>Iterations</th><th>Objective</th></tr></thead><tbody>{run.restartHistory.map((row) => <tr key={row.restart}><td>{row.restart}</td><td>{row.iterations}</td><td>{row.objectiveValue ?? "Not reported"}</td></tr>)}</tbody></table> : null}</section>;
    }
    return <section className="algorithm-metrics"><h3>Algorithm metrics</h3>{Object.keys(metrics).length === 0 ? <p>No additional algorithm metrics were returned.</p> : <table className="algorithm-metrics__table"><thead><tr><th>Metric</th><th>Value</th></tr></thead><tbody>{Object.entries(metrics).map(([key, value]) => <tr key={key}><td>{key}</td><td>{typeof value === "object" ? JSON.stringify(value) : String(value ?? "Not reported")}</td></tr>)}</tbody></table>}</section>;
}
