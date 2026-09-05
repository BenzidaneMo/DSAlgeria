const COLORS = {
  background: "#1e1e1e",
  panel: "#252526",
  border: "#3c3c3c",
  pending: "#2b3c4d",
  active: "#569cd6",
  base: "#c586c0",
  done: "#6a9955",
  text: "#d4d4d4",
  muted: "#969696",
  expression: "#ce9178",
};

export function renderRecursionFrame(canvas, step, { width, height } = {}) {
  const context = canvas.getContext("2d");
  const frameWidth = width ?? canvas.width;
  const frameHeight = height ?? canvas.height;
  const metadata = step?.metadata ?? {};
  const callStack = metadata.callStack ?? [];

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
  context.fillText("DSAlgeria · الاستدعاء الذاتي", frameWidth - 32, 36);
  context.fillStyle = COLORS.muted;
  context.font = "16px sans-serif";
  context.fillText(step?.message ?? "الخطوة الحالية", frameWidth - 32, 64);

  if (callStack.length === 0) {
    return;
  }

  const boxWidth = Math.min(340, frameWidth * 0.5);
  const boxHeight = 46;
  const gap = 14;
  const totalHeight = callStack.length * boxHeight + (callStack.length - 1) * gap;
  const startY = Math.max(110, (frameHeight - totalHeight) / 2 + 40);
  const centerX = frameWidth / 2;

  if (metadata.expression) {
    context.direction = "ltr";
    context.textAlign = "center";
    context.fillStyle = COLORS.expression;
    context.font = "600 22px monospace";
    context.fillText(metadata.expression, centerX, startY - 26);
  }

  callStack.forEach((frame, index) => {
    const y = startY + index * (boxHeight + gap);
    const isCurrent = frame.depth === metadata.depth;
    const color = frame.status === "pending"
      ? COLORS.pending
      : frame.status === "base"
        ? COLORS.base
        : isCurrent
          ? COLORS.active
          : frame.status === "done"
            ? COLORS.done
            : COLORS.pending;

    context.globalAlpha = frame.status === "pending" ? 0.45 : 1;
    context.fillStyle = color;
    context.fillRect(centerX - boxWidth / 2, y, boxWidth, boxHeight);
    context.strokeStyle = COLORS.border;
    context.strokeRect(centerX - boxWidth / 2, y, boxWidth, boxHeight);
    context.globalAlpha = 1;

    context.direction = "ltr";
    context.textAlign = "center";
    context.fillStyle = COLORS.text;
    context.font = "600 16px monospace";
    context.fillText(`factorial(${frame.n})`, centerX - boxWidth / 4, y + boxHeight / 2 + 6);

    if (frame.result !== null && frame.result !== undefined) {
      context.fillStyle = COLORS.done;
      context.font = "600 16px monospace";
      context.fillText(`= ${frame.result}`, centerX + boxWidth / 4, y + boxHeight / 2 + 6);
    }

    if (index < callStack.length - 1) {
      context.strokeStyle = COLORS.muted;
      context.beginPath();
      context.moveTo(centerX, y + boxHeight);
      context.lineTo(centerX, y + boxHeight + gap);
      context.stroke();
    }
  });
}
