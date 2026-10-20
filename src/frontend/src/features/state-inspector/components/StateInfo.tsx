import type { SolutionState } from "../../../types/state";
import { formatNumber } from "../../../utils/formatNumber";
import "./StateInfo.css";

interface StateInfoProps {
    state: SolutionState;
    totalIterations?: number;
}

export function StateInfo({ state, totalIterations }: StateInfoProps) {
    const total = state.placements.length;
    const inTruck = state.placements.filter((p) => p.position !== null).length;

    return (
        <dl className="state-info">
            <div className="state-info__row">
                <dt>Iteration</dt>
                <dd>
                    {formatNumber(state.iteration, 0)}
                    {totalIterations !== undefined && ` / ${formatNumber(totalIterations, 0)}`}
                </dd>
            </div>
            <div className="state-info__row">
                <dt>In truck</dt>
                <dd>{inTruck} / {total}</dd>
            </div>
            <div className="state-info__row">
                <dt>Outside</dt>
                <dd>{total - inTruck}</dd>
            </div>
        </dl>
    );
}
