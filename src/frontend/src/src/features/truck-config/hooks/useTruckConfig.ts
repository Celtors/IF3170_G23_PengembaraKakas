import { useCallback, useMemo, useState } from "react";
import { DEFAULT_NEW_PACKAGE, DEFAULT_PACKAGES, DEFAULT_TRUCK } from "../../../data/configData";
import type { PackageSpec } from "../../../types/package";
import type { TruckSpec } from "../../../types/truck";
import type {
    ConfigIssue,
    DimensionAxis,
    PackageDraft,
    UpdatePackageDimensionFn,
    UpdatePackageFn,
    UpdateTruckDimensionFn,
} from "../types";
import { validateTruckConfig } from "../utils/validateTruckConfig";

let keyCounter = 0;
const nextKey = () => `pkg-${++keyCounter}`;

const toDrafts = (specs: PackageSpec[]): PackageDraft[] =>
    specs.map((s) => ({ ...s, dimensions: { ...s.dimensions }, key: nextKey() }));

// Dibuat eksplisit (bukan destructuring rest) agar `key` tidak ikut terkirim ke backend.
const toSpec = (d: PackageDraft): PackageSpec => ({
    id: d.id,
    dimensions: { ...d.dimensions },
    value: d.value,
    weight: d.weight,
    isFragile: d.isFragile,
    eta: d.eta,
});

/** "PKG-n" terkecil yang belum dipakai, dimulai dari jumlah paket + 1. */
function nextPackageId(packages: PackageDraft[]): string {
    const used = new Set(packages.map((p) => p.id.trim()));
    let n = packages.length + 1;
    while (used.has(`PKG-${n}`)) n++;
    return `PKG-${n}`;
}

export function useTruckConfig(
    initialTruck: TruckSpec = DEFAULT_TRUCK,
    initialPackages: PackageSpec[] = DEFAULT_PACKAGES,
) {
    const [truck, setTruck] = useState<TruckSpec>({
        ...initialTruck,
        dimensions: { ...initialTruck.dimensions },
    });
    const [packages, setPackages] = useState<PackageDraft[]>(() => toDrafts(initialPackages));

    const updateTruckDimension = useCallback<UpdateTruckDimensionFn>((axis, value) => {
        setTruck((prev) => ({ ...prev, dimensions: { ...prev.dimensions, [axis]: value } }));
    }, []);

    const updateMaxCapacity = useCallback((value: number) => {
        setTruck((prev) => ({ ...prev, maxCapacity: value }));
    }, []);

    /** Mengembalikan key paket baru agar UI bisa langsung membukanya. */
    const addPackage = useCallback((): string => {
        const key = nextKey();
        setPackages((prev) => [
            ...prev,
            {
                ...DEFAULT_NEW_PACKAGE,
                dimensions: { ...DEFAULT_NEW_PACKAGE.dimensions },
                id: nextPackageId(prev),
                key,
            },
        ]);
        return key;
    }, []);

    const removePackage = useCallback((key: string) => {
        setPackages((prev) => prev.filter((p) => p.key !== key));
    }, []);

    const updatePackage = useCallback<UpdatePackageFn>((key, field, value) => {
        setPackages((prev) => prev.map((p) => (p.key === key ? { ...p, [field]: value } : p)));
    }, []);

    const updatePackageDimension = useCallback<UpdatePackageDimensionFn>(
        (key: string, axis: DimensionAxis, value: number) => {
            setPackages((prev) =>
                prev.map((p) =>
                    p.key === key ? { ...p, dimensions: { ...p.dimensions, [axis]: value } } : p,
                ),
            );
        },
        [],
    );

    const resetToDefaults = useCallback(() => {
        setTruck({ ...DEFAULT_TRUCK, dimensions: { ...DEFAULT_TRUCK.dimensions } });
        setPackages(toDrafts(DEFAULT_PACKAGES));
    }, []);

    const validationIssues = useMemo<ConfigIssue[]>(
        () => validateTruckConfig(truck, packages),
        [truck, packages],
    );

    const isValid = useMemo(
        () => !validationIssues.some((issue) => issue.severity === "error"),
        [validationIssues],
    );

    // Bentuk yang dikirim ke backend (tanpa `key` internal).
    const packageSpecs = useMemo<PackageSpec[]>(() => packages.map(toSpec), [packages]);

    return {
        truck,
        updateTruckDimension,
        updateMaxCapacity,
        packages,
        packageSpecs,
        addPackage,
        removePackage,
        updatePackage,
        updatePackageDimension,
        resetToDefaults,
        validationIssues,
        isValid,
    };
}
