export function clampIndex(index: number, count: number): number {
    if (!Number.isFinite(index)) return 0;
    return Math.max(0, Math.min(Math.trunc(index), count - 1));
}
