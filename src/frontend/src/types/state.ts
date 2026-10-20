//data dummy sebelum ada perubahan data
export type Axis = "x" | "y" | "z";

export interface Vec3 {
    x: number;
    y: number;
    z: number;
}

export interface Orientation {
    w: Axis;
    l: Axis;
    h: Axis;
}

export interface PackagePlacement {
    packageId: string;
    orientation: Orientation;
    position: Vec3 | null;
}

export interface SolutionState {
    index: number;
    iteration: number;
    objectiveValue: number;
    placements: PackagePlacement[];
}

//temporary sebelum ada data dari backend
export interface RunSummary {
    totalIterations: number;
    initialObjective: number;
    bestObjective: number;
    finalObjective: number;
}
