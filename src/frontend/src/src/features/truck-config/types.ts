import type { Dimensions, PackageSpec } from "../../types/package";

/**
 * Paket di dalam editor. `key` hanya untuk React key / identitas baris:
 * `id` bisa diedit user sehingga tidak aman dipakai sebagai key.
 * `key` TIDAK dikirim ke backend (lihat `packageSpecs` di useTruckConfig).
 */
export interface PackageDraft extends PackageSpec {
    key: string;
}

export type DimensionAxis = keyof Dimensions;
export type PackageScalarField = "id" | "value" | "weight" | "eta" | "isFragile";
export type PackageNumberField = "value" | "weight" | "eta";

export interface NumberFieldDef {
    label: string;
    step: number;
    integer: boolean;
    min?: number;
    hint?: string;
}

export type IssueSeverity = "error" | "warning";

/** `path` mengikuti issuePaths.ts, mis. "truck.w" atau "packages.pkg-3.weight". */
export interface ConfigIssue {
    path: string;
    message: string;
    severity: IssueSeverity;
}

export type UpdateTruckDimensionFn = (axis: DimensionAxis, value: number) => void;

export type UpdatePackageFn = <K extends PackageScalarField>(
    key: string,
    field: K,
    value: PackageSpec[K],
) => void;

export type UpdatePackageDimensionFn = (key: string, axis: DimensionAxis, value: number) => void;
