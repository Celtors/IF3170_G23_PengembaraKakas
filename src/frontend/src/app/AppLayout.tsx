import React, { useState } from "react";
import "./App.css";
import { useAlgorithmConfig } from "../features/algorithm-config/hooks/useAlgorithmConfig";
import { AlgorithmSelector } from "../features/algorithm-config/components/AlgorithmSelector";
import { AlgorithmParameters } from "../features/algorithm-config/components/AlgorithmParameters";
import { ExperimentConfig } from "../features/algorithm-config/components/ExperimentConfig";
import { useTruckConfig } from "../features/truck-config/hooks/useTruckConfig";
import { TruckForm } from "../features/truck-config/components/TruckForm";
import { PackageListEditor } from "../features/truck-config/components/PackageListEditor";
import { VisualizationCanvas } from "../features/visualization/components/VisualizationCanvas";
import { usePackageSelection } from "../features/visualization/hooks/usePackageSelection";
import { MOCK_RUN } from "../data/visualizationData";

const AppLayout: React.FC = () => {
    const [collapseLeft, setCollapseLeft] = useState<boolean>(false);
    const [collapseBottom, setCollapseBottom] = useState<boolean>(false);
    const cfg = useAlgorithmConfig();
    const truckCfg = useTruckConfig();
    const { selectedPackageId, selectPackage } = usePackageSelection();
    //masih buat testing
    const [stateIndex, setStateIndex] = useState<number>(0);
    const selectedState = MOCK_RUN.states[stateIndex] ?? null;

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
                        <button type="button" disabled={!cfg.isValid || !truckCfg.isValid}>Run</button>
                    </div>
                )}
            </aside>

            <main className="top-right">
                <div style={{ position: "relative", width: "100%", height: "100%" }}>
                    <VisualizationCanvas
                        truck={MOCK_RUN.truck}
                        packages={MOCK_RUN.packages}
                        state={selectedState}
                        selectedPackageId={selectedPackageId}
                        onSelectPackage={selectPackage}
                    />
                    {/* masih placeholder */}
                    <select
                        aria-label="Mock state (temporary)"
                        style={{ position: "absolute", top: 8, right: 8 }}
                        value={stateIndex}
                        onChange={(e) => setStateIndex(Number(e.target.value))}
                    >
                        {MOCK_RUN.states.map((st, i) => (
                            <option key={st.index} value={i}>
                                State {st.index} | iter {st.iteration} | objective {st.objectiveValue}
                            </option>
                        ))}
                    </select>
                </div>
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
                        <p>Bottom Section Content</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default AppLayout;