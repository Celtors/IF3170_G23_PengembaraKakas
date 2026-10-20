import type { Dimensions } from "../../../types/package";
import type { Vec3 } from "../../../types/state";

export interface StagingItem {
    id: string;
    extents: Vec3;
}

/**
 * Tata letak TAMPILAN untuk paket di luar truk: kolom-kolom di sisi +x truk,
 * di atas tanah. Hanya untuk visualisasi; bukan bagian dari state/algoritma.
 */
export function layoutStaging(items: StagingItem[], truck: Dimensions, gap = 1): Map<string, Vec3> {
    const positions = new Map<string, Vec3>();
    let columnX = truck.w + gap * 2;
    let cursorY = 0;
    let columnWidth = 0;

    for (const item of items) {
        if (cursorY > 0 && cursorY + item.extents.y > truck.l) {
            columnX += columnWidth + gap;
            cursorY = 0;
            columnWidth = 0;
        }
        positions.set(item.id, { x: columnX, y: cursorY, z: 0 });
        cursorY += item.extents.y + gap;
        columnWidth = Math.max(columnWidth, item.extents.x);
    }
    return positions;
}
