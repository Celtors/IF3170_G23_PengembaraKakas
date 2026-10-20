import { formatNumber, formatSignedNumber } from "../../../utils/formatNumber";
import "./ObjectiveValue.css";

interface ObjectiveValueProps {
    current: number;
    previous?: number;
    initial?: number;
    best?: number;
    final?: number;
}

export function ObjectiveValue({ current, previous, initial, best, final }: ObjectiveValueProps) {
    const delta = previous === undefined ? undefined : current - previous;
    const deltaClass =
        delta === undefined || delta === 0
            ? "objective-value__delta"
            : delta > 0
                ? "objective-value__delta objective-value__delta--up"
                : "objective-value__delta objective-value__delta--down";
    const isBest = best !== undefined && current === best;

    const summaryRows: { label: string; value: number }[] = [];
    if (initial !== undefined) summaryRows.push({ label: "Initial", value: initial });
    if (best !== undefined) summaryRows.push({ label: "Best", value: best });
    if (final !== undefined) summaryRows.push({ label: "Final", value: final });

    return (
        <div className="objective-value">
            <div className="objective-value__main">
                <span className="objective-value__current">{formatNumber(current)}</span>
                {delta !== undefined && (
                    <span className={deltaClass} title="Change from the previous state">
                        {formatSignedNumber(delta)}
                    </span>
                )}
                {isBest && <span className="objective-value__badge">Best</span>}
            </div>

            {summaryRows.length > 0 && (
                <dl className="objective-value__summary">
                    {summaryRows.map((row) => (
                        <div key={row.label} className="objective-value__row">
                            <dt>{row.label}</dt>
                            <dd>{formatNumber(row.value)}</dd>
                        </div>
                    ))}
                </dl>
            )}
        </div>
    );
}
