import type { DimensionsIO, PackageIO, PlacementStatus, StateOut } from "../../api/run";

export type Vec3 = [number, number, number];

export interface PlacedBox {
    id: string;
    index: number;
    pos: Vec3;
    size: Vec3;
    placement: PlacementStatus;
    fragile: boolean;
}

export function layoutBoxes(truck: DimensionsIO, packages: PackageIO[], state: StateOut): PlacedBox[] {
    const byId = new Map(packages.map((p, i) => [p.id, { p, i }]));
    const gap = Math.max(1, Math.round(truck.width * 0.15));
    let nextX = truck.width + gap;

    return state.placements.map((pl) => {
        const { p, i } = byId.get(pl.package_id)!;
        const size = pl.size;
        let pos = pl.position;
        if (pl.placement === "outside") {
            pos = [nextX, 0, 0];
            nextX += size[0] + 1;
        }
        return { id: p.id, index: i, pos, size, placement: pl.placement, fragile: p.is_fragile };
    });
}

export function packageColor(index: number): string {
    return `hsl(${(index * 137.5) % 360}, 65%, 55%)`;
}
