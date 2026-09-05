import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Recursion3DScene, { getRecursionTowerHeight } from "./Recursion3DScene";

const CAMERA_FOV = 42;

function CameraController({ frameCount, controlsRef, resetToken }) {
  const { camera } = useThree();
  const towerHeight = getRecursionTowerHeight(frameCount);
  const distance = Math.max(6, Math.min(14, frameCount * 1.4 + 4));

  useEffect(() => {
    camera.position.set(distance * 0.7, towerHeight * 0.65 + 1.5, distance * 0.7);
    camera.lookAt(0, towerHeight / 2, 0);
    camera.updateProjectionMatrix();
    controlsRef.current?.target.set(0, towerHeight / 2, 0);
    controlsRef.current?.update();
  }, [camera, controlsRef, distance, towerHeight, resetToken]);

  return null;
}

export default function Recursion3DVisualizer({ currentStep, onCanvasReady }) {
  const callStack = currentStep?.metadata?.callStack ?? [];
  const currentDepth = currentStep?.metadata?.depth ?? null;
  const [resetToken, setResetToken] = useState(0);
  const controlsRef = useRef();

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#15191d]" aria-label="التصور ثلاثي الأبعاد للاستدعاء الذاتي">
      <Canvas shadows camera={{ position: [6, 5, 6], fov: CAMERA_FOV }} dpr={[1, 1.5]} onCreated={({ gl }) => onCanvasReady?.(gl.domElement)}>
        <color attach="background" args={["#15191d"]} />
        <fog attach="fog" args={["#15191d", 10, 22]} />
        <CameraController frameCount={callStack.length} controlsRef={controlsRef} resetToken={resetToken} />
        <Recursion3DScene callStack={callStack} currentDepth={currentDepth} />
        <OrbitControls ref={controlsRef} enablePan minDistance={4} maxDistance={32} maxPolarAngle={Math.PI / 2.1} />
      </Canvas>
      {callStack.length === 0 && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-text-muted">
          اضغط تشغيل لبدء تتبع الاستدعاء الذاتي
        </div>
      )}
      <button type="button" onClick={() => setResetToken((token) => token + 1)} className="absolute left-3 top-3 z-10 flex h-7 items-center gap-1.5 border border-border-subtle bg-bg-panel/90 px-2 text-[11px] text-text-secondary shadow-lg backdrop-blur-sm hover:bg-bg-hover hover:text-text-primary" aria-label="إعادة ضبط العرض">
        <RotateCcw className="h-3 w-3" />
        إعادة ضبط العرض
      </button>
    </div>
  );
}
