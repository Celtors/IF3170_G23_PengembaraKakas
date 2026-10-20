import { useCallback, useState } from "react";

export function usePackageSelection() {
    const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);

    const selectPackage = useCallback((id: string | null) => setSelectedPackageId(id), []);

    return { selectedPackageId, selectPackage };
}