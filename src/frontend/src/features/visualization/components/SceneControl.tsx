import { OrbitControls } from "@react-three/drei";
import type { Vector3Type } from "../types";

interface SceneControlProps {
    target: Vector3Type;
}

export function SceneControl({ target }: SceneControlProps) {
    return (
        <OrbitControls
            makeDefault
            target={target}
            enableDamping
            maxPolarAngle={Math.PI / 2 - 0.02}
        />
    );
}
