import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Array3DScene from "./Array3DScene";

const CAMERA_FOV = 42;
const CAMERA_TARGET_Y = 1.4;

function getCameraDistance(arrayLength) {
  return Math.max(7, arrayLength * 1.35 + 4);
}

function CameraController({ arrayLength, resetToken, controlsRef }) {
  const { camera } = useThree();
  const distance = getCameraDistance(arrayLength);
  const cameraHeight = Math.max(2.8, Math.min(5.2, distance * 0.32));

  useEffect(() => {
    camera.position.set(0, cameraHeight, distance);
    camera.lookAt(0, CAMERA_TARGET_Y, 0);
    camera.updateProjectionMatrix();
    controlsRef.current?.target.set(0, CAMERA_TARGET_Y, 0);
    controlsRef.current?.update();
  }, [camera, cameraHeight, controlsRef, distance, resetToken]);

  return null;
}

export default function Array3DVisualizer({ array = [], currentStep, currentStepIndex = -1 }) {
  const values = currentStep?.array?.length ? currentStep.array : array;
  const [resetToken, setResetToken] = useState(0);
  const controlsRef = useRef();
  const visualizationState = {
    values,
    activeIndices: currentStep?.indices ?? [],
    comparedIndices: currentStep?.type === "compare" ? currentStep.indices ?? [] : [],
    swappedIndices: currentStep?.type === "swap" ? currentStep.indices ?? [] : [],
    sortedIndices: currentStep?.finalizedIndices ?? [],
    operation: currentStep?.type ?? null,
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#15191d]" aria-label="التصور ثلاثي الأبعاد للمصفوفة">
      <Canvas shadows camera={{ position: [0, 5.5, 7.5], fov: CAMERA_FOV }} dpr={[1, 1.5]}>
        <color attach="background" args={["#15191d"]} />
        <fog attach="fog" args={["#15191d", 9, 18]} />
        <CameraController arrayLength={values.length} resetToken={resetToken} controlsRef={controlsRef} />
        <Array3DScene values={values} visualizationState={visualizationState} stepIndex={currentStepIndex} />
        <OrbitControls ref={controlsRef} enablePan minDistance={4} maxDistance={32} maxPolarAngle={Math.PI / 2.1} target={[0, CAMERA_TARGET_Y, 0]} />
      </Canvas>
      <button type="button" onClick={() => setResetToken((token) => token + 1)} className="absolute left-3 top-3 z-10 flex h-7 items-center gap-1.5 border border-border-subtle bg-bg-panel/90 px-2 text-[11px] text-text-secondary shadow-lg backdrop-blur-sm hover:bg-bg-hover hover:text-text-primary" aria-label="إعادة ضبط العرض">
        <RotateCcw className="h-3 w-3" />
        إعادة ضبط العرض
      </button>
    </div>
  );
}
