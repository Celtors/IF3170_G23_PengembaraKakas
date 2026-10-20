import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { DimensionsIO } from "../../api/run";
import { packageColor, type PlacedBox } from "./layout";

interface Props {
    truck: DimensionsIO;
    boxes: PlacedBox[];
    highlightId: string | null;
    onHover: (id: string | null) => void;
}

const toThree = (x: number, y: number, z: number) => new THREE.Vector3(x, z, y);

export function Truck3D({ truck, boxes, highlightId, onHover }: Props) {
    const hostRef = useRef<HTMLDivElement>(null);
    const meshesRef = useRef(new Map<string, THREE.Mesh>());
    const renderRef = useRef<() => void>(() => {});

    useEffect(() => {
        const host = hostRef.current!;
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        host.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        scene.add(new THREE.AmbientLight(0xffffff, 1.6));
        const sun = new THREE.DirectionalLight(0xffffff, 1.8);
        sun.position.set(1, 3, 2);
        scene.add(sun);

        const truckSize = toThree(truck.width, truck.length, truck.height);
        const truckCenter = truckSize.clone().multiplyScalar(0.5);
        const shell = new THREE.LineSegments(
            new THREE.EdgesGeometry(new THREE.BoxGeometry(truckSize.x, truckSize.y, truckSize.z)),
            new THREE.LineBasicMaterial({ color: 0x4b5563 }),
        );
        shell.position.copy(truckCenter);
        scene.add(shell);
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(truckSize.x, truckSize.z),
            new THREE.MeshBasicMaterial({ color: 0x9ca3af, transparent: true, opacity: 0.25, side: THREE.DoubleSide }),
        );
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(truckCenter.x, 0, truckCenter.z);
        scene.add(floor);

        const meshes = meshesRef.current;
        meshes.clear();
        let maxX = truck.width, maxY = truck.length, maxZ = truck.height;
        for (const b of boxes) {
            const size = toThree(...b.size);
            const mesh = new THREE.Mesh(
                new THREE.BoxGeometry(size.x, size.y, size.z),
                new THREE.MeshLambertMaterial({
                    color: b.placement === "stuck" ? 0xef4444 : packageColor(b.index),
                    transparent: b.placement !== "inside",
                    opacity: { inside: 1, outside: 0.45, stuck: 0.6 }[b.placement],
                }),
            );
            mesh.position.copy(toThree(...b.pos).add(size.clone().multiplyScalar(0.5)));
            mesh.userData.id = b.id;
            mesh.add(new THREE.LineSegments(
                new THREE.EdgesGeometry(mesh.geometry),
                new THREE.LineBasicMaterial({ color: b.fragile ? 0xf59e0b : 0x111827 }),
            ));
            scene.add(mesh);
            meshes.set(b.id, mesh);
            maxX = Math.max(maxX, b.pos[0] + b.size[0]);
            maxY = Math.max(maxY, b.pos[1] + b.size[1]);
            maxZ = Math.max(maxZ, b.pos[2] + b.size[2]);
        }

        const target = toThree(maxX / 2, maxY / 2, maxZ / 2);
        const span = Math.max(maxX, maxY, maxZ);
        const camera = new THREE.PerspectiveCamera(45, 1, span / 100, span * 20);
        camera.position.copy(target).add(new THREE.Vector3(span * 0.35, span * 0.55, span * 0.8));
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.copy(target);
        controls.update();

        const render = () => renderer.render(scene, camera);
        renderRef.current = render;
        controls.addEventListener("change", render);

        const resize = () => {
            const { clientWidth: w, clientHeight: h } = host;
            if (!w || !h) return;
            renderer.setSize(w, h);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            render();
        };
        const observer = new ResizeObserver(resize);
        observer.observe(host);
        resize();

        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();
        let lastId: string | null = null;
        const onMove = (e: PointerEvent) => {
            const rect = renderer.domElement.getBoundingClientRect();
            pointer.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
            raycaster.setFromCamera(pointer, camera);
            const hit = raycaster.intersectObjects([...meshes.values()], false)[0];
            const id = (hit?.object.userData.id as string | undefined) ?? null;
            if (id !== lastId) onHover((lastId = id));
        };
        const onLeave = () => { if (lastId !== null) onHover((lastId = null)); };
        renderer.domElement.addEventListener("pointermove", onMove);
        renderer.domElement.addEventListener("pointerleave", onLeave);

        return () => {
            observer.disconnect();
            controls.dispose();
            renderer.domElement.removeEventListener("pointermove", onMove);
            renderer.domElement.removeEventListener("pointerleave", onLeave);
            scene.traverse((o) => {
                if (o instanceof THREE.Mesh || o instanceof THREE.LineSegments) {
                    o.geometry.dispose();
                    (o.material as THREE.Material).dispose();
                }
            });
            renderer.dispose();
            host.removeChild(renderer.domElement);
            meshes.clear();
        };
    }, [truck, boxes, onHover]);

    useEffect(() => {
        for (const [id, mesh] of meshesRef.current) {
            (mesh.material as THREE.MeshLambertMaterial).emissive.setHex(id === highlightId ? 0x444444 : 0x000000);
        }
        renderRef.current();
    }, [highlightId, boxes]);

    return <div ref={hostRef} className="truck3d" />;
}
