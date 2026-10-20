export type Vector3Type = [number, number, number];

export interface Package3DModel {
    id: string;
    position: Vector3Type;
    dimension: Vector3Type;
    color: string;
    inTruck: boolean;
    isFragile: boolean;
}

export interface Truck3DModel {
    width: number;
    length: number;
    height: number;
}

export interface SceneModel {
    truck: Truck3DModel;
    packages: Package3DModel[];
}
