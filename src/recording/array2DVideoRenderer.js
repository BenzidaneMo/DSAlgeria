const COLORS = {
  background: "#1e1e1e",
  panel: "#252526",
  border: "#3c3c3c",
  passive: "#3c6385",
  compared: "#569cd6",
  swapped: "#ce9178",
  sorted: "#6a9955",
  text: "#d4d4d4",
  muted: "#969696",
};

export function renderArray2DFrame(canvas, step, { width, height } = {}) {
  const context = canvas.getContext("2d");
  const values = step?.array ?? [];
  const frameWidth = width ?? canvas.width;
  const frameHeight = height ?? canvas.height;
  const activeIndices = step?.indices ?? [];
  const sortedIndices = step?.finalizedIndices ?? [];
  const swappedIndices = step?.type === "swap" ? activeIndices : [];

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
  context.fillStyle = COLORS.text;
  context.font = "600 24px sans-serif";
  context.fillText("DSAlgeria · تصور المصفوفة", frameWidth - 32, 36);
  context.fillStyle = COLORS.muted;
  context.font = "16px sans-serif";
  context.fillText(step?.message ?? "الخطوة الحالية", frameWidth - 32, 64);

  if (values.length === 0) {
    return;
  }

  const maxValue = Math.max(...values, 1);
  const minValue = Math.min(...values, 0);
  const chartTop = 130;
  const chartBottom = frameHeight - 72;
  const chartHeight = chartBottom - chartTop;
  const gap = Math.min(18, frameWidth / (values.length * 4));
  const barWidth = Math.min(90, (frameWidth - 96 - gap * (values.length - 1)) / values.length);
  const startX = (frameWidth - (barWidth * values.length + gap * (values.length - 1))) / 2;
  const range = maxValue - minValue || 1;

  values.forEach((value, index) => {
    const normalized = (value - minValue) / range;
    const barHeight = 44 + normalized * (chartHeight - 44);
    const x = startX + index * (barWidth + gap);
    const y = chartBottom - barHeight;
    const color = sortedIndices.includes(index)
      ? COLORS.sorted
      : swappedIndices.includes(index)
        ? COLORS.swapped
        : activeIndices.includes(index)
          ? COLORS.compared
          : COLORS.passive;

    context.fillStyle = color;
    context.fillRect(x, y, barWidth, barHeight);
    context.strokeStyle = COLORS.border;
    context.strokeRect(x, y, barWidth, barHeight);
    context.fillStyle = COLORS.text;
    context.font = "600 18px monospace";
    context.textAlign = "center";
    context.direction = "ltr";
    context.fillText(String(value), x + barWidth / 2, y - 12);
    context.fillStyle = COLORS.muted;
    context.font = "14px monospace";
    context.fillText(String(index), x + barWidth / 2, chartBottom + 26);
  });

  context.strokeStyle = COLORS.border;
  context.beginPath();
  context.moveTo(startX - 18, chartBottom + 1);
  context.lineTo(startX + values.length * barWidth + (values.length - 1) * gap + 18, chartBottom + 1);
  context.stroke();
}
