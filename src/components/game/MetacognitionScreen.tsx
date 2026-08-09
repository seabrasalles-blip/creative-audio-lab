import { useMemo } from "react";

import { AssetButton } from "@/components/game/AssetButton";
import { Character } from "@/components/game/Character";
import type { MetaQuestion, Speech } from "@/types/game";

/** Posição da alternativa correta em cada questão (0-based), balanceada. */
const correctPosition: Record<string, number> = {
  m1: 1,
  m2: 2,
  "m-rep": 0,
  m3: 2,
};

/**
 * Composição exclusiva da metacognição (canvas lógico 1200 × 675).
 *
 * METACOGNITION_LEFT_ZONE  x: 30 – 640   (Mara + balão + áudio)
 * METACOGNITION_RIGHT_ZONE x: 670 – 1160 (alternativas)
 * NAVIGATION_ZONE          canto inferior direito, abaixo das alternativas
 *
 * As zonas não se intersectam geometricamente (não há correção por z-index).
 */
export function MetacognitionScreen({
  meta,
  answered,
  wrong,
  speech,
  speaking,
  finished,
  onAnswer,
  onPlay,
  onNext,
}: {
  meta: MetaQuestion;
  answered: boolean;
  wrong: boolean;
  speech: Speech;
  speaking: boolean;
  finished: boolean;
  onAnswer: (correct: boolean) => void;
  onPlay: () => void;
  onNext: () => void;
}) {
  // Posições balanceadas, definidas uma única vez por questão: a alternativa correta
  // muda de lugar entre as questões e permanece estável durante tentativas e erros.
  const options = useMemo(() => {
    const target = correctPosition[meta.id] ?? 1;
    const correct = meta.options.filter((o) => o.correct);
    const others = meta.options.filter((o) => !o.correct);
    const out = [...others];
    out.splice(Math.min(target, out.length), 0, ...correct);
    return out;
  }, [meta.id, meta.options]);

  return (
    <>
      {/* ZONA ESQUERDA — balão com a pergunta (é o próprio enunciado) */}
      <div className="absolute" style={{ zIndex: 30, left: 200, top: 175, width: 440 }}>
        <div className="relative rounded-[28px] border-4 border-[var(--navy)] bg-[var(--cream)] px-7 py-5 shadow-[0_4px_0_rgba(12,42,74,0.18)]">
          <p
            className="font-body text-[28px] font-medium text-[var(--navy)]"
            style={{ lineHeight: 1.4 }}
          >
            {speech.text}
          </p>
          <span
            aria-hidden="true"
            className="absolute -bottom-[18px] left-12 h-0 w-0 border-t-[18px] border-r-[22px] border-l-0 border-t-[var(--navy)] border-r-transparent"
          />
        </div>
        {/* Áudio ancorado ao canto inferior direito do balão */}
        <div className="mt-3 flex justify-end">
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
      </div>

      {/* ZONA ESQUERDA — Mara */}
      <div className="absolute" style={{ zIndex: 20, left: 30, bottom: 15 }}>
        <Character pose={answered ? "celebrating" : "thinking"} height={245} />
      </div>

      {/* ZONA DIREITA — alternativas */}
      <div
        className="absolute flex flex-col"
        style={{ zIndex: 40, right: 40, top: 150, width: 490, gap: 20 }}
        role="group"
        aria-label="Alternativas"
      >
        {options.map((option) => {
          const isCorrect = answered && option.correct;
          return (
            <button
              key={option.label}
              type="button"
              disabled={answered}
              onClick={() => onAnswer(option.correct)}
              aria-label={`Responder: ${option.label}`}
              className="flex min-h-[88px] cursor-pointer items-center gap-3 rounded-[28px] border-4 border-[var(--navy)] bg-[var(--cream)] px-8 py-4 text-left font-body text-[27px] font-medium text-[var(--navy)] shadow-[0_3px_0_rgba(12,42,74,0.2)] transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--navy)] disabled:cursor-default disabled:hover:scale-100"
              style={{
                lineHeight: 1.3,
                height: "auto",
                ...(isCorrect
                  ? {
                      outline: "6px solid var(--navy)",
                      outlineOffset: "-2px",
                      boxSizing: "border-box" as const,
                    }
                  : {}),
              }}
            >
              {isCorrect && (
                <span aria-hidden="true" className="font-display text-[30px] font-bold">
                  ✓
                </span>
              )}
              <span>{option.label}</span>
              {isCorrect && <span className="sr-only">Resposta correta</span>}
            </button>
          );
        })}
        {wrong && !answered && (
          <p className="sr-only" aria-live="polite">
            Vamos pensar novamente.
          </p>
        )}
      </div>

      {/* NAVIGATION_ZONE */}
      {answered && (
        <div className="absolute animate-scale-in" style={{ zIndex: 50, right: 35, bottom: 20 }}>
          <AssetButton
            asset="next"
            width={190}
            label="Seguir para a próxima tela"
            onClick={onNext}
          />
        </div>
      )}
    </>
  );
}
