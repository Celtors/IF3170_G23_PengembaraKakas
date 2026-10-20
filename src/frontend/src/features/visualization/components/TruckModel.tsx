import { useEffect, useMemo } from "react";
import { BoxGeometry, EdgesGeometry } from "three";
import type { Truck3DModel } from "../types";
import { getTruckCenter } from "../utils/coordinateMapper";

interface TruckModelProps {
    truck: Truck3DModel;
}

export function TruckModel({ truck }: TruckModelProps) {
    const { width, length, height } = truck;
    const [cx, cy, cz] = getTruckCenter(truck);

    const edges = useMemo(() => {
        const box = new BoxGeometry(width, height, length);
        const geometry = new EdgesGeometry(box);
        box.dispose();
        return geometry;
    }, [width, height, length]);

    useEffect(() => () => edges.dispose(), [edges]);

    return (
        <group>
            <mesh rotation-x={-Math.PI / 2} position={[cx, -0.01, cz]}>
                <planeGeometry args={[width, length]} />
                <meshStandardMaterial color="#1e293b" />
            </mesh>
            <lineSegments geometry={edges} position={[cx, cy, cz]}>
                <lineBasicMaterial color="#94a3b8" />
            </lineSegments>
        </group>
    );
}
