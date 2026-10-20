import { useMemo } from "react";
import type { PackageSpec } from "../../../types/package";
import type { SolutionState } from "../../../types/state";
import type { TruckSpec } from "../../../types/truck";
import type { SceneModel } from "../types";
import { buildSceneModel } from "../utils/buildSceneModel";

export function useSceneState(
    truck: TruckSpec,
    packages: PackageSpec[],
    state: SolutionState | null,
): SceneModel {
    return useMemo(() => buildSceneModel(truck, packages, state), [truck, packages, state]);
}
