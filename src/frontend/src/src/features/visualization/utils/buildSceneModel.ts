import type { PackageSpec } from "../../../types/package";
import type { SolutionState } from "../../../types/state";
import type { TruckSpec } from "../../../types/truck";
import type { Package3DModel, SceneModel } from "../types";
import {
    IDENTITY_ORIENTATION,
    boxToWorld,
    isValidOrientation,
    orientedExtents,
} from "./coordinateMapper";
import { packageColor } from "./packageColor";
import { layoutStaging } from "./stagingLayout";

export function buildSceneModel(
    truck: TruckSpec,
    packages: PackageSpec[],
    state: SolutionState | null,
): SceneModel {
    const { w, l, h } = truck.dimensions;
    const truckModel = { width: w, length: l, height: h };
    if (!state) return { truck: truckModel, packages: [] };

    const specById = new Map(packages.map((p) => [p.id, p]));

    const resolved = state.placements.flatMap((placement) => {
        const spec = specById.get(placement.packageId);
        if (!spec) {
            console.warn(`[visualization] Unknown package id "${placement.packageId}"; skipped.`);
            return [];
        }
        let orientation = placement.orientation;
        if (!isValidOrientation(orientation)) {
            console.warn(`[visualization] Invalid orientation for "${spec.id}"; using identity.`);
            orientation = IDENTITY_ORIENTATION;
        }
        return [
            { spec, position: placement.position, extents: orientedExtents(spec.dimensions, orientation) },
        ];
    });

    const staging = layoutStaging(
        resolved.filter((r) => r.position === null).map((r) => ({ id: r.spec.id, extents: r.extents })),
        truck.dimensions,
    );

    const models: Package3DModel[] = resolved.map(({ spec, position, extents }) => {
        const box = boxToWorld(position ?? staging.get(spec.id)!, extents);
        return {
            id: spec.id,
            position: box.position,
            dimension: box.dimension,
            color: packageColor(spec.id, position !== null),
            inTruck: position !== null,
            isFragile: spec.isFragile,
        };
    });

    return { truck: truckModel, packages: models };
}
