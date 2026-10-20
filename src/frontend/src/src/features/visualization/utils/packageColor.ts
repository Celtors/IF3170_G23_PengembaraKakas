/** Warna stabil per paket (hash dari id); paket di luar truk dibuat pudar. */
export function packageColor(packageId: string, inTruck: boolean): string {
    let hash = 0;
    for (let i = 0; i < packageId.length; i++) {
        hash = (hash * 31 + packageId.charCodeAt(i)) >>> 0;
    }
    const hue = hash % 360;
    return inTruck ? `hsl(${hue}, 60%, 55%)` : `hsl(${hue}, 12%, 50%)`;
}
