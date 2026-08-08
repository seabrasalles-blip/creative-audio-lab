import { mara, type MaraPose } from "@/data/assets";

export function Character({
  pose,
  height = 300,
  className,
}: {
  pose: MaraPose;
  height?: number;
  className?: string;
}) {
  return (
    <img
      src={mara[pose]}
      alt="Mara, a tartaruga que conduz a atividade"
      style={{ height }}
      className={`pointer-events-none w-auto select-none object-contain ${className ?? ""}`}
      draggable={false}
    />
  );
}
