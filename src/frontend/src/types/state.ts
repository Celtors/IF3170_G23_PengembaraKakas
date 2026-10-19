//masih placeholder, temporary type, soalnya belum sepakat sama BE
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
