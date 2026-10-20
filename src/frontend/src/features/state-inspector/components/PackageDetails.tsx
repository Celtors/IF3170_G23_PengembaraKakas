import type { PackageSpec } from "../../../types/package";
import type { PackagePlacement } from "../../../types/state";
import "./PackageDetails.css";

interface PackageDetailsProps {
    packageSpec: PackageSpec | null;
    placement: PackagePlacement | null;
    onClear: () => void;
}

export function PackageDetails({ packageSpec, placement, onClear }: PackageDetailsProps) {
    if (!packageSpec) {
        return <p className="package-details__empty">Click a package in the 3D view to see its details.</p>;
    }

    const { w, l, h } = packageSpec.dimensions;
    const position = placement?.position ?? null;
    const o = placement?.orientation;

    const rows: { label: string; value: string }[] = [
        { label: "Status", value: placement ? (position ? "In truck" : "Outside") : "-" },
        { label: "Position", value: position ? `(${position.x}, ${position.y}, ${position.z})` : "-" },
        { label: "Orientation", value: o ? `w:${o.w}  l:${o.l}  h:${o.h}` : "-" },
        { label: "Dimensions", value: `${w} x ${l} x ${h}` },
        { label: "Value", value: String(packageSpec.value) },
        { label: "Weight", value: String(packageSpec.weight) },
        { label: "ETA (days)", value: String(packageSpec.eta) },
        { label: "Fragile", value: packageSpec.isFragile ? "Yes" : "No" },
    ];

    return (
        <div className="package-details">
            <div className="package-details__header">
                <span className="package-details__id">{packageSpec.id}</span>
                <button type="button" className="package-details__clear" onClick={onClear}>
                    Clear
                </button>
            </div>
            <dl className="package-details__list">
                {rows.map((row) => (
                    <div key={row.label} className="package-details__row">
                        <dt>{row.label}</dt>
                        <dd>{row.value}</dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}
