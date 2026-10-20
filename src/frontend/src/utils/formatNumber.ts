/** Format angka dengan pemisah ribuan (locale tetap agar hasilnya konsisten). */
export function formatNumber(value: number, maximumFractionDigits = 2): string {
    if (!Number.isFinite(value)) return "-";
    return value.toLocaleString("en-US", { maximumFractionDigits });
}

/** Seperti formatNumber tetapi selalu menampilkan tanda: +12, -3, 0. */
export function formatSignedNumber(value: number, maximumFractionDigits = 2): string {
    if (!Number.isFinite(value)) return "-";
    const text = formatNumber(Math.abs(value), maximumFractionDigits);
    if (value > 0) return `+${text}`;
    if (value < 0) return `-${text}`;
    return text;
}
