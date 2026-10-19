import type { DimensionAxis, PackageScalarField } from "../types";

export const PACKAGES_PATH = "packages";

export const truckPath = (field: DimensionAxis | "maxCapacity") => `truck.${field}`;

export const packagePrefix = (key: string) => `packages.${key}.`;

export const packagePath = (key: string, field: PackageScalarField | DimensionAxis) =>
    `${packagePrefix(key)}${field}`;
