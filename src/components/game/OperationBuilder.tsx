import { cn } from "@/lib/utils";
import type { RepChoice, RepRole, Representation } from "@/types/game";

type Props = {
  representation: Representation;
  /** ordem estável já embaralhada; cai para representation.choices se ausente */
  choices?: RepChoice[];
  filled: Partial<Record<RepRole, number>>;
  activeBlank: RepRole | null;
  onChoose: (choice: RepChoice) => void;
  compact?: boolean;
};

const roleLabel: Record<RepRole, string> = {
  initial: "quantos havia",
  removed: "quantos saíram",
  result: "quantos ficaram",
};

/**
 * Representação simbólica da subtração: [__] − [__] = [__].
 * Interação apenas por clique; a lacuna ativa é destacada por contorno.
 */
export function OperationBuilder({
  representation,
  choices,
  filled,
  activeBlank,
  onChoose,
  compact = false,
}: Props) {
  const numbers = choices ?? representation.choices;
  const value = (role: RepRole) =>
    representation.blanks.includes(role) ? (filled[role] ?? null) : representation[role];

  const numberSize = compact ? 42 : 50;

  const Slot = ({ role }: { role: RepRole }) => {
    const v = value(role);
    const isActive = activeBlank === role;
    return (
      <span
        aria-label={`Número que mostra ${roleLabel[role]}${v === null ? ": lacuna" : `: ${v}`}`}
        className={cn(
          "inline-flex items-center justify-center rounded-2xl bg-[var(--cream)] tabular-nums",
          "border-4 border-[var(--navy)] text-[var(--navy)] font-display font-bold",
          v === null && "border-dashed",
        )}
        style={{
          boxSizing: "border-box",
          minWidth: compact ? 92 : 108,
          height: compact ? 66 : 78,
          fontSize: numberSize,
          fontVariantNumeric: "tabular-nums",
          // destaque sem alterar a geometria da lacuna ativa
          outline: isActive ? "6px solid var(--navy)" : undefined,
          outlineOffset: isActive ? "3px" : undefined,
        }}
      >
        {v === null ? "" : v}
      </span>
    );
  };

  const Symbol = ({ children }: { children: string }) => (
    <span
      className="font-display font-bold text-[var(--navy)]"
      style={{ fontSize: numberSize }}
      aria-hidden="true"
    >
      {children}
    </span>
  );

  return (
    <div className={cn("flex flex-col items-center", compact ? "gap-3" : "gap-4")}>
      <div className={cn("flex items-center", compact ? "gap-3" : "gap-4")}>
        <Slot role="initial" />
        <Symbol>−</Symbol>
        <Slot role="removed" />
        <Symbol>=</Symbol>
        <Slot role="result" />
      </div>

      {activeBlank && numbers.length > 0 && (
        <div className={cn("flex items-center justify-center", compact ? "gap-3" : "gap-4")}>
          {numbers.map((choice) => (
            <button
              key={choice.id}
              type="button"
              onClick={() => onChoose(choice)}
              aria-label={`Usar o número ${choice.value}`}
              className={cn(
                "cursor-pointer rounded-[26px] border-4 border-[var(--navy)] bg-[var(--cream)]",
                "font-display font-bold text-[var(--navy)] shadow-[0_3px_0_rgba(12,42,74,0.2)]",
                "transition-transform duration-150 hover:scale-[1.03] active:scale-[0.97]",
                "focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--navy)]",
              )}
              style={{
                minWidth: compact ? 96 : 116,
                height: compact ? 72 : 86,
                fontSize: compact ? 38 : 44,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {choice.value}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
