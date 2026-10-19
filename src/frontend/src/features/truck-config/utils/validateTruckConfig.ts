import {
    DIMENSION_AXES,
    DIMENSION_FIELD,
    MAX_CAPACITY_FIELD,
    PACKAGE_NUMBER_FIELDS,
} from "../../../data/configData";
import type { TruckSpec } from "../../../types/truck";
import type { ConfigIssue, NumberFieldDef, PackageDraft, PackageNumberField } from "../types";
import { PACKAGES_PATH, packagePath, truckPath } from "./issuePaths";

function checkNumber(value: number, def: NumberFieldDef, label: string): string | null {
    if (!Number.isFinite(value)) return `${label}: enter a number.`;
    if (def.integer && !Number.isInteger(value)) return `${label} must be a whole number.`;
    if (def.min !== undefined && value < def.min) return `${label} must be at least ${def.min}.`;
    return null;
}

export function validateTruckConfig(truck: TruckSpec, packages: PackageDraft[]): ConfigIssue[] {
    const issues: ConfigIssue[] = [];
    const add = (path: string, message: string, severity: ConfigIssue["severity"] = "error") =>
        issues.push({ path, message, severity });

    //Truk
    for (const { axis, label } of DIMENSION_AXES) {
        const msg = checkNumber(truck.dimensions[axis], DIMENSION_FIELD, `Truck ${label.toLowerCase()}`);
        if (msg) add(truckPath(axis), msg);
    }
    const capMsg = checkNumber(truck.maxCapacity, MAX_CAPACITY_FIELD, "Max capacity");
    if (capMsg) add(truckPath("maxCapacity"), capMsg);

    //Daftar paket
    if (packages.length === 0) {
        add(PACKAGES_PATH, "Add at least one package.");
        return issues;
    }

    const idCount = new Map<string, number>();
    for (const pkg of packages) {
        const id = pkg.id.trim();
        idCount.set(id, (idCount.get(id) ?? 0) + 1);
    }

    for (const pkg of packages) {
        const id = pkg.id.trim();
        if (id === "") {
            add(packagePath(pkg.key, "id"), "Package ID is required.");
        } else if ((idCount.get(id) ?? 0) > 1) {
            add(packagePath(pkg.key, "id"), "Package ID must be unique.");
        }

        for (const { axis, label } of DIMENSION_AXES) {
            const msg = checkNumber(pkg.dimensions[axis], DIMENSION_FIELD, label);
            if (msg) add(packagePath(pkg.key, axis), msg);
        }

        for (const field of Object.keys(PACKAGE_NUMBER_FIELDS) as PackageNumberField[]) {
            const def = PACKAGE_NUMBER_FIELDS[field];
            const msg = checkNumber(pkg[field], def, def.label);
            if (msg) add(packagePath(pkg.key, field), msg);
        }

        if (pkg.value === 0) {
            add(packagePath(pkg.key, "value"), "Value is 0; loading this package adds nothing.", "warning");
        }
    }

    return issues;
}
