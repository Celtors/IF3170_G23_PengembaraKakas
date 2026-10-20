import { useState } from "react";
import type {
    ConfigIssue,
    PackageDraft,
    UpdatePackageDimensionFn,
    UpdatePackageFn,
} from "../types";
import { findIssue } from "../utils/findIssue";
import { PACKAGES_PATH } from "../utils/issuePaths";
import { PackageCard } from "./PackageCard";
import "./PackageListEditor.css";

interface PackageListEditorProps {
    packages: PackageDraft[];
    issues: ConfigIssue[];
    /** Mengembalikan key paket baru agar kartunya bisa langsung dibuka. */
    onAdd: () => string;
    onRemove: (key: string) => void;
    onUpdate: UpdatePackageFn;
    onUpdateDimension: UpdatePackageDimensionFn;
}

export function PackageListEditor({
    packages,
    issues,
    onAdd,
    onRemove,
    onUpdate,
    onUpdateDimension,
}: PackageListEditorProps) {
    const [expandedKeys, setExpandedKeys] = useState<Set<string>>(() => new Set());

    const toggle = (key: string) =>
        setExpandedKeys((prev) => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });

    const handleAdd = () => {
        const key = onAdd();
        setExpandedKeys((prev) => new Set(prev).add(key));
    };

    const listIssue = findIssue(issues, PACKAGES_PATH);

    return (
        <section className="package-list-editor">
            <div className="package-list-editor__header">
                <h3 className="package-list-editor__title">Packages ({packages.length})</h3>
                <button type="button" className="package-list-editor__add" onClick={handleAdd}>
                    + Add
                </button>
            </div>

            {packages.length === 0 && (
                <p className="package-list-editor__empty">No packages yet.</p>
            )}

            {listIssue && (
                <small className="package-list-editor__issue" role="alert">
                    {listIssue.message}
                </small>
            )}

            {packages.length > 0 && (
                <ul className="package-list-editor__list">
                    {packages.map((pkg) => (
                        <PackageCard
                            key={pkg.key}
                            pkg={pkg}
                            expanded={expandedKeys.has(pkg.key)}
                            issues={issues}
                            onToggle={toggle}
                            onRemove={onRemove}
                            onUpdate={onUpdate}
                            onUpdateDimension={onUpdateDimension}
                        />
                    ))}
                </ul>
            )}
        </section>
    );
}
