import { cn } from "@/lib/utils";

type Props = {
  options: number[];
  selected: number | null;
  correctAnswer: number;
  solved: boolean;
  onSelect: (value: number) => void;
};

/** Alternativas numéricas grandes, integradas ao cenário. */
export function AnswerOptions({ options, selected, correctAnswer, solved, onSelect }: Props) {
  return (
    <div className="flex items-center justify-center gap-5" style={{ zIndex: 40 }}>
      {options.map((value) => {
        const isChosen = selected === value;
        const isRight = solved && value === correctAnswer;
        const isWrongChoice = isChosen && !solved;
        return (
          <button
            key={value}
            type="button"
            disabled={solved}
            onClick={() => onSelect(value)}
            aria-label={`Responder ${value}`}
            className={cn(
              "flex h-[108px] min-w-[132px] cursor-pointer items-center justify-center gap-2 rounded-[32px] border-4 bg-[var(--cream)] px-8",
              "font-display text-[52px] font-bold text-[var(--navy)] transition-transform duration-150",
              "shadow-[0_3px_0_rgba(12,42,74,0.2)] hover:scale-[1.03] active:scale-[0.97]",
              "focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--navy)]",
              "disabled:cursor-default disabled:hover:scale-100",
              isRight
                ? "border-[var(--leaf)] border-8"
                : isWrongChoice
                  ? "border-[var(--sand-deep)] border-dashed"
                  : "border-[var(--navy)]",
            )}
          >
            <span style={{ fontVariantNumeric: "tabular-nums" }}>{value}</span>
            {isRight && (
              <span aria-hidden="true" className="text-[40px] text-[var(--leaf)]">
                ✓
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
