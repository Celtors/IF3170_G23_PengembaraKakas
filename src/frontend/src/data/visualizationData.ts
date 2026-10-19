import type { PackageSpec } from "../types/package";
import type { Orientation, PackagePlacement, SolutionState } from "../types/state";
import type { TruckSpec } from "../types/truck";
import { DEFAULT_PACKAGES, DEFAULT_TRUCK } from "./configData";

//buat testing
const IDENTITY: Orientation = { w: "x", l: "y", h: "z" };
const ROTATED_Z: Orientation = { w: "y", l: "x", h: "z" };
const ROTATED_UP: Orientation = { w: "z", l: "y", h: "x" };

const inside = (
    packageId: string,
    x: number,
    y: number,
    z: number,
    orientation: Orientation = IDENTITY,
): PackagePlacement => ({ packageId, orientation, position: { x, y, z } });

function buildState(
    index: number,
    iteration: number,
    objectiveValue: number,
    placed: PackagePlacement[],
): SolutionState {
    const placedIds = new Set(placed.map((p) => p.packageId));
    const outside: PackagePlacement[] = DEFAULT_PACKAGES.filter((p) => !placedIds.has(p.id)).map(
        (p) => ({ packageId: p.id, orientation: IDENTITY, position: null }),
    );
    return { index, iteration, objectiveValue, placements: [...placed, ...outside] };
}

export const MOCK_STATES: SolutionState[] = [
    buildState(0, 0, 510, [
        inside("PKG-2", 0, 0, 0),
        inside("PKG-11", 4, 10, 0),
        inside("PKG-5", 0, 12, 0),
    ]),
    buildState(1, 42, 855, [
        inside("PKG-7", 0, 0, 0),
        inside("PKG-11", 0, 12, 0),
        inside("PKG-5", 6, 12, 0),
        inside("PKG-6", 8, 0, 0),
    ]),
    buildState(2, 118, 1010, [
        inside("PKG-7", 0, 0, 0),
        inside("PKG-9", 0, 12, 0, ROTATED_Z),
        inside("PKG-6", 8, 0, 0),
        inside("PKG-12", 8, 5, 0, ROTATED_UP),
        inside("PKG-3", 0, 12, 4),
    ]),
];

export const MOCK_RUN: { truck: TruckSpec; packages: PackageSpec[]; states: SolutionState[] } = {
    truck: DEFAULT_TRUCK,
    packages: DEFAULT_PACKAGES,
    states: MOCK_STATES,
};
