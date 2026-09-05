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
  const callTree = metadata.callTree ?? null;

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

  if (callTree) {
    if (callTree.length === 0) {
      return;
    }
    renderCallTree(context, callTree, metadata, frameWidth, frameHeight);
    return;
  }

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

function renderCallTree(context, callTree, metadata, frameWidth, frameHeight) {
  const maxDepth = Math.max(...callTree.map((node) => node.depth));
  const maxX = Math.max(...callTree.map((node) => node.x));
  const marginTop = 130;
  const marginBottom = 40;
  const xUnit = (frameWidth - 80) / (maxX + 2);
  const yUnit = Math.min(100, (frameHeight - marginTop - marginBottom) / (maxDepth + 1));
  const boxW = Math.min(88, xUnit * 0.82);
  const boxH = 40;
  const byId = new Map(callTree.map((node) => [node.id, node]));

  function toScreen(node) {
    return { cx: 40 + (node.x + 1) * xUnit, cy: marginTop + node.depth * yUnit };
  }

  context.strokeStyle = COLORS.border;
  context.lineWidth = 1.5;
  callTree.forEach((node) => {
    if (!node.parentId) return;
    const parent = byId.get(node.parentId);
    if (!parent) return;
    const a = toScreen(parent);
    const b = toScreen(node);
    context.beginPath();
    context.moveTo(a.cx, a.cy + boxH / 2);
    context.lineTo(b.cx, b.cy - boxH / 2);
    context.stroke();
  });

  callTree.forEach((node) => {
    const { cx, cy } = toScreen(node);
    const isCurrent = node.id === metadata.nodeId;
    const color = node.status === "pending"
      ? COLORS.pending
      : node.status === "base"
        ? COLORS.base
        : isCurrent
          ? COLORS.active
          : node.status === "done"
            ? COLORS.done
            : COLORS.pending;

    context.globalAlpha = node.status === "pending" ? 0.45 : 1;
    context.fillStyle = color;
    context.fillRect(cx - boxW / 2, cy - boxH / 2, boxW, boxH);
    context.strokeStyle = COLORS.border;
    context.lineWidth = isCurrent ? 2.5 : 1;
    context.strokeRect(cx - boxW / 2, cy - boxH / 2, boxW, boxH);
    context.globalAlpha = 1;

    context.direction = "ltr";
    context.textAlign = "center";
    context.fillStyle = COLORS.text;
    context.font = "600 13px monospace";
    context.fillText(`f(${node.n})`, cx, cy - 2);

    if (node.result !== null && node.result !== undefined) {
      context.fillStyle = COLORS.done;
      context.font = "600 12px monospace";
      context.fillText(`= ${node.result}`, cx, cy + 13);
    }
  });
}
