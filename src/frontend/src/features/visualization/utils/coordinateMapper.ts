import type { Dimensions } from "../../../types/package";
import type { Axis, Orientation, Vec3 } from "../../../types/state";
import type { Truck3DModel, Vector3Type } from "../types";

export const IDENTITY_ORIENTATION: Orientation = { w: "x", l: "y", h: "z" };

/** Orientasi valid = ketiga sisi paket dipetakan ke tiga sumbu yang berbeda. */
export function isValidOrientation(o: Orientation): boolean {
    return new Set<Axis>([o.w, o.l, o.h]).size === 3;
}

/** Ukuran paket sepanjang sumbu x/y/z truk setelah orientasi diterapkan. */
export function orientedExtents(dimensions: Dimensions, o: Orientation): Vec3 {
    if (!isValidOrientation(o)) {
        throw new Error(`Invalid orientation: ${JSON.stringify(o)}`);
    }
    const extents: Vec3 = { x: 0, y: 0, z: 0 };
    extents[o.w] = dimensions.w;
    extents[o.l] = dimensions.l;
    extents[o.h] = dimensions.h;
    return extents;
}

/**
 * Koordinat tugas (z ke atas) -> koordinat Three.js (Y ke atas):
 *   x_world = x,  y_world = z,  z_world = -y
 * Tanda minus menjaga sistem koordinat tetap right-handed (tidak ter-mirror), sehingga
 * panjang truk (sumbu y tugas) memanjang ke arah -Z di dunia 3D.
 * Hasilnya: position = sudut minimum kotak di dunia, dimension = ukuran kotak di dunia.
 */
export function boxToWorld(
    position: Vec3,
    extents: Vec3,
): { position: Vector3Type; dimension: Vector3Type } {
    return {
        position: [position.x, position.z, -(position.y + extents.y)],
        dimension: [extents.x, extents.z, extents.y],
    };
}

/** Pusat kotak di dunia dari sudut minimum + ukuran. */
export function getBoxCenter(position: Vector3Type, dimension: Vector3Type): Vector3Type {
    return [
        position[0] + dimension[0] / 2,
        position[1] + dimension[1] / 2,
        position[2] + dimension[2] / 2,
    ];
}

/** Pusat truk di dunia (truk menempati x 0..width, y 0..height, z -length..0). */
export function getTruckCenter(truck: Truck3DModel): Vector3Type {
    return [truck.width / 2, truck.height / 2, -truck.length / 2];
}
