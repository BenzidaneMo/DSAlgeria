const NODE_STYLES = {
  pending: { stroke: "#3c3c3c", fill: "#1e1e1e", text: "#6b7280" },
  calling: { stroke: "#569cd6", fill: "rgba(86,156,214,0.14)", text: "#569cd6" },
  base: { stroke: "#c586c0", fill: "rgba(197,134,192,0.14)", text: "#c586c0" },
  done: { stroke: "#6a9955", fill: "rgba(106,153,85,0.12)", text: "#d4d4d4" },
};

const X_UNIT = 84;
const Y_UNIT = 76;
const BOX_W = 62;
const BOX_H = 34;

/**
 * Reusable node-link diagram for a recursive call tree (as opposed to the
 * linear call-stack used by algorithms like Factorial). Layout is derived
 * purely from each node's precomputed `x`/`depth`, so the tree never shifts
 * as `status`/`result` change from step to step.
 */
export default function RecursionTree({ nodes = [], currentNodeId }) {
  if (nodes.length === 0) {
    return null;
  }

  const maxDepth = Math.max(...nodes.map((node) => node.depth));
  const maxX = Math.max(...nodes.map((node) => node.x));
  const width = (maxX + 1.5) * X_UNIT;
  const height = (maxDepth + 1) * Y_UNIT + BOX_H;
  const byId = new Map(nodes.map((node) => [node.id, node]));

  function toScreen(node) {
    return { cx: (node.x + 0.75) * X_UNIT, cy: node.depth * Y_UNIT + BOX_H / 2 + 8 };
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} className="max-w-full" role="img" aria-label="شجرة الاستدعاءات الذاتية">
      {nodes.map((node) => {
        if (!node.parentId) return null;
        const parent = byId.get(node.parentId);
        if (!parent) return null;
        const a = toScreen(parent);
        const b = toScreen(node);
        return <line key={`edge-${node.id}`} x1={a.cx} y1={a.cy + BOX_H / 2} x2={b.cx} y2={b.cy - BOX_H / 2} stroke="#3c3c3c" strokeWidth={1.5} />;
      })}
      {nodes.map((node) => {
        const { cx, cy } = toScreen(node);
        const style = NODE_STYLES[node.status] ?? NODE_STYLES.pending;
        const isCurrent = node.id === currentNodeId;

        return (
          <g key={node.id} transform={`translate(${cx - BOX_W / 2}, ${cy - BOX_H / 2})`}>
            <rect width={BOX_W} height={BOX_H} rx={4} fill={style.fill} stroke={style.stroke} strokeWidth={isCurrent ? 2.5 : 1.4} />
            <text x={BOX_W / 2} y={BOX_H / 2 - 3} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={style.text}>{`f(${node.n})`}</text>
            {node.result !== null && (
              <text x={BOX_W / 2} y={BOX_H / 2 + 11} textAnchor="middle" fontSize={10} fontFamily="monospace" fill="#6a9955">{`= ${node.result}`}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
