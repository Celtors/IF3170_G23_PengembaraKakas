import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { useAlgorithmConfig } from "../features/algorithm-config/hooks/useAlgorithmConfig";
import { AlgorithmSelector } from "../features/algorithm-config/components/AlgorithmSelector";
import { AlgorithmParameters } from "../features/algorithm-config/components/AlgorithmParameters";
import { ExperimentConfig } from "../features/algorithm-config/components/ExperimentConfig";
import { useTruckConfig } from "../features/truck-config/hooks/useTruckConfig";
import { TruckForm } from "../features/truck-config/components/TruckForm";
import { PackageListEditor } from "../features/truck-config/components/PackageListEditor";
import { runAlgorithm, runExperiment, toRunSummary, toSolutionStates, type ExperimentResponse, type RunResponse } from "../api/run";
import { VisualizationCanvas } from "../features/visualization/components/VisualizationCanvas";
import { usePackageSelection } from "../features/visualization/hooks/usePackageSelection";
import { useStateNavigation } from "../features/state-inspector/hooks/useStateNavigation";
import { StateInspector } from "../features/state-inspector/components/StateInspector";
import { Sidebar } from "../components/layout/Sidebar";
import { MainContent } from "../components/layout/MainContent";
import { BottomPanel } from "../components/layout/BottomPanel";
import { Button } from "../components/ui/Button";
import { LineChart } from "../features/visualization/LineChart";

const METRIC_LABEL: Record<string, string> = {
    restarts: "Restart",
    iterations_per_restart: "Iterasi/restart",
    sideways_moves: "Sideways move",
    stuck_frequency: "Stuck",
};

const formatMetrics = (metrics: Record<string, unknown>) => Object.entries(METRIC_LABEL)
    .filter(([key]) => key in metrics)
    .map(([key, label]) => `${label}: ${Array.isArray(metrics[key]) ? (metrics[key] as unknown[]).join(", ") : String(metrics[key])}`)
    .join(" · ") || "Tidak ada metrik tambahan dari backend.";

const AppLayout: React.FC = () => {
    const [collapseLeft, setCollapseLeft] = useState(false);
    const [collapseBottom, setCollapseBottom] = useState(false);
    const [resultsTab, setResultsTab] = useState<"state" | "experiments">("state");
    const [bottomHeight, setBottomHeight] = useState(35);
    const [running, setRunning] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<RunResponse | null>(null);
    const [expResult, setExpResult] = useState<ExperimentResponse | null>(null);
    const [seedText, setSeedText] = useState("");
    const isDragging = useRef(false);
    const cfg = useAlgorithmConfig();
    const truckCfg = useTruckConfig();
    const { selectedPackageId, selectPackage } = usePackageSelection();
    const states = result ? toSolutionStates(result) : [];
    const navigation = useStateNavigation(states);
    const summary = result ? toRunSummary(result) : null;
    const seed = seedText.trim() === "" ? undefined : Number(seedText);
    const seedValid = seed === undefined || (Number.isSafeInteger(seed) && seed >= 0);
    const canRun = cfg.isValid && truckCfg.isValid && seedValid && !running;

    const handleRun = async (experiment: boolean) => {
        if (!seedValid) {
            setError("Seed harus berupa bilangan bulat non-negatif.");
            return;
        }
        setRunning(true);
        setError(null);
        try {
            if (experiment) {
                const response = await runExperiment(cfg.selectedAlgorithm, cfg.params, cfg.experimentConfig,
                    truckCfg.truck, truckCfg.packageSpecs, seed);
                setExpResult(response);
                const firstRun = response.variations[0]?.runs[0] ?? null;
                setResult(firstRun);
                setResultsTab("experiments");
            } else {
                const response = await runAlgorithm(cfg.selectedAlgorithm, cfg.params,
                    truckCfg.truck, truckCfg.packageSpecs, seed);
                setResult(response);
                setExpResult(null);
                setResultsTab("state");
            }
            selectPackage(null);
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
        } finally {
            setRunning(false);
        }
    };

    useEffect(() => {
        const onMove = (event: MouseEvent) => {
            if (!isDragging.current) return;
            const height = ((window.innerHeight - event.clientY) / window.innerHeight) * 100;
            setBottomHeight(Math.min(Math.max(height, 10), 80));
        };
        const onUp = () => { isDragging.current = false; };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
        };
    }, []);

    const containerClass = ["grid-container", collapseLeft ? "no-left" : "", collapseBottom ? "no-bottom" : ""]
        .filter(Boolean).join(" ");
    const containerStyle = { "--bottom-height": collapseBottom ? "0px" : `${bottomHeight}vh` } as React.CSSProperties;

    return (
        <div className={containerClass} style={containerStyle}>
            <Sidebar collapsed={collapseLeft} onToggle={() => setCollapseLeft((previous) => !previous)}>
                <AlgorithmSelector selectedAlgorithm={cfg.selectedAlgorithm} onSelectAlgorithm={cfg.setSelectedAlgorithm} />
                <AlgorithmParameters meta={cfg.currentMeta} params={cfg.params} issues={cfg.validationIssues}
                    onUpdateParam={cfg.updateParam} onApplyPreset={cfg.applyPreset} onReset={cfg.resetToDefaults} />
                <ExperimentConfig selectedAlgorithm={cfg.selectedAlgorithm} params={cfg.params}
                    experimentConfig={cfg.experimentConfig} issues={cfg.validationIssues} onUpdate={cfg.updateExperimentConfig} />
                <TruckForm truck={truckCfg.truck} issues={truckCfg.validationIssues}
                    onUpdateDimension={truckCfg.updateTruckDimension} onUpdateMaxCapacity={truckCfg.updateMaxCapacity} />
                <PackageListEditor packages={truckCfg.packages} issues={truckCfg.validationIssues}
                    onAdd={truckCfg.addPackage} onRemove={truckCfg.removePackage} onUpdate={truckCfg.updatePackage}
                    onUpdateDimension={truckCfg.updatePackageDimension} />
                <label className="seed-field">
                    Seed (opsional)
                    <input type="number" min="0" step="1" value={seedText}
                        onChange={(event) => setSeedText(event.target.value)} placeholder="Random seed" />
                </label>
                {!seedValid && <p role="alert" className="api-error">Seed harus bilangan bulat non-negatif.</p>}
                <div className="run-actions">
                    <Button variant="primary" disabled={!canRun} onClick={() => void handleRun(false)}>
                        {running ? "Menjalankan…" : "Run optimization"}
                    </Button>
                    <Button variant="secondary" disabled={!canRun} onClick={() => void handleRun(true)}>
                        Run experiment
                    </Button>
                </div>
                {error && <p role="alert" className="api-error">{error}</p>}
            </Sidebar>

            <MainContent>
                <VisualizationCanvas truck={truckCfg.truck} packages={truckCfg.packageSpecs}
                    state={navigation.currentState} selectedPackageId={selectedPackageId} onSelectPackage={selectPackage} />
            </MainContent>

            <BottomPanel collapsed={collapseBottom} onToggle={() => setCollapseBottom((previous) => !previous)}
                onResizeStart={() => { isDragging.current = true; }}
                header={<div className="panel-header results-panel-header">
                    <div className="results-panel-tabs" role="tablist" aria-label="Results views">
                        <button type="button" role="tab" aria-selected={resultsTab === "state"}
                            className={resultsTab === "state" ? "results-tab active" : "results-tab"}
                            onClick={() => setResultsTab("state")}>Current state</button>
                        <button type="button" role="tab" aria-selected={resultsTab === "experiments"}
                            className={resultsTab === "experiments" ? "results-tab active" : "results-tab"}
                            onClick={() => setResultsTab("experiments")}>Experiments</button>
                    </div>
                    {result && <span className="run-meta">{result.run.algorithm} · {result.run.duration_ms} ms</span>}
                </div>}>
                {resultsTab === "state" ? (
                    <>
                        <StateInspector navigation={navigation} summary={summary} packages={truckCfg.packageSpecs}
                            selectedPackageId={selectedPackageId} onClearSelection={() => selectPackage(null)} />
                        {result && <div className="run-results-extra">
                            <p><strong>Run ID:</strong> {result.run.run_id}</p>
                            <p><strong>Metrik:</strong> {formatMetrics(result.experiment.algorithm_metrics)}</p>
                            <LineChart title="Objective per iterasi" xLabel="Iterasi"
                                series={[{ name: "Objective", values: result.experiment.objective_history, color: "var(--series-1)" }]} />
                        </div>}
                    </>
                ) : (
                    <div className="experiment-results">
                        {!expResult ? <p>Belum ada hasil eksperimen. Jalankan Run experiment untuk mengambil hasil dari backend.</p> : <>
                            <h3>{expResult.name || "Experiment"}</h3>
                            <p>Algoritma: {expResult.algorithm}</p>
                            {expResult.variations.map((variation, index) => <section key={`${index}-${JSON.stringify(variation.params)}`}>
                                <h4>Variasi {index + 1}: {Object.entries(variation.params).map(([key, value]) => `${key}=${value}`).join(", ") || "default"}</h4>
                                <table className="experiment-table"><thead><tr><th>Run</th><th>Durasi (ms)</th><th>Awal</th><th>Akhir</th><th>Terbaik</th></tr></thead>
                                    <tbody>{variation.runs.map((run) => <tr key={run.run.run_id}>
                                        <td>{run.run.run_id.slice(0, 8)}</td><td>{run.run.duration_ms}</td>
                                        <td>{run.experiment.initial_objective}</td><td>{run.experiment.final_objective}</td><td>{run.experiment.best_objective}</td>
                                    </tr>)}</tbody></table>
                            </section>)}
                        </>}
                    </div>
                )}
            </BottomPanel>
        </div>
    );
};

export default AppLayout;
