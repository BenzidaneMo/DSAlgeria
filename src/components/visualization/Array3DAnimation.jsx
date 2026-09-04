import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";

export default function Array3DAnimation({ children, targetX, targetY = 0, isSwapping = false, swapStartX = targetX, stepIndex }) {
  const groupRef = useRef();
  const targetPosition = useRef(new THREE.Vector3(targetX, targetY, 0));
  const startPosition = useRef(new THREE.Vector3(targetX, targetY, 0));
  const animationStart = useRef(null);

  useLayoutEffect(() => {
    if (!groupRef.current) {
      return;
    }

    targetPosition.current.set(targetX, targetY, 0);
    startPosition.current.copy(groupRef.current.position);

    if (isSwapping && stepIndex >= 0) {
      startPosition.current.set(swapStartX, 0.12, 0);
      groupRef.current.position.copy(startPosition.current);
      animationStart.current = performance.now();
    } else {
      animationStart.current = null;
    }
  }, [isSwapping, stepIndex, swapStartX, targetX, targetY]);

  useFrame(() => {
    if (!groupRef.current) {
      return;
    }

    if (animationStart.current === null) {
      groupRef.current.position.lerp(targetPosition.current, 0.22);
      return;
    }

    const progress = Math.min((performance.now() - animationStart.current) / 520, 1);
    const eased = progress < 0.5
      ? 4 * progress ** 3
      : 1 - ((-2 * progress + 2) ** 3) / 2;

    groupRef.current.position.x = THREE.MathUtils.lerp(startPosition.current.x, targetPosition.current.x, eased);
    groupRef.current.position.y = THREE.MathUtils.lerp(startPosition.current.y, targetPosition.current.y, eased);
    groupRef.current.position.z = targetPosition.current.z;

    if (progress === 1) {
      animationStart.current = null;
    }
  });

  return <group ref={groupRef}>{children}</group>;
}