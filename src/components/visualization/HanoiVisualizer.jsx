import { Layers } from "lucide-react";

const TOWER_IDS = ["A", "B", "C"];
const TOWER_LABELS = { A: "A", B: "B", C: "C" };

const TOWER_SPACING = 190;
const PEG_HEIGHT = 168;
const BASE_HEIGHT = 12;
const DISK_HEIGHT = 20;
const DISK_GAP = 3;
const MIN_DISK_WIDTH = 46;
const MAX_DISK_WIDTH = 160;

const DISK_COLORS = ["#569cd6", "#4ec9b0", "#c586c0", "#ce9178", "#dcdcaa", "#6a9955", "#f44747"];

function diskWidth(disk, totalDisks) {
  if (totalDisks <= 1) return MAX_DISK_WIDTH;
  const ratio = (disk - 1) / (totalDisks - 1);
  return MIN_DISK_WIDTH + ratio * (MAX_DISK_WIDTH - MIN_DISK_WIDTH);
}

function towerCenterX(towerIndex) {
  return TOWER_SPACING * towerIndex + TOWER_SPACING / 2;
}

function computeDiskPositions(towers) {
  const positions = {};
  TOWER_IDS.forEach((towerId, towerIndex) => {
    towers[towerId].forEach((disk, heightIndex) => {
      positions[disk] = { towerIndex, heightIndex };
    });
  });
  return positions;
}

/**
 * Reusable Tower of Hanoi visualization: every disk 1..n is always mounted
 * (never remounted between steps), so moving a disk between towers is a
 * plain CSS transition on its computed position rather than a re-render
 * that would jump instantly.
 */
export default function HanoiVisualizer({ currentStep }) {
  const metadata = currentStep?.metadata;
  const towers = metadata?.towers;

  if (!towers) {
    return (
      <div className="flex flex-col items-center gap-3 text-center text-text-muted">
        <Layers className="h-10 w-10" strokeWidth={1.2} />
        <p className="text-xs">اضغط تشغيل لبدء نقل الأقراص بين الأعمدة</p>
      </div>
    );
  }

  const totalDisks = TOWER_IDS.reduce((sum, towerId) => sum + towers[towerId].length, 0);
  const positions = computeDiskPositions(towers);
  const containerWidth = TOWER_SPACING * TOWER_IDS.length;
  const containerHeight = PEG_HEIGHT + BASE_HEIGHT + 34;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 overflow-auto py-2">
      {metadata.phase === "calling" && (
        <div className="max-w-lg border border-accent-blue/50 bg-accent-blue/10 px-4 py-2 text-center text-xs text-accent-blue">
          {currentStep.message}
        </div>
      )}
      {metadata.phase === "complete" && (
        <div className="border border-accent-green/50 bg-accent-green/10 px-4 py-2 text-center font-mono text-sm font-semibold text-accent-green">
          {currentStep.message}
        </div>
      )}

      <div className="relative" style={{ width: containerWidth, height: containerHeight }} role="img" aria-label="أبراج هانوي">
        <div className="absolute bottom-0 bg-[#3c3c3c]" style={{ left: 0, width: containerWidth, height: BASE_HEIGHT }} />

        {TOWER_IDS.map((towerId, towerIndex) => {
          const isSource = metadata.from === towerId;
          const isTarget = metadata.to === towerId;
          const isAuxiliary = metadata.auxiliary === towerId;
          const pegColor = isSource ? "#569cd6" : isTarget ? "#6a9955" : isAuxiliary ? "#c586c0" : "#5a5a5c";

          return (
            <div key={towerId}>
              <div
                className="absolute rounded-t-sm transition-colors duration-300"
                style={{
                  left: towerCenterX(towerIndex) - 2,
                  bottom: BASE_HEIGHT,
                  width: 4,
                  height: PEG_HEIGHT,
                  backgroundColor: pegColor,
                }}
              />
              <div
                className="absolute text-center font-mono text-[11px] text-text-muted"
                style={{ left: towerCenterX(towerIndex) - 40, width: 80, bottom: 0 }}
              >
                {TOWER_LABELS[towerId]}
                {isSource && <span className="ms-1 text-accent-blue">مصدر</span>}
                {isTarget && <span className="ms-1 text-accent-green">هدف</span>}
                {isAuxiliary && <span className="ms-1 text-accent-purple">مساعد</span>}
              </div>
            </div>
          );
        })}

        {Array.from({ length: totalDisks }, (_, index) => totalDisks - index).map((disk) => {
          const position = positions[disk];
          if (!position) return null;
          const width = diskWidth(disk, totalDisks);
          const isMoving = metadata.disk === disk;

          return (
            <div
              key={disk}
              className={`absolute rounded-sm border font-mono text-[11px] font-semibold text-[#15191d] transition-[left,bottom] duration-500 ease-out ${isMoving ? "border-white shadow-lg shadow-black/40" : "border-[#15191d]/30"}`}
              style={{
                left: towerCenterX(position.towerIndex) - width / 2,
                bottom: BASE_HEIGHT + position.heightIndex * (DISK_HEIGHT + DISK_GAP),
                width,
                height: DISK_HEIGHT,
                backgroundColor: DISK_COLORS[(disk - 1) % DISK_COLORS.length],
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {disk}
            </div>
          );
        })}
      </div>
    </div>
  );
}
