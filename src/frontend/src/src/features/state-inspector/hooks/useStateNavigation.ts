import { useCallback, useState } from "react";
import type { SolutionState } from "../../../types/state";
import type { StateNavigation } from "../types";
import { clampIndex } from "../utils/clampIndex";

export function useStateNavigation(states: SolutionState[]): StateNavigation {
    const [requestedIndex, setRequestedIndex] = useState(0);
    const visibleStates = states.length <= 1
        ? states
        : [states[0], states[states.length - 1]];

    const stateCount = visibleStates.length;
    const stateIndex = clampIndex(requestedIndex, stateCount);

    const goToIndex = useCallback(
        (index: number) => setRequestedIndex(clampIndex(index, stateCount)),
        [stateCount],
    );
    const goToPrevious = useCallback(
        () => setRequestedIndex((prev) => clampIndex(clampIndex(prev, stateCount) - 1, stateCount)),
        [stateCount],
    );
    const goToNext = useCallback(
        () => setRequestedIndex((prev) => clampIndex(clampIndex(prev, stateCount) + 1, stateCount)),
        [stateCount],
    );
    const goToFirst = useCallback(() => setRequestedIndex(0), []);
    const goToLast = useCallback(() => setRequestedIndex(clampIndex(stateCount - 1, stateCount)), [stateCount]);

    return {
        stateIndex,
        stateCount,
        currentState: visibleStates[stateIndex] ?? null,
        previousState: stateIndex > 0
            ? visibleStates[stateIndex - 1] ?? null
            : null,
        hasPrevious: stateIndex > 0,
        hasNext: stateIndex < stateCount - 1,
        goToPrevious,
        goToNext,
        goToFirst,
        goToLast,
        goToIndex,
    };
}
