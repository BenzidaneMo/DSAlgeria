const COLORS = {
  background: "#1e1e1e",
  panel: "#252526",
  border: "#3c3c3c",
  peg: "#5a5a5c",
  source: "#569cd6",
  target: "#6a9955",
  auxiliary: "#c586c0",
  text: "#d4d4d4",
  muted: "#969696",
  base: "#3c3c3c",
};

const DISK_COLORS = ["#569cd6", "#4ec9b0", "#c586c0", "#ce9178", "#dcdcaa", "#6a9955", "#f44747"];

const TOWER_IDS = ["A", "B", "C"];

function diskWidth(disk, totalDisks, maxWidth) {
  const minWidth = maxWidth * 0.28;
  if (totalDisks <= 1) return maxWidth;
  const ratio = (disk - 1) / (totalDisks - 1);
  return minWidth + ratio * (maxWidth - minWidth);
}

export function renderHanoiFrame(canvas, step, { width, height } = {}) {
  const context = canvas.getContext("2d");
  const frameWidth = width ?? canvas.width;
  const frameHeight = height ?? canvas.height;
  const metadata = step?.metadata ?? {};
  const towers = metadata.towers ?? null;

  if (canvas.width !== frameWidth || canvas.height !== frameHeight) {
    canvas.width = frameWidth;
    canvas.height = frameHeight;
  }

  context.fillStyle = COLORS.background;
  context.fillRect(0, 0, frameWidth, frameHeight);

  context.fillStyle = COLORS.panel;
  context.fillRect(0, 0, frameWidth, 86);
  context.strokeStyle = COLORS.border;
  context.beginPath();
  context.moveTo(0, 85);
  context.lineTo(frameWidth, 85);
  context.stroke();

  context.direction = "rtl";
  context.textAlign = "right";
  context.fillStyle = COLORS.text;
  context.font = "600 24px sans-serif";
  context.fillText("DSAlgeria · أبراج هانوي", frameWidth - 32, 36);
  context.fillStyle = COLORS.muted;
  context.font = "16px sans-serif";
  context.fillText(step?.message ?? "الخطوة الحالية", frameWidth - 32, 64);

  if (!towers) {
    return;
  }

  const totalDisks = TOWER_IDS.reduce((sum, towerId) => sum + towers[towerId].length, 0);
  const marginTop = 130;
  const marginBottom = 70;
  const towerSpacing = (frameWidth - 160) / TOWER_IDS.length;
  const pegHeight = frameHeight - marginTop - marginBottom;
  const baseY = frameHeight - marginBottom;
  const maxDiskWidth = Math.min(180, towerSpacing * 0.8);
  const diskHeight = Math.max(14, Math.min(26, pegHeight / (totalDisks + 2)));
  const diskGap = 3;

  function towerCenterX(towerIndex) {
    return 80 + towerSpacing * towerIndex + towerSpacing / 2;
  }

  context.fillStyle = COLORS.base;
  context.fillRect(80, baseY, towerSpacing * TOWER_IDS.length, 8);

  TOWER_IDS.forEach((towerId, towerIndex) => {
    const cx = towerCenterX(towerIndex);
    const pegColor = metadata.from === towerId
      ? COLORS.source
      : metadata.to === towerId
        ? COLORS.target
        : metadata.auxiliary === towerId
          ? COLORS.auxiliary
          : COLORS.peg;

    context.fillStyle = pegColor;
    context.fillRect(cx - 3, baseY - pegHeight, 6, pegHeight);

    context.direction = "ltr";
    context.textAlign = "center";
    context.fillStyle = COLORS.muted;
    context.font = "600 15px monospace";
    context.fillText(towerId, cx, baseY + 32);
  });

  const positions = {};
  TOWER_IDS.forEach((towerId, towerIndex) => {
    towers[towerId].forEach((disk, heightIndex) => {
      positions[disk] = { towerIndex, heightIndex };
    });
  });

  Array.from({ length: totalDisks }, (_, index) => totalDisks - index).forEach((disk) => {
    const position = positions[disk];
    if (!position) return;
    const w = diskWidth(disk, totalDisks, maxDiskWidth);
    const cx = towerCenterX(position.towerIndex);
    const y = baseY - 8 - (position.heightIndex + 1) * (diskHeight + diskGap);
    const isCurrent = metadata.disk === disk;

    context.fillStyle = DISK_COLORS[(disk - 1) % DISK_COLORS.length];
    context.fillRect(cx - w / 2, y, w, diskHeight);
    context.strokeStyle = isCurrent ? "#ffffff" : COLORS.border;
    context.lineWidth = isCurrent ? 2.5 : 1;
    context.strokeRect(cx - w / 2, y, w, diskHeight);

    context.direction = "ltr";
    context.textAlign = "center";
    context.fillStyle = "#15191d";
    context.font = "600 12px monospace";
    context.fillText(String(disk), cx, y + diskHeight / 2 + 4);
  });
}
