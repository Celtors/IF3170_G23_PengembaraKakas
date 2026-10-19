import type { Package3DModel } from "../types";
import { PackageModel } from "./PackageModel";

interface PackageCollectionProps {
    packages: Package3DModel[];
    selectedPackageId: string | null;
    onSelectPackage: (packageId: string) => void;
}

export function PackageCollection({ packages, selectedPackageId, onSelectPackage }: PackageCollectionProps) {
    return (
        <group>
            {packages.map((model) => (
                <PackageModel
                    key={model.id}
                    model={model}
                    selected={model.id === selectedPackageId}
                    onSelect={onSelectPackage}
                />
            ))}
        </group>
    );
}
