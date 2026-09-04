import { Text } from "@react-three/drei";

export default function Array3DLabels({ value, height, color = "#d4d4d4" }) {
  return (
    <Text position={[0, height + 0.34, 0]} fontSize={0.2} color={color} anchorX="center" anchorY="middle" outlineWidth={0.012} outlineColor="#15191d">
      {String(value)}
    </Text>
  );
}