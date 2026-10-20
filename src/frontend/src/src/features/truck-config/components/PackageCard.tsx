import { useId } from "react";
import { DIMENSION_AXES, PACKAGE_NUMBER_FIELDS } from "../../../data/configData";
import { FormField } from "../../algorithm-config/components/FormField";
import type {
    ConfigIssue,
    PackageDraft,
    PackageNumberField,
    UpdatePackageDimensionFn,
    UpdatePackageFn,
} from "../types";
import { findFirstIssue, findIssue, hasIssueUnder } from "../utils/findIssue";
import { packagePath, packagePrefix } from "../utils/issuePaths";
import "./PackageCard.css";

interface PackageCardProps {
    pkg: PackageDraft;
    expanded: boolean;
    issues: ConfigIssue[];
    onToggle: (key: string) => void;
    onRemove: (key: string) => void;
    onUpdate: UpdatePackageFn;
    onUpdateDimension: UpdatePackageDimensionFn;
}

const NUMBER_FIELDS = Object.keys(PACKAGE_NUMBER_FIELDS) as PackageNumberField[];

export function PackageCard({
    pkg,
    expanded,
    issues,
    onToggle,
    onRemove,
    onUpdate,
    onUpdateDimension,
}: PackageCardProps) {
    const bodyId = useId();
    const { w, l, h } = pkg.dimensions;
    const hasError = hasIssueUnder(issues, packagePrefix(pkg.key));
    const displayId = pkg.id.trim() === "" ? "(no ID)" : pkg.id;
    const dimsText = [w, l, h].every(Number.isFinite) ? `${w}×${l}×${h}` : "—";

    const className = [
        "package-card",
        expanded ? "package-card--expanded" : "",
        hasError ? "package-card--error" : "",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <li className={className}>
            <div className="package-card__header">
                <button
                    type="button"
                    className="package-card__toggle"
                    aria-expanded={expanded}
                    aria-controls={bodyId}
                    onClick={() => onToggle(pkg.key)}
                >
                    <span className="package-card__chevron" aria-hidden="true">
                        {expanded ? "▾" : "▸"}
                    </span>
                    <span className="package-card__id">{displayId}</span>
                    <span className="package-card__dims">{dimsText}</span>
                    {pkg.isFragile && <span className="package-card__badge">Fragile</span>}
                    {hasError && (
                        <span
                            className="package-card__badge package-card__badge--error"
                            title="This package has input errors"
                        >
                            !
                        </span>
                    )}
                </button>
                <button
                    type="button"
                    className="package-card__remove"
                    aria-label={`Remove ${displayId}`}
                    title="Remove package"
                    onClick={() => onRemove(pkg.key)}
                >
                    x
                </button>
            </div>

            {expanded && (
                <div id={bodyId} className="package-card__body">
                    <FormField label="Package ID" issue={findIssue(issues, packagePath(pkg.key, "id"))}>
                        <input
                            type="text"
                            value={pkg.id}
                            onChange={(e) => onUpdate(pkg.key, "id", e.target.value)}
                        />
                    </FormField>

                    <FormField
                        group
                        label="Dimensions (W × L × H)"
                        issue={findFirstIssue(
                            issues,
                            DIMENSION_AXES.map(({ axis }) => packagePath(pkg.key, axis)),
                        )}
                    >
                        <div className="form-field__row">
                            {DIMENSION_AXES.map(({ axis, label, short }) => {
                                const value = pkg.dimensions[axis];
                                return (
                                    <input
                                        key={axis}
                                        type="number"
                                        min={1}
                                        step={1}
                                        placeholder={short}
                                        aria-label={`${label} of ${displayId}`}
                                        value={Number.isNaN(value) ? "" : value}
                                        onChange={(e) =>
                                            onUpdateDimension(pkg.key, axis, e.target.valueAsNumber)
                                        }
                                    />
                                );
                            })}
                        </div>
                    </FormField>

                    <div className="form-field__row">
                        {NUMBER_FIELDS.map((field) => {
                            const def = PACKAGE_NUMBER_FIELDS[field];
                            const value = pkg[field];
                            return (
                                <FormField
                                    key={field}
                                    label={def.label}
                                    issue={findIssue(issues, packagePath(pkg.key, field))}
                                >
                                    <input
                                        type="number"
                                        min={def.min}
                                        step={def.step}
                                        value={Number.isNaN(value) ? "" : value}
                                        onChange={(e) => onUpdate(pkg.key, field, e.target.valueAsNumber)}
                                    />
                                </FormField>
                            );
                        })}
                    </div>

                    <label className="package-card__fragile">
                        <input
                            type="checkbox"
                            checked={pkg.isFragile}
                            onChange={(e) => onUpdate(pkg.key, "isFragile", e.target.checked)}
                        />
                        <span className="package-card__fragile-text">
                            <span className="package-card__fragile-title">Fragile</span>
                            <span className="package-card__fragile-detail">
                            </span>
                        </span>
                    </label>
                </div>
            )}
        </li>
    );
}
