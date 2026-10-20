import React, { useState } from "react";
import "./App.css";
import { useAlgorithmConfig } from "../features/algorithm-config/hooks/useAlgorithmConfig";
import { AlgorithmSelector } from "../features/algorithm-config/components/AlgorithmSelector";
import { AlgorithmParameters } from "../features/algorithm-config/components/AlgorithmParameters";
import { ExperimentConfig } from "../features/algorithm-config/components/ExperimentConfig";
import { useTruckConfig } from "../features/truck-config/hooks/useTruckConfig";
import { TruckForm } from "../features/truck-config/components/TruckForm";
import { PackageListEditor } from "../features/truck-config/components/PackageListEditor";
import { runAlgorithm, type RunResponse } from "../api/run";
import { FormField } from "../features/algorithm-config/components/FormField";
import { StateView } from "../features/visualization/StateView";

const AppLayout: React.FC = () => {
    const [collapseLeft, setCollapseLeft] = useState<boolean>(false);
    const [collapseBottom, setCollapseBottom] = useState<boolean>(false);
    const cfg = useAlgorithmConfig();
    const truckCfg = useTruckConfig();
    const [running, setRunning] = useState(false);
    const [result, setResult] = useState<RunResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [seedText, setSeedText] = useState("");
    const seed = seedText.trim() === "" ? undefined : Number(seedText);
    const seedValid = seed === undefined || (Number.isSafeInteger(seed) && seed >= 0);

    const handleRun = async () => {
        setRunning(true);
        setError(null);
        try {
            setResult(await runAlgorithm(cfg.selectedAlgorithm, cfg.params, truckCfg.truck, truckCfg.packageSpecs, seed));
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
        } finally {
            setRunning(false);
        }
    };

    const containerClass = [
        "grid-container",
        collapseLeft ? "no-left" : "",
        collapseBottom ? "no-bottom" : "",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div className={containerClass}>
            <aside className="left">
                <div className="panel-header">
                    {!collapseLeft && <span className="panel-title">Configuration</span>}
                    <button
                        type="button"
                        className="panel-toggle"
                        aria-expanded={!collapseLeft}
                        aria-label={collapseLeft ? "Expand left panel" : "Collapse left panel"}
                        onClick={() => setCollapseLeft((prev) => !prev)}
                    >
                        {collapseLeft ? "»" : "«"}
                    </button>
                </div>

                {!collapseLeft && (
                    <div className="panel-body">
                        <AlgorithmSelector
                            selectedAlgorithm={cfg.selectedAlgorithm}
                            onSelectAlgorithm={cfg.setSelectedAlgorithm}
                        />
                        <AlgorithmParameters
                            meta={cfg.currentMeta}
                            params={cfg.params}
                            issues={cfg.validationIssues}
                            onUpdateParam={cfg.updateParam}
                            onApplyPreset={cfg.applyPreset}
                            onReset={cfg.resetToDefaults}
                        />
                        <ExperimentConfig
                            selectedAlgorithm={cfg.selectedAlgorithm}
                            params={cfg.params}
                            experimentConfig={cfg.experimentConfig}
                            issues={cfg.validationIssues}
                            onUpdate={cfg.updateExperimentConfig}
                        />
                        <TruckForm
                            truck={truckCfg.truck}
                            issues={truckCfg.validationIssues}
                            onUpdateDimension={truckCfg.updateTruckDimension}
                            onUpdateMaxCapacity={truckCfg.updateMaxCapacity}
                        />
                        <PackageListEditor
                            packages={truckCfg.packages}
                            issues={truckCfg.validationIssues}
                            onAdd={truckCfg.addPackage}
                            onRemove={truckCfg.removePackage}
                            onUpdate={truckCfg.updatePackage}
                            onUpdateDimension={truckCfg.updatePackageDimension}
                        />
                        <FormField
                            label="Seed (optional)"
                            hint="Same seed = same initial state for every algorithm. Leave empty for random."
                            issue={seedValid ? undefined : { severity: "error", message: "Seed must be a whole number ≥ 0." }}
                        >
                            <input
                                type="number"
                                min={0}
                                step={1}
                                placeholder="random"
                                value={seedText}
                                onChange={(e) => setSeedText(e.target.value)}
                            />
                        </FormField>
                        <button
                            type="button"
                            disabled={running || !seedValid || !cfg.isValid || !truckCfg.isValid}
                            onClick={handleRun}
                        >
                            {running ? "Running..." : "Run"}
                        </button>
                    </div>
                )}
            </aside>

            <main className="top-right">
                <StateView result={result} />
            </main>

            <section className="bottom">
                <div className="panel-header">
                    <span className="panel-title">Results</span>
                    <button
                        type="button"
                        className="panel-toggle"
                        aria-expanded={!collapseBottom}
                        aria-label={collapseBottom ? "Expand bottom panel" : "Collapse bottom panel"}
                        onClick={() => setCollapseBottom((prev) => !prev)}
                    >
                        {collapseBottom ? "▲" : "▼"}
                    </button>
                </div>

                {!collapseBottom && (
                    <div className="panel-body">
                        {error && <p role="alert">{error}</p>}
                        {!error && !result && <p>Belum ada hasil. Tekan Run.</p>}
                        {!error && result && (() => {
                            const final = result.states.find((s) => s.state === "final");
                            const inside = final?.placements.filter((p) => p.placement === "inside").length ?? 0;
                            return (
                                <ul>
                                    <li>Algoritma: {result.run.algorithm} ({result.run.duration_ms} ms)</li>
                                    <li>Objective: {result.experiment.initial_objective} → {result.experiment.final_objective} (best {result.experiment.best_objective})</li>
                                    <li>Iterasi: {result.experiment.iterations}</li>
                                    <li>Paket di dalam truk: {inside} / {final?.placements.length ?? 0}</li>
                                </ul>
                            );
                        })()}
                    </div>
                )}
            </section>
        </div>
    );
};

export default AppLayout;