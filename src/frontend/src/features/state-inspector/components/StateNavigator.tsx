import type { StateNavigation } from "../types";
import "./StateNavigator.css";

type StateNavigatorProps = Pick<
    StateNavigation,
    | "stateIndex"
    | "stateCount"
    | "hasPrevious"
    | "hasNext"
    | "goToPrevious"
    | "goToNext"
>;

export function StateNavigator({
    stateIndex,
    stateCount,
    hasPrevious,
    hasNext,
    goToPrevious,
    goToNext,
}: StateNavigatorProps) {
    const stateLabel = stateIndex === 0 ? "Initial State" : "Final State";

    return (
        <div className="state-navigator" role="group" aria-label="State navigation">
            <div className="state-navigator__buttons">
                <button
                    type="button"
                    aria-label="Previous state"
                    disabled={!hasPrevious}
                    onClick={goToPrevious}
                >
                    ← Previous
                </button>

                <span className="state-navigator__label" aria-live="polite">
                    {stateCount === 0 ? "No states" : stateLabel}
                </span>

                <button
                    type="button"
                    aria-label="Next state"
                    disabled={!hasNext}
                    onClick={goToNext}
                >
                    Next →
                </button>
            </div>
        </div>
    );
}
