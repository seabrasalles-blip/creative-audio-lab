export function ProgressIndicator({ current, total }: { current: number; total: number }) {
  return (
    <p
      className="font-display text-[22px] font-semibold text-[var(--navy)]"
      style={{ letterSpacing: "0.02em" }}
    >
      Desafio {current} de {total}
    </p>
  );
}
