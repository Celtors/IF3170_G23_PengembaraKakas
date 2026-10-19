import type { Dimensions } from "./package";

export interface TruckSpec {
    dimensions: Dimensions;
    maxCapacity: number; // kapasitas angkut maksimum (unit berat)
}
