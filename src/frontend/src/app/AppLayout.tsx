import React, { useState } from "react";
import "./App.css";

import { useAlgorithmConfig } from "../features/algorithm-config/hooks/useAlgorithmConfig";
import { AlgorithmSelector } from "../features/algorithm-config/components/AlgorithmSelector";
import { AlgorithmParameters } from "../features/algorithm-config/components/AlgorithmParameters";
import { ExperimentConfig } from "../features/algorithm-config/components/ExperimentConfig";

import { useTruckConfig } from "../features/truck-config/hooks/useTruckConfig";
import { TruckForm } from "../features/truck-config/components/TruckForm";
import { PackageListEditor } from "../features/truck-config/components/PackageListEditor";
import { useOptimization } from "../hooks/useOptimization";

const AppLayout: React.FC = () => {
    const [collapseLeft, setCollapseLeft] = useState<boolean>(false);
    const [collapseBottom, setCollapseBottom] = useState<boolean>(false);

    const cfg = useAlgorithmConfig();
    const truckCfg = useTruckConfig();
    
    const { executeRun, isLoading, error, data } = useOptimization();

    const containerClass = [
        "grid-container",
        collapseLeft ? "no-left" : "",
        collapseBottom ? "no-bottom" : "",
    ].filter(Boolean).join(" ");

    const ALGORITHM_MAPPING: Record<string, string> = {
        "STEEPEST_HC": "steepest",
        "SIDEMOVE_HC": "sideways",
        "RANDOMR_HC": "random_restart",
        "STOCHASTIC_HC": "stochastic",
        "SIM_ANNEALING": "simulated_annealing",
        "GENETIC_ALG": "genetic"
    };
    const handleRunOptimization = async () => {
        const payload = {
            algorithm: ALGORITHM_MAPPING[cfg.selectedAlgorithm], 
            objective: "score", // atau "score_plus_plus"
            params: {
                max_sideways: cfg.params.maxSidewaysMove,
                max_restart: cfg.params.maxRestart,
                max_iterations: cfg.params.maxIterations,
                population_size: cfg.params.sumPopulation,
                iterations: cfg.params.iteration,
                mutation_rate: cfg.params.mutationRate,
                initial_temp: cfg.params.initialTemp,
                cooling_rate: cfg.params.coolingRate,
                min_temp: cfg.params.minTemp
            },
            problem: {
                truck: {
                    width: truckCfg.truck.dimensions.w,
                    length: truckCfg.truck.dimensions.l,
                    height: truckCfg.truck.dimensions.h,
                    max_capacity: truckCfg.truck.maxCapacity
                },
                packages: truckCfg.packageSpecs.map(pkg => ({
                    id: pkg.id,
                    dimensions: {
                        width: pkg.dimensions.w,
                        length: pkg.dimensions.l,
                        height: pkg.dimensions.h
                    },
                    weight: pkg.weight,
                    value: pkg.value,
                    is_fragile: pkg.isFragile,
                    eta: pkg.eta
                }))
            }
        };

        try {
            await executeRun(payload);
            setCollapseBottom(false); 
        } catch (err) {
            console.error("Gagal menjalankan optimasi", err);
        }
    };

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
                        {collapseLeft ? "▶" : "◀"}
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
                        
                        <button 
                            type="button" 
                            disabled={!cfg.isValid || !truckCfg.isValid || isLoading}
                            onClick={handleRunOptimization}
                            style={{ padding: '10px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            {isLoading ? "Running..." : "Run Optimization"}
                        </button>
                        
                        {error && <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '8px' }}>{error}</p>}
                    </div>
                )}
            </aside>
            <main className="top-right">
                <p>Top Right Content (Visualisasi 3D nanti di sini)</p>
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
                        {isLoading ? (
                            <p>Menghitung optimasi...</p>
                        ) : data ? (
                            <pre style={{ fontSize: '12px', background: '#1e293b', padding: '10px', borderRadius: '4px', overflowX: 'auto' }}>
                                {JSON.stringify(data.experiment, null, 2)}
                            </pre>
                        ) : (
                            <p>Belum ada hasil. Silakan klik Run Optimization.</p>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
};

export default AppLayout;