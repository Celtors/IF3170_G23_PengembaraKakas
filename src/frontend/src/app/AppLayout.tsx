import React, { useRef, useState } from "react";
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
import { useStateNavigation } from "../features/state-inspector/hooks/useStateNavigation";
import { StateInspector } from "../features/state-inspector/components/StateInspector";
import { MOCK_RUN } from "../data/visualizationData";

const AppLayout: React.FC = () => {
    const [collapseLeft, setCollapseLeft] = useState<boolean>(false);
    const [collapseBottom, setCollapseBottom] = useState<boolean>(false);
    const cfg = useAlgorithmConfig();
    const truckCfg = useTruckConfig();
    const { selectedPackageId, selectPackage } = usePackageSelection();
    // Mock run sebagai ganti dari hasil backend
    const navigation = useStateNavigation(MOCK_RUN.states);
    const selectedState = navigation.currentState;
    const [bottomHeight, setBottomHeight] = useState(35); // dalam vh
    const isDragging = useRef(false);

    const handleMouseDown = () => (isDragging.current = true);
    const handleMouseUp = () => (isDragging.current = false);
    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging.current) return;
        const newHeight = ((window.innerHeight - e.clientY) / window.innerHeight) * 100;
        setBottomHeight(Math.min(Math.max(newHeight, 10), 80)); // batas min/max
    };

    React.useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    const containerClass = [
        "grid-container",
        collapseLeft ? "no-left" : "",
        collapseBottom ? "no-bottom" : "",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div className={containerClass}
            style={{ "--bottom-height": `${bottomHeight}vh` } as React.CSSProperties}
        >
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
                <VisualizationCanvas
                    truck={MOCK_RUN.truck}
                    packages={MOCK_RUN.packages}
                    state={selectedState}
                    selectedPackageId={selectedPackageId}
                    onSelectPackage={selectPackage}
                />
            </main>

            <div className="resize-rail" onMouseDown={handleMouseDown}></div>
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
                        <StateInspector
                            navigation={navigation}
                            summary={MOCK_RUN.summary}
                            packages={MOCK_RUN.packages}
                            selectedPackageId={selectedPackageId}
                            onClearSelection={() => selectPackage(null)}
                        />
                    </div>
                )}
            </section>
        </div>
    );
};

export default AppLayout;