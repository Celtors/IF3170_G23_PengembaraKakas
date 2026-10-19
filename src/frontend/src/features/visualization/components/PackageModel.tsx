import { useEffect, useState } from "react";
import { Edges } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import type { Package3DModel } from "../types";
import { getBoxCenter } from "../utils/coordinateMapper";

interface PackageModelProps {
    model: Package3DModel;
    selected: boolean;
    onSelect: (packageId: string) => void;
}

export function PackageModel({ model, selected, onSelect }: PackageModelProps) {
    const [hovered, setHovered] = useState(false);

    useEffect(() => {
        document.body.style.cursor = hovered ? "pointer" : "auto";
        return () => {
            document.body.style.cursor = "auto";
        };
    }, [hovered]);

    const center = getBoxCenter(model.position, model.dimension);
    const edgeColor = selected ? "#38bdf8" : model.isFragile ? "#fbbf24" : "#020617";

    return (
        <mesh
            position={center}
            onClick={(e: ThreeEvent<MouseEvent>) => {
                e.stopPropagation();
                onSelect(model.id);
            }}
            onPointerOver={(e: ThreeEvent<PointerEvent>) => {
                e.stopPropagation();
                setHovered(true);
            }}
            onPointerOut={() => setHovered(false)}
        >
            <boxGeometry args={model.dimension} />
            <meshStandardMaterial
                color={model.color}
                transparent={!model.inTruck}
                opacity={model.inTruck ? 1 : 0.6}
                emissive={selected ? "#38bdf8" : "#ffffff"}
                emissiveIntensity={selected ? 0.35 : hovered ? 0.15 : 0}
            />
            <Edges color={edgeColor} />
        </mesh>
    );
}
