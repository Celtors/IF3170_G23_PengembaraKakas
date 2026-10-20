import React from "react";
import type { RunResponse } from "../../../api/run";
import { toObjectiveChartStates } from "../../../api/run";
import { ObjectiveChart } from "./ObjectiveChart";
import { BackendAlgorithmMetrics } from "./BackendAlgorithmMetrics";
import "./RunResponseDetails.css";

interface RunResponseDetailsProps {
    response: RunResponse;
    title?: string;
    initiallyOpen?: boolean;
}

const pretty = (value: unknown) => JSON.stringify(value, null, 2);

export function RunResponseDetails({
    response,
    title = "Run response details",
    initiallyOpen = true,
}: RunResponseDetailsProps) {
    const { run, problem, states, experiment } = response;

    return (
        <details className="run-response-details" open={initiallyOpen}>
            <summary>{title} · {run.run_id}</summary>
            <div className="run-response-details__content">
                <section>
                    <h4>Run metadata</h4>
                    <dl className="response-field-grid">
                        <div><dt>Schema version</dt><dd>{response.schema_version}</dd></div>
                        <div><dt>Run ID</dt><dd>{run.run_id}</dd></div>
                        <div><dt>Algorithm</dt><dd>{run.algorithm}</dd></div>
                        <div><dt>Status</dt><dd>{run.status}</dd></div>
                        <div><dt>Started at</dt><dd>{run.started_at}</dd></div>
                        <div><dt>Duration</dt><dd>{run.duration_ms} ms</dd></div>
                    </dl>
                </section>

                <section>
                    <h4>Problem / truck</h4>
                    <dl className="response-field-grid">
                        <div><dt>Width</dt><dd>{problem.truck.width}</dd></div>
                        <div><dt>Length</dt><dd>{problem.truck.length}</dd></div>
                        <div><dt>Height</dt><dd>{problem.truck.height}</dd></div>
                        <div><dt>Max capacity</dt><dd>{problem.truck.max_capacity}</dd></div>
                        <div><dt>Packages in request</dt><dd>{problem.packages.length}</dd></div>
                    </dl>
                    <div className="response-table-wrap">
                        <table className="experiment-table">
                            <thead><tr><th>Package ID</th><th>Dimensions (W × L × H)</th><th>Weight</th><th>Value</th><th>Fragile</th><th>ETA</th><th>Model URL</th></tr></thead>
                            <tbody>
                                {problem.packages.map((pkg) => (
                                    <tr key={pkg.id}>
                                        <td>{pkg.id}</td>
                                        <td>{pkg.dimensions.width} × {pkg.dimensions.length} × {pkg.dimensions.height}</td>
                                        <td>{pkg.weight}</td><td>{pkg.value}</td><td>{pkg.is_fragile ? "Yes" : "No"}</td><td>{pkg.eta}</td>
                                        <td>{pkg.model_url ?? "—"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section>
                    <h4>Optimization statistics</h4>
                    <dl className="response-field-grid">
                        <div><dt>Iterations</dt><dd>{experiment.iterations}</dd></div>
                        <div><dt>Initial objective</dt><dd>{experiment.initial_objective}</dd></div>
                        <div><dt>Final objective</dt><dd>{experiment.final_objective}</dd></div>
                        <div><dt>Best objective</dt><dd>{experiment.best_objective}</dd></div>
                        <div><dt>History points</dt><dd>{experiment.objective_history.length}</dd></div>
                    </dl>
                    <ObjectiveChart states={toObjectiveChartStates(response)} title={`Objective history · ${run.run_id}`} />
                    <details className="response-raw">
                        <summary>View all objective history values ({experiment.objective_history.length})</summary>
                        <pre className="response-json">{pretty(experiment.objective_history)}</pre>
                    </details>
                    <BackendAlgorithmMetrics response={response} />
                </section>

                <section>
                    <h4>Returned states and placements</h4>
                    {states.length === 0 ? <p>The backend returned no states.</p> : states.map((state, stateIndex) => (
                        <div className="response-state" key={`${state.state}-${stateIndex}`}>
                            <h5>State: {state.state} · Objective: {state.objective_value}</h5>
                            {state.placements.length === 0 ? <p>No placements in this state.</p> : (
                                <div className="response-table-wrap">
                                    <table className="experiment-table">
                                        <thead><tr><th>Package ID</th><th>Status</th><th>Position (x, y, z)</th><th>Size (W, L, H)</th><th>Orientation (w, l, h)</th></tr></thead>
                                        <tbody>{state.placements.map((placement, placementIndex) => (
                                            <tr key={`${placement.package_id}-${placementIndex}`}>
                                                <td>{placement.package_id}</td><td>{placement.placement}</td>
                                                <td>{placement.position.join(", ")}</td><td>{placement.size.join(", ")}</td>
                                                <td>{`w:${placement.orientation.w}, l:${placement.orientation.l}, h:${placement.orientation.h}`}</td>
                                            </tr>
                                        ))}</tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ))}
                </section>

                {/* <details className="response-raw">
                    <summary>View complete raw RunResponse JSON</summary>
                    <pre className="response-json">{pretty(response)}</pre>
                </details> */}
            </div>
        </details>
    );
}
