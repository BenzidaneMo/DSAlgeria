import { DIFFICULTY_STYLES } from "../../data/algorithmDifficulty";

export default function DifficultyBadge({ level, className = "" }) {
  if (!level) return null;

  return (
    <span className={`inline-flex w-fit items-center border px-1.5 py-0.5 font-mono text-[9px] leading-none ${DIFFICULTY_STYLES[level] ?? "border-border-subtle text-text-muted"} ${className}`}>
      {level}
    </span>
  );
}
