import type { PackageSpec } from "../../../types/package";
import type { RunSummary } from "../../../types/state";
import type { StateNavigation } from "../types";
import { ObjectiveValue } from "./ObjectiveValue";
import { PackageDetails } from "./PackageDetails";
import { StateInfo } from "./StateInfo";
import { StateNavigator } from "./StateNavigator";
import "./StateInspector.css";

interface StateInspectorProps {
    navigation: StateNavigation;
    summary: RunSummary | null;
    packages: PackageSpec[];
    selectedPackageId: string | null;
    onClearSelection: () => void;
}

export function StateInspector({
    navigation,
    summary,
    packages,
    selectedPackageId,
    onClearSelection,
}: StateInspectorProps) {
    const { currentState, previousState } = navigation;

    if (!currentState) {
        return <p className="state-inspector__empty">No states yet. Run an algorithm.</p>;
    }

    const packageSpec = packages.find((p) => p.id === selectedPackageId) ?? null;
    const placement = currentState.placements.find((p) => p.packageId === selectedPackageId) ?? null;

    return (
        <div className="state-inspector">
            <section className="state-inspector__card">
                <h4 className="state-inspector__title">State</h4>
                <StateNavigator {...navigation} />
                <StateInfo state={currentState} totalIterations={summary?.totalIterations} />
            </section>

            <section className="state-inspector__card">
                <h4 className="state-inspector__title">Objective value</h4>
                <ObjectiveValue
                    current={currentState.objectiveValue}
                    previous={previousState?.objectiveValue}
                    initial={summary?.initialObjective}
                    best={summary?.bestObjective}
                    final={summary?.finalObjective}
                />
            </section>

            <section className="state-inspector__card">
                <h4 className="state-inspector__title">Selected package</h4>
                <PackageDetails packageSpec={packageSpec} placement={placement} onClear={onClearSelection} />
            </section>
        </div>
    );
}
