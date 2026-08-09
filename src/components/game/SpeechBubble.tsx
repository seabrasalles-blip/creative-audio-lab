import { AssetButton } from "@/components/game/AssetButton";

/** Balão simples: fundo creme, contorno azul-marinho, ponta pequena. */
export function SpeechBubble({
  text,
  onPlay,
  speaking,
  finished = false,
  width,
}: {
  text: string;
  onPlay: () => void;
  speaking: boolean;
  finished?: boolean;
  width?: number;
}) {
  return (
    <div className="flex w-full items-end gap-3" style={width ? { width } : undefined}>
      <div className="relative flex-1 rounded-[28px] border-4 border-[var(--navy)] bg-[var(--cream)] px-7 py-5 shadow-[0_4px_0_rgba(12,42,74,0.18)]">
        <p
          className="font-body text-[28px] font-medium text-[var(--navy)]"
          style={{ lineHeight: 1.4 }}
        >
          {text}
        </p>
        <span
          aria-hidden="true"
          className="absolute -bottom-[18px] left-12 h-0 w-0 border-t-[18px] border-r-[22px] border-l-0 border-t-[var(--navy)] border-r-transparent"
        />
      </div>
      <AssetButton
        asset="audio"
        width={72}
        onClick={onPlay}
        label={
          speaking
            ? "Interromper fala da Mara"
            : finished
              ? "Ouvir fala da Mara novamente"
              : "Ouvir fala da Mara"
        }
      />
    </div>
  );
}
