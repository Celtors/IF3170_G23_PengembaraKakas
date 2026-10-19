/** Ukuran sebuah balok. Satuan: unit koordinat (bilangan bulat). */
export interface Dimensions {
    w: number; // width
    l: number; // length
    h: number; // height
}

/**
 * Data statis sebuah paket (input). Orientasi dan posisi TIDAK ada di sini:
 * keduanya bagian dari state solusi dan dikirim oleh backend (types/state.ts).
 */
export interface PackageSpec {
    id: string;
    dimensions: Dimensions;
    value: number;      // nilai harga (unit)
    weight: number;     // berat (unit berat)
    isFragile: boolean; // pecah-belah: tidak boleh menjadi support paket lain
    eta: number;        // sisa hari menuju kedatangan
}
