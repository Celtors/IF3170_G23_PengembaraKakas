import { useMemo, useState } from "react";
import { MOCK_RUN } from "../../../data/visualizationData";
import type { ExperimentAlgorithm, ExperimentRun } from "../types";

const MOCK_EXPERIMENTS: ExperimentRun[] = [
    {
        id: "mock-hc-1",
        name: "Demo run 01",
        algorithm: "Hill Climbing",
        states: MOCK_RUN.states,
        summary: MOCK_RUN.summary,
        runtimeMs: null,
        metrics: { "Search strategy": "Steepest ascent", "Stop condition": "Demo state history", "Iterations recorded": MOCK_RUN.summary.totalIterations, "Restarts": null },
        source: "mock",
    },
    {
        id: "mock-rr-1",
        name: "Demo run 02",
        algorithm: "Random-Restart Hill Climbing",
        states: MOCK_RUN.states,
        summary: MOCK_RUN.summary,
        runtimeMs: null,
        metrics: { "Maximum restarts": 5, "Iterations per restart": 100 },
        restartHistory: [],
        source: "mock",
    },
    {
        id: "mock-sa-1",
        name: "Demo run 03",
        algorithm: "Simulated Annealing",
        states: MOCK_RUN.states.map((state, index) => ({ ...state, objectiveValue: [510, 790, 960][index] ?? state.objectiveValue })),
        summary: { ...MOCK_RUN.summary, bestObjective: 960, finalObjective: 960 },
        runtimeMs: null,
        metrics: { "Initial temperature": "Not configured", "Cooling schedule": "Not configured" }, stuckFrequency: undefined, acceptanceProbabilityHistory: [],
        source: "mock",
    },
    {
        id: "mock-ga-1",
        name: "Demo run 04",
        algorithm: "Genetic Algorithm",
        states: MOCK_RUN.states.map((state, index) => ({ ...state, objectiveValue: [510, 820, 990][index] ?? state.objectiveValue })),
        summary: { ...MOCK_RUN.summary, bestObjective: 990, finalObjective: 990 },
        runtimeMs: null,
        populationSize: 30,
        configuredIterations: MOCK_RUN.summary.totalIterations,
        metrics: { "Population size": 30, "Configured iterations": MOCK_RUN.summary.totalIterations }, populationObjectiveHistory: [],
        source: "mock",
    },
];

export function useExperimentResults() {
    const [selectedAlgorithm, setSelectedAlgorithm] = useState<ExperimentAlgorithm>("Random-Restart Hill Climbing");
    const [selectedRunId, setSelectedRunId] = useState("mock-rr-1");
    const runs = useMemo(() => MOCK_EXPERIMENTS.filter((run) => run.algorithm === selectedAlgorithm), [selectedAlgorithm]);
    const selectedRun = MOCK_EXPERIMENTS.find((run) => run.id === selectedRunId && run.algorithm === selectedAlgorithm) ?? runs[0] ?? MOCK_EXPERIMENTS[0];

    const chooseAlgorithm = (algorithm: ExperimentAlgorithm) => {
        setSelectedAlgorithm(algorithm);
        const firstRun = MOCK_EXPERIMENTS.find((run) => run.algorithm === algorithm);
        if (firstRun) setSelectedRunId(firstRun.id);
    };

    return { selectedAlgorithm, setSelectedAlgorithm: chooseAlgorithm, runs, selectedRun, setSelectedRunId };
}
