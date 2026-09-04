import { Text } from "@react-three/drei";

export default function Array3DLabels({ value, height, fontSize = 0.2, color = "#d4d4d4", pointerLabel = null }) {
  return (
    <group>
      <Text position={[0, height + fontSize * 1.7, 0]} fontSize={fontSize} color={color} anchorX="center" anchorY="middle" outlineWidth={0.012} outlineColor="#15191d">
        {String(value)}
      </Text>
      {pointerLabel && <Text position={[0, -0.08, 0]} fontSize={fontSize * 0.72} color="#dcdcaa" anchorX="center" anchorY="middle" outlineWidth={0.01} outlineColor="#15191d">{pointerLabel}</Text>}
    </group>
  );
}