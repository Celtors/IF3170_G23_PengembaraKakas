import type { SolutionState } from "../../types/state";

export interface StateNavigation {
    stateIndex: number;
    stateCount: number;
    currentState: SolutionState | null;
    previousState: SolutionState | null;
    hasPrevious: boolean;
    hasNext: boolean;
    goToPrevious: () => void;
    goToNext: () => void;
    goToFirst: () => void;
    goToLast: () => void;
    goToIndex: (index: number) => void;
}
