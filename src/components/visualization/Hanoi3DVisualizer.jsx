import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Hanoi3DScene, { getHanoiFootprint } from "./Hanoi3DScene";

const CAMERA_FOV = 42;

function CameraController({ controlsRef, resetToken }) {
  const { camera } = useThree();
  const { width } = getHanoiFootprint();
  const distance = Math.max(6, width * 1.15);

  useEffect(() => {
    camera.position.set(distance * 0.55, 3.2, distance * 0.75);
    camera.lookAt(0, 1, 0);
    camera.updateProjectionMatrix();
    controlsRef.current?.target.set(0, 1, 0);
    controlsRef.current?.update();
  }, [camera, controlsRef, distance, resetToken]);

  return null;
}

/**
 * 3D counterpart to HanoiVisualizer, reusing the shared Array3D primitives.
 * The Canvas always mounts (even before towers exist) so onCanvasReady
 * fires deterministically for video recording, matching the pattern used
 * by the recursion 3D visualizers.
 */
export default function Hanoi3DVisualizer({ currentStep, onCanvasReady }) {
  const metadata = currentStep?.metadata;
  const towers = metadata?.towers ?? null;
  const [resetToken, setResetToken] = useState(0);
  const controlsRef = useRef();

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#15191d]" aria-label="التصور ثلاثي الأبعاد لأبراج هانوي">
      <Canvas shadows camera={{ position: [6, 4, 7], fov: CAMERA_FOV }} dpr={[1, 1.5]} onCreated={({ gl }) => onCanvasReady?.(gl.domElement)}>
        <color attach="background" args={["#15191d"]} />
        <fog attach="fog" args={["#15191d", 10, 22]} />
        <CameraController controlsRef={controlsRef} resetToken={resetToken} />
        <Hanoi3DScene
          towers={towers}
          currentDisk={metadata?.disk ?? null}
          from={metadata?.from ?? null}
          to={metadata?.to ?? null}
          auxiliary={metadata?.auxiliary ?? null}
        />
        <OrbitControls ref={controlsRef} enablePan minDistance={4} maxDistance={32} maxPolarAngle={Math.PI / 2.1} />
      </Canvas>
      {!towers && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-text-muted">
          اضغط تشغيل لبدء نقل الأقراص بين الأعمدة
        </div>
      )}
      <button type="button" onClick={() => setResetToken((token) => token + 1)} className="absolute left-3 top-3 z-10 flex h-7 items-center gap-1.5 border border-border-subtle bg-bg-panel/90 px-2 text-[11px] text-text-secondary shadow-lg backdrop-blur-sm hover:bg-bg-hover hover:text-text-primary" aria-label="إعادة ضبط العرض">
        <RotateCcw className="h-3 w-3" />
        إعادة ضبط العرض
      </button>
    </div>
  );
}
