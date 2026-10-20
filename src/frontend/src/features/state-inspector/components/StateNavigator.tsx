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
    | "goToFirst"
    | "goToLast"
    | "goToIndex"
>;

export function StateNavigator({
    stateIndex,
    stateCount,
    hasPrevious,
    hasNext,
    goToPrevious,
    goToNext,
    goToFirst,
    goToLast,
    goToIndex,
}: StateNavigatorProps) {
    const label = `State ${stateIndex + 1} / ${stateCount}`;

    return (
        <div className="state-navigator" role="group" aria-label="State navigation">
            <div className="state-navigator__buttons">
                <button type="button" aria-label="First state" disabled={!hasPrevious} onClick={goToFirst}>
                    |&lt;
                </button>
                <button type="button" aria-label="Previous state" disabled={!hasPrevious} onClick={goToPrevious}>
                    &lt;
                </button>
                <span className="state-navigator__label" aria-live="polite">
                    {label}
                </span>
                <button type="button" aria-label="Next state" disabled={!hasNext} onClick={goToNext}>
                    &gt;
                </button>
                <button type="button" aria-label="Last state" disabled={!hasNext} onClick={goToLast}>
                    &gt;|
                </button>
            </div>
            <input
                className="state-navigator__slider"
                type="range"
                min={0}
                max={Math.max(stateCount - 1, 0)}
                step={1}
                value={stateIndex}
                disabled={stateCount <= 1}
                aria-label="Select state"
                aria-valuetext={label}
                onChange={(e) => goToIndex(e.target.valueAsNumber)}
            />
        </div>
    );
}
