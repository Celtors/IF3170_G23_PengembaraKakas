import { Canvas } from "@react-three/fiber";
import type { PackageSpec } from "../../../types/package";
import type { SolutionState } from "../../../types/state";
import type { TruckSpec } from "../../../types/truck";
import { useSceneState } from "../hooks/useSceneState";
import { getTruckCenter } from "../utils/coordinateMapper";
import { PackageCollection } from "./PackageCollection";
import { SceneControl } from "./SceneControl";
import { SceneLight } from "./SceneLight";
import { TruckModel } from "./TruckModel";
import "./VisualizationCanvas.css";

interface VisualizationCanvasProps {
    truck: TruckSpec;
    packages: PackageSpec[];
    state: SolutionState | null;
    selectedPackageId: string | null;
    onSelectPackage: (packageId: string | null) => void;
}

export function VisualizationCanvas({
    truck,
    packages,
    state,
    selectedPackageId,
    onSelectPackage,
}: VisualizationCanvasProps) {
    const scene = useSceneState(truck, packages, state);
    const center = getTruckCenter(scene.truck);
    const span = Math.max(scene.truck.width, scene.truck.length, scene.truck.height);

    return (
        <div className="visualization-canvas">
            <Canvas
                camera={{
                    position: [center[0] - span * 0.9, center[1] + span * 0.9, center[2] + span * 1.2],
                    fov: 45,
                }}
                onPointerMissed={() => onSelectPackage(null)}
            >
                <SceneLight />
                <SceneControl target={center} />
                <TruckModel truck={scene.truck} />
                <PackageCollection
                    packages={scene.packages}
                    selectedPackageId={selectedPackageId}
                    onSelectPackage={onSelectPackage}
                />
            </Canvas>

            {!state && (
                <p className="visualization-canvas__empty">No state to display yet. Run an algorithm.</p>
            )}

            <ul className="visualization-canvas__legend" aria-label="Legend">
                <li><span className="visualization-canvas__swatch visualization-canvas__swatch--inside" />In truck</li>
                <li><span className="visualization-canvas__swatch visualization-canvas__swatch--outside" />Outside</li>
                <li><span className="visualization-canvas__swatch visualization-canvas__swatch--fragile" />Fragile</li>
                <li><span className="visualization-canvas__swatch visualization-canvas__swatch--selected" />Selected</li>
            </ul>
        </div>
    );
}
