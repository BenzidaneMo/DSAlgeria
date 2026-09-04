export default function Array3DPlatform({ width, depth = 2.3 }) {
  return (
    <>
      <mesh position={[0, -0.08, 0]} receiveShadow>
        <boxGeometry args={[Math.max(width + 2.4, 5), 0.16, depth]} />
        <meshStandardMaterial color="#181818" roughness={0.9} metalness={0.05} />
      </mesh>
      <gridHelper args={[Math.max(width + 2.4, 5), 12, "#303031", "#252526"]} position={[0, 0.01, 0]} />
    </>
  );
}