import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { AnswerOptions } from "@/components/game/AnswerOptions";
import { AssetButton } from "@/components/game/AssetButton";
import { Character } from "@/components/game/Character";
import { FishScene } from "@/components/game/FishScene";
import { GameCanvas } from "@/components/game/GameCanvas";
import { OperationBuilder } from "@/components/game/OperationBuilder";
import { ProgressIndicator } from "@/components/game/ProgressIndicator";
import { SceneDecor } from "@/components/game/SceneDecor";
import { SpeechBubble } from "@/components/game/SpeechBubble";
import { preloadList, type BackgroundKey, type MaraPose } from "@/data/assets";
import { scoredChallenges } from "@/data/challenges";
import { flow } from "@/data/flow";
import { useAssetPreload } from "@/hooks/useAssetPreload";
import { useMaraVoice } from "@/hooks/useMaraVoice";
import type { Phase, RepRole, Speech } from "@/types/game";

const TOTAL_CHALLENGES = scoredChallenges.length;

export function GameScreen() {
  const ready = useAssetPreload(preloadList);
  const { speak, stop, speaking, finished } = useMaraVoice();

  const [stepIndex, setStepIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("observe");
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [attemptsByQuestion, setAttemptsByQuestion] = useState<Record<string, number>>({});
  const [hintVisible, setHintVisible] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [metaAnswered, setMetaAnswered] = useState(false);
  const [metaWrong, setMetaWrong] = useState(false);
  const [repFilled, setRepFilled] = useState<Partial<Record<RepRole, number>>>({});
  const [repFeedback, setRepFeedback] = useState<Speech | null>(null);

  const step = flow[stepIndex]!;
  const removeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const representTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Microetapa de representação simbólica (após o acerto). */
  const representation = step.kind === "challenge" ? step.challenge.representation : null;
  const activeBlank: RepRole | null =
    representation?.blanks.find((role) => repFilled[role] === undefined) ?? null;
  const repDone = representation !== null && activeBlank === null;

  const resetStepState = useCallback(() => {
    setPhase("observe");
    setSelectedAnswer(null);
    setAttempts(0);
    setHintVisible(false);
    setMetaAnswered(false);
    setMetaWrong(false);
    setRepFilled({});
    setRepFeedback(null);
    setAnimationKey((k) => k + 1);
  }, []);

  useEffect(
    () => () => {
      if (removeTimer.current) clearTimeout(removeTimer.current);
      if (representTimer.current) clearTimeout(representTimer.current);
    },
    [],
  );

  /** Fala atual: sempre visível em texto e sempre reproduzível em áudio. */
  const currentSpeech: Speech | null = useMemo(() => {
    switch (step.kind) {
      case "cover":
        return null;
      case "intro":
      case "transition":
      case "summary":
      case "final":
        return step.speech;
      case "meta":
        if (metaAnswered) return step.meta.correct;
        if (metaWrong) return step.meta.retry;
        return step.meta.question;
      case "challenge": {
        const c = step.challenge;
        if (phase === "represent") {
          return repFeedback ?? (repDone ? c.representation.done : c.representation.prompt);
        }
        if (hintVisible) return c.hint;
        if (phase === "solved") return c.correct;
        if (phase === "question" && attempts > 0) {
          return c.errors[Math.min(attempts - 1, c.errors.length - 1)]!;
        }
        return c.observe;
      }
    }
  }, [attempts, hintVisible, metaAnswered, metaWrong, phase, repDone, repFeedback, step]);

  // Troca de tela/fala interrompe imediatamente o áudio anterior.
  // Nunca há reprodução automática: o áudio só começa por clique do estudante.
  useEffect(() => {
    stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSpeech?.key, stepIndex]);


  const goNext = useCallback(() => {
    stop();
    setStepIndex((i) => Math.min(i + 1, flow.length - 1));
    resetStepState();
  }, [resetStepState, stop]);

  const goBack = useCallback(() => {
    stop();
    setStepIndex((i) => Math.max(i - 1, 0));
    resetStepState();
  }, [resetStepState, stop]);

  const restart = useCallback(() => {
    stop();
    setStepIndex(0);
    setAttemptsByQuestion({});
    resetStepState();
  }, [resetStepState, stop]);

  const playRemoval = useCallback(() => {
    if (removeTimer.current) clearTimeout(removeTimer.current);
    if (representTimer.current) clearTimeout(representTimer.current);
    setRepFilled({});
    setRepFeedback(null);
    setHintVisible(false);
    setSelectedAnswer(null);
    setAnimationKey((k) => k + 1);
    setPhase("observe");
    // pequeno respiro antes da saída dos animais
    removeTimer.current = setTimeout(() => {
      setPhase("removing");
      removeTimer.current = setTimeout(() => setPhase("question"), 2500);
    }, 120);
  }, []);

  const answer = useCallback(
    (value: number) => {
      if (step.kind !== "challenge" || phase === "solved" || phase === "represent") return;
      const c = step.challenge;
      setSelectedAnswer(value);
      setHintVisible(false);
      if (value === c.answer) {
        setPhase("solved");
        if (representTimer.current) clearTimeout(representTimer.current);
        // transição suave: feedback de acerto → área da operação
        representTimer.current = setTimeout(() => setPhase("represent"), 450);
      } else {
        setAttempts((a) => a + 1);
        setAttemptsByQuestion((prev) => ({ ...prev, [c.id]: (prev[c.id] ?? 0) + 1 }));
      }
    },
    [phase, step],
  );

  /** Clique em um número da microetapa: preenche a lacuna ativa ou orienta sem penalizar. */
  const chooseNumber = useCallback(
    (value: number) => {
      if (!representation || !activeBlank) return;
      if (value === representation[activeBlank]) {
        setRepFeedback(null);
        setRepFilled((prev) => ({ ...prev, [activeBlank]: value }));
        return;
      }
      const roleOfValue = (["initial", "removed", "result"] as RepRole[]).find(
        (role) => representation[role] === value,
      );
      const meaning: Record<RepRole, string> = {
        initial: "quantos havia no começo",
        removed: "quantos saíram",
        result: "quantos ficaram",
      };
      const text = roleOfValue
        ? `O ${value} mostra ${meaning[roleOfValue]}. Qual número mostra ${meaning[activeBlank]}?`
        : `Procure o número que mostra ${meaning[activeBlank]}.`;
      setRepFeedback({ key: `${representation.prompt.key}-retry-${activeBlank}-${value}`, text });
    },
    [activeBlank, representation],
  );

  const background: BackgroundKey =
    step.kind === "cover"
      ? "cover"
      : step.kind === "transition"
        ? step.background
        : step.kind === "summary"
          ? "reflection"
          : step.kind === "final"
            ? "final"
            : "activity";

  const pose: MaraPose =
    step.kind === "intro"
      ? step.pose
      : step.kind === "transition"
        ? step.pose
        : step.kind === "final"
          ? "celebrating"
          : step.kind === "summary"
            ? "presentingAlt"
            : step.kind === "meta"
              ? metaAnswered
                ? "celebrating"
                : "thinking"
              : phase === "solved" || phase === "represent"
                ? "celebrating"
                : hintVisible || (phase === "question" && attempts > 0)
                  ? "feedback"
                  : phase === "observe"
                    ? "pointing"
                    : "observing";

  const challengeNumber = step.kind === "challenge" ? step.challenge.number : null;

  /**
   * Composição condensada: telas cuja cena matemática usa cardumes (dezenas).
   * A cena ocupa a faixa protegida Y 135–430 e a mediação vai para a faixa inferior.
   */
  const hasTens =
    (step.kind === "challenge" && step.challenge.tens > 0) ||
    step.kind === "summary" ||
    (step.kind === "transition" && (step.demo?.tens ?? 0) > 0);

  /** Composição própria da microetapa de representação simbólica. */
  const isRepresent = step.kind === "challenge" && phase === "represent";
  const representLayout: "tens" | "simple" | null = isRepresent
    ? hasTens
      ? "tens"
      : "simple"
    : null;




  if (!ready) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[var(--deep-sea)]">
        <p className="font-body text-[26px] font-medium text-[var(--cream)]">
          Preparando o recife...
        </p>
      </div>
    );
  }

  return (
    <GameCanvas background={background}>
      {step.kind !== "cover" && <SceneDecor />}

      {/* CAPA */}
      {step.kind === "cover" && (
        <div className="absolute inset-x-0 bottom-10 flex justify-center" style={{ zIndex: 50 }}>
          <AssetButton
            asset="start"
            width={300}
            label="Iniciar a atividade"
            onClick={() => {
              goNext();
            }}
          />
        </div>
      )}

      {/* INDICADOR DE PROGRESSO */}
      {challengeNumber !== null && (
        <div
          className="absolute left-8 top-7 rounded-2xl border-2 border-[var(--navy)] bg-[var(--cream)] px-5 py-2"
          style={{ zIndex: 50 }}
        >
          <ProgressIndicator current={challengeNumber} total={TOTAL_CHALLENGES} />
        </div>
      )}

      {/* ZONA 1 + ZONA 2 — enunciado e cena em fluxo (nunca se intersectam) */}
      {step.kind === "challenge" && (
        <div
          className="absolute inset-x-0 top-4 flex flex-col items-center"
          style={{ zIndex: 10 }}
        >
          <div
            className="rounded-[26px] border-4 border-[var(--navy)] bg-[var(--cream)] px-8 py-4 text-center"
            style={{ zIndex: 40, width: hasTens ? 660 : 820 }}
          >
            <h1
              className="font-body text-[30px] font-semibold text-[var(--navy)]"
              style={{ lineHeight: 1.35 }}
            >
              {phase === "observe"
                ? step.challenge.tens > 0
                  ? "Observe os cardumes e os peixes do recife."
                  : "Observe quantos peixes há no recife."
                : step.challenge.prompt}
            </h1>
          </div>

          <div
            className="mt-3 flex w-full justify-center overflow-visible"
            style={{ zIndex: 10 }}
          >
            <FishScene
              tens={step.challenge.tens}
              ones={step.challenge.ones}
              removeTens={step.challenge.removeTens}
              removeOnes={step.challenge.removeOnes}
              phase={phase === "represent" ? "solved" : phase}
              animationKey={animationKey}
              highlightRemaining={phase === "solved" || phase === "represent"}
              compact={hasTens}
            />
          </div>
        </div>
      )}

      {step.kind === "transition" && step.showTenGroup && (
        <div className="absolute inset-x-0 top-[150px] flex justify-center" style={{ zIndex: 10 }}>
          <FishScene
            tens={1}
            ones={0}
            removeTens={0}
            removeOnes={0}
            phase="observe"
            animationKey={animationKey}
          />
        </div>
      )}

      {step.kind === "transition" && step.demo && (
        <div
          className="absolute inset-x-0 flex justify-center overflow-visible"
          style={{ zIndex: 10, top: hasTens ? 120 : 140, height: hasTens ? 290 : undefined }}
        >
          <FishScene
            tens={step.demo.tens}
            ones={step.demo.ones}
            removeTens={step.demo.removeTens}
            removeOnes={step.demo.removeOnes}
            phase={phase}
            animationKey={animationKey}
            compact={hasTens}
          />
        </div>
      )}

      {step.kind === "summary" && (
        <div
          className="absolute inset-x-0 top-4 flex flex-col items-center"
          style={{ zIndex: 10 }}
        >
          <div
            className="w-[720px] rounded-[26px] border-4 border-[var(--navy)] bg-[var(--cream)] px-8 py-4 text-center"
            style={{ zIndex: 40 }}
          >
            <p className="font-body text-[24px] font-medium text-[var(--navy)]">
              35 peixes · 23 saíram · 12 ficaram
            </p>
            <p
              className="mt-1 font-display text-[40px] font-bold text-[var(--navy)]"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              35 − 23 = 12
            </p>
          </div>
          <div className="mt-4 flex w-full justify-center overflow-visible" style={{ zIndex: 10 }}>
            <FishScene
              tens={3}
              ones={5}
              removeTens={2}
              removeOnes={3}
              phase="solved"
              animationKey={animationKey}
              highlightRemaining
              compact
            />
          </div>
        </div>
      )}



      {/* METACOGNIÇÃO */}
      {step.kind === "meta" && (
        <div
          className="absolute left-1/2 top-[150px] flex w-[760px] -translate-x-1/2 flex-col gap-4"
          style={{ zIndex: 40 }}
        >
          {step.meta.options.map((option) => (
            <button
              key={option.label}
              type="button"
              disabled={metaAnswered}
              onClick={() => {
                if (option.correct) {
                  setMetaWrong(false);
                  setMetaAnswered(true);
                } else {
                  setMetaWrong(true);
                }
              }}
              aria-label={`Responder: ${option.label}`}
              className="min-h-[80px] cursor-pointer rounded-[28px] border-4 border-[var(--navy)] bg-[var(--cream)] px-7 py-4 text-left font-body text-[28px] font-medium text-[var(--navy)] shadow-[0_3px_0_rgba(12,42,74,0.2)] transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--navy)] disabled:cursor-default disabled:hover:scale-100"
              style={{ lineHeight: 1.4 }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {/* MARA */}
      {step.kind !== "cover" && (
        <div
          className="absolute left-6"
          style={{ zIndex: 20, bottom: representLayout ? 0 : hasTens ? 0 : 10 }}
        >
          <Character
            pose={pose}
            height={
              step.kind === "final"
                ? 340
                : representLayout === "simple"
                  ? 235
                  : hasTens
                    ? 210
                    : 260
            }
          />
        </div>
      )}

      {/* BALÃO DE FALA */}
      {currentSpeech && (
        <div
          className="absolute"
          style={{
            zIndex: 30,
            ...(representLayout === "simple"
              ? { left: 220, bottom: 245 }
              : representLayout === "tens"
                ? { left: 200, bottom: 10 }
                : { left: hasTens ? 100 : 210, bottom: hasTens ? 8 : 178 }),
          }}
        >
          <SpeechBubble
            text={currentSpeech.text}
            speaking={speaking}
            finished={finished}
            width={
              representLayout === "simple" ? 520 : representLayout === "tens" ? 520 : hasTens ? 620 : 560
            }
            onPlay={() => {
              if (speaking) {
                stop();
                return;
              }
              speak(currentSpeech);
            }}
          />
        </div>
      )}

      {/* NAVEGAÇÃO E AÇÕES */}
      <div
        className="absolute right-6 flex flex-col items-end gap-3"
        style={{ zIndex: 50, ...(hasTens ? { top: 20 } : { bottom: 24 }) }}
      >

        {step.kind === "challenge" && (phase === "question" || phase === "removing") && (
          <AssetButton
            asset="hint"
            width={110}
            label="Pedir uma dica para a Mara"
            onClick={() => setHintVisible((v) => !v)}
          />
        )}

        {step.kind === "challenge" && phase === "observe" && (
          <AssetButton
            asset="next"
            width={190}
            label="Ver o que aconteceu no recife"
            onClick={playRemoval}
          />
        )}

        {step.kind === "challenge" && (phase === "question" || phase === "removing") && (
          <button
            type="button"
            onClick={playRemoval}
            aria-label="Ver novamente a saída dos animais"
            className="cursor-pointer rounded-2xl border-2 border-[var(--navy)] bg-[var(--cream)] px-5 py-3 font-body text-[24px] font-semibold text-[var(--navy)] transition-transform duration-150 hover:scale-[1.03] active:scale-[0.97] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--navy)]"
          >
            Ver novamente
          </button>
        )}

        {((step.kind === "challenge" && phase === "represent" && repDone) ||
          step.kind === "intro" ||
          step.kind === "transition" ||
          step.kind === "summary" ||
          (step.kind === "meta" && metaAnswered)) && (
          <AssetButton asset="next" width={190} label="Seguir para a próxima tela" onClick={goNext} />
        )}

        {step.kind === "final" && (
          <>
            <AssetButton asset="back" width={170} label="Voltar para a tela anterior" onClick={goBack} />
            <AssetButton asset="restart" width={200} label="Recomeçar a atividade" onClick={restart} />
          </>
        )}
      </div>

      {/* ALTERNATIVAS */}
      {step.kind === "challenge" && (phase === "question" || phase === "solved") && (
        <div
          className={`absolute inset-x-0 bottom-[36px] flex ${hasTens ? "justify-end pr-8" : "justify-center"}`}
          style={{ zIndex: 40 }}
        >
          <div className={hasTens ? "" : "pr-[240px] pl-[240px]"}>
            <AnswerOptions
              options={step.challenge.options}
              selected={selectedAnswer}
              correctAnswer={step.challenge.answer}
              solved={phase === "solved"}
              onSelect={answer}
            />
          </div>
        </div>
      )}


      {/* ZONA C — REPRESENTAÇÃO SIMBÓLICA (composição própria da fase) */}
      {step.kind === "challenge" && phase === "represent" && representation && (
        <div
          className="absolute flex justify-center"
          style={
            representLayout === "tens"
              ? { zIndex: 40, right: 16, bottom: 24, width: 440 }
              : { zIndex: 40, left: 0, right: 0, bottom: 24 }
          }
        >
          <div className={representLayout === "tens" ? "flex w-full justify-center" : "flex w-[620px] justify-center"}>

            <OperationBuilder
              representation={representation}
              filled={repFilled}
              activeBlank={activeBlank}
              onChoose={chooseNumber}
              compact={hasTens}
            />
          </div>
        </div>
      )}

      {/* Demonstração automática nas transições com cena */}
      {step.kind === "transition" && step.demo && phase === "observe" && (
        <DemoStarter onStart={playRemoval} />
      )}

      <p className="sr-only" aria-live="polite">
        {currentSpeech?.text}
        {step.kind === "challenge" && phase === "solved"
          ? ` Resposta correta: ${step.challenge.answer}. Total de tentativas nesta questão: ${
              attemptsByQuestion[step.challenge.id] ?? 0
            }.`
          : ""}
      </p>
    </GameCanvas>
  );
}

function DemoStarter({ onStart }: { onStart: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onStart, 900);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
