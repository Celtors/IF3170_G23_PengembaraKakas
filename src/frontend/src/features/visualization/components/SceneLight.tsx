export function SceneLight() {
    return (
        <>
            <ambientLight intensity={0.7} />
            <directionalLight position={[20, 30, 20]} intensity={1.1} />
            <directionalLight position={[-15, 10, -10]} intensity={0.35} />
        </>
    );
}
