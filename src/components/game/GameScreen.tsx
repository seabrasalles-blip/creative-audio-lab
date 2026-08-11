import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { AnswerOptions } from "@/components/game/AnswerOptions";
import { AssetButton } from "@/components/game/AssetButton";
import { Character } from "@/components/game/Character";
import { FishScene } from "@/components/game/FishScene";
import { GameCanvas } from "@/components/game/GameCanvas";
import { MetacognitionScreen } from "@/components/game/MetacognitionScreen";
import { OperationBuilder } from "@/components/game/OperationBuilder";
import { ProgressIndicator } from "@/components/game/ProgressIndicator";
import { SceneDecor } from "@/components/game/SceneDecor";
import { SpeechBubble } from "@/components/game/SpeechBubble";
import { preloadList, type BackgroundKey, type MaraPose } from "@/data/assets";
import { activeChallengeIds, flow, totalChallenges } from "@/data/flow";
import { OrientationGuard } from "@/components/game/OrientationGuard";
import { stableShuffle } from "@/lib/shuffle";
import { useAssetPreload } from "@/hooks/useAssetPreload";
import { useMaraVoice } from "@/hooks/useMaraVoice";
import type { Phase, RepChoice, RepRole, Speech } from "@/types/game";

const TOTAL_CHALLENGES = totalChallenges;

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
  const [repUsed, setRepUsed] = useState<string[]>([]);
  const [repFeedback, setRepFeedback] = useState<Speech | null>(null);
  /** Observação ativa (contagem inicial): não pontua e não penaliza. */
  const [countSelected, setCountSelected] = useState<number | null>(null);
  const [countDone, setCountDone] = useState(false);
  const [countWrong, setCountWrong] = useState(false);

  const step = flow[stepIndex]!;
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  /** Cancela todos os timers da etapa atual (retirada, demonstração, transições). */
  const clearInteractionTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  }, []);

  /** Microetapa de representação simbólica (após o acerto). */
  const representation = step.kind === "challenge" ? step.challenge.representation : null;
  const activeBlank: RepRole | null =
    representation?.blanks.find((role) => repFilled[role] === undefined) ?? null;
  const repDone = representation !== null && activeBlank === null;

  /**
   * Ordem das opções numéricas embaralhada uma única vez por desafio:
   * a posição não pode entregar a resposta, e não muda após um erro.
   * Cada card tem id próprio: 24 − 12 = 12 usa dois cards com o mesmo valor.
   */
  const repChoices = useMemo(() => {
    if (!representation) return [] as RepChoice[];
    const original = representation.choices;
    if (original.length < 2) return original;
    const seed = original.map((c) => c.value).join("-");
    const shuffled = stableShuffle(original, `${step.id}-${seed}`);
    // nunca manter a mesma ordem das lacunas: a posição não pode entregar a resposta
    return shuffled.every((c, i) => c.id === original[i]?.id)
      ? [...shuffled.slice(1), shuffled[0]!]
      : shuffled;
  }, [representation, step.id]);

  /** Cards ainda disponíveis (um card usado não pode preencher outra lacuna). */
  const availableRepChoices = useMemo(
    () => repChoices.filter((c) => !repUsed.includes(c.id)),
    [repChoices, repUsed],
  );

  const resetStepState = useCallback(() => {
    clearInteractionTimers();
    setPhase("observe");
    setSelectedAnswer(null);
    setAttempts(0);
    setHintVisible(false);
    setMetaAnswered(false);
    setMetaWrong(false);
    setRepFilled({});
    setRepUsed([]);
    setRepFeedback(null);
    setCountSelected(null);
    setCountDone(false);
    setCountWrong(false);
    setAnimationKey((k) => k + 1);
  }, [clearInteractionTimers]);

  useEffect(() => () => clearInteractionTimers(), [clearInteractionTimers]);

  /**
   * Observação ativa: nos desafios configurados nos dados, a fase inicial é a
   * identificação da quantidade inicial (sem tela nova e sem pontuação extra).
   */
  useEffect(() => {
    const s = flow[stepIndex]!;
    if (s.kind === "challenge" && s.challenge.initialCount) setPhase("initial-count");
  }, [stepIndex]);


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
        if (phase === "initial-count" && c.initialCount) {
          if (countDone) return c.initialCount.correct;
          if (countWrong) return c.initialCount.retry;
          return c.initialCount.question;
        }
        if (phase === "represent") {
          if (repFeedback) return repFeedback;
          if (repDone) return c.representation.done;
          const p0 = c.representation.prompt;
          const noneFilled = Object.keys(repFilled).length === 0;
          // Ponte entre a situação concreta e a escrita matemática.
          return noneFilled
            ? { key: `${p0.key}-bridge`, text: `Vamos mostrar com números. ${p0.text}` }
            : p0;
        }
        if (hintVisible) return c.hint;
        if (phase === "solved") return c.correct;
        if (phase === "question" && attempts > 0) {
          return c.errors[Math.min(attempts - 1, c.errors.length - 1)]!;
        }
        return c.observe;
      }
    }
  }, [
    attempts,
    countDone,
    countWrong,
    hintVisible,
    metaAnswered,
    metaWrong,
    phase,
    repDone,
    repFeedback,
    repFilled,
    step,
  ]);

  // Troca de tela/fala interrompe imediatamente o áudio anterior.
  // Nunca há reprodução automática: o áudio só começa por clique do estudante.
  useEffect(() => {
    stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSpeech?.key, stepIndex]);


  const goNext = useCallback(() => {
    clearInteractionTimers();
    stop();
    setStepIndex((i) => Math.min(i + 1, flow.length - 1));
    resetStepState();
  }, [clearInteractionTimers, resetStepState, stop]);

  const goBack = useCallback(() => {
    clearInteractionTimers();
    stop();
    setStepIndex((i) => Math.max(i - 1, 0));
    resetStepState();
  }, [clearInteractionTimers, resetStepState, stop]);

  const restart = useCallback(() => {
    clearInteractionTimers();
    stop();
    setStepIndex(0);
    setAttemptsByQuestion({});
    resetStepState();
  }, [clearInteractionTimers, resetStepState, stop]);

  const playRemoval = useCallback(() => {
    clearInteractionTimers();
    setRepFilled({});
    setRepFeedback(null);
    setHintVisible(false);
    setSelectedAnswer(null);
    setAnimationKey((k) => k + 1);
    setPhase("observe");
    // pequeno respiro antes da saída dos animais
    schedule(() => {
      setPhase("removing");
      schedule(() => setPhase("question"), 2500);
    }, 120);
  }, [clearInteractionTimers, schedule]);

  const answer = useCallback(
    (value: number) => {
      if (step.kind !== "challenge" || phase === "solved" || phase === "represent") return;
      const c = step.challenge;
      setSelectedAnswer(value);
      setHintVisible(false);
      if (value === c.answer) {
        // O feedback de acerto permanece na tela: a criança decide quando seguir.
        clearInteractionTimers();
        setPhase("solved");
      } else {
        setAttempts((a) => a + 1);
        setAttemptsByQuestion((prev) => ({ ...prev, [c.id]: (prev[c.id] ?? 0) + 1 }));
      }
    },
    [clearInteractionTimers, phase, step],
  );

  /**
   * Contagem inicial: apoio pedagógico, nunca pontuação.
   * O erro não penaliza e não entra nas tentativas da subtração.
   */
  const answerInitialCount = useCallback(
    (value: number) => {
      if (step.kind !== "challenge" || !step.challenge.initialCount || countDone) return;
      setCountSelected(value);
      if (value === step.challenge.initialCount.answer) {
        setCountWrong(false);
        setCountDone(true);
      } else {
        setCountWrong(true);
      }
    },
    [countDone, step],
  );

  /** Clique em um número da microetapa: preenche a lacuna ativa ou orienta sem penalizar. */
  const chooseNumber = useCallback(
    (choice: RepChoice) => {
      if (!representation || !activeBlank) return;
      const value = choice.value;
      if (value === representation[activeBlank]) {
        setRepFeedback(null);
        setRepFilled((prev) => ({ ...prev, [activeBlank]: value }));
        setRepUsed((prev) => [...prev, choice.id]);
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
                : hintVisible || (phase === "question" && attempts > 0) || countWrong
                  ? "feedback"
                  : phase === "observe" || phase === "initial-count"
                    ? "pointing"
                    : "observing";

  /** Número do desafio derivado do fluxo ativo (nunca fixo no código). */
  const challengeNumber =
    step.kind === "challenge" ? activeChallengeIds.indexOf(step.id) + 1 || null : null;

  /**
   * Composição condensada: telas cuja cena matemática usa grupos de 10 (dezenas).
   * A cena ocupa a faixa protegida Y 135–430 e a mediação vai para a faixa inferior.
   */
  const hasTens =
    (step.kind === "challenge" && step.challenge.tens > 0) ||
    (step.kind === "transition" && (step.demo?.tens ?? 0) > 0);


  /** Composição própria da microetapa de representação simbólica. */
  const isRepresent = step.kind === "challenge" && phase === "represent";
  const representLayout: "tens" | "simple" | null = isRepresent
    ? hasTens
      ? "tens"
      : "simple"
    : null;

  const maraRef = useRef<HTMLDivElement>(null);
  /**
   * Regra geral de composição da zona inferior esquerda:
   * [MARA] 22px [BALÃO + ÁUDIO]. A largura real da personagem é medida em
   * layout px (o canvas é escalado por transform, então offsetWidth é fiel),
   * e o balão só existe à direita dessa área protegida.
   */
  const MARA_GAP = 22;
  const [maraWidth, setMaraWidth] = useState(220);
  useEffect(() => {
    const el = maraRef.current;
    if (!el) return;
    const measure = () => setMaraWidth(el.offsetWidth || 220);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [step, phase, representLayout, hasTens]);

  const bubbleLeft = 24 + maraWidth + MARA_GAP;
  const bubbleRightEdge =
    representLayout === "simple" ? 760 : representLayout === "tens" ? 700 : hasTens ? 604 : 780;
  const bubbleWidth = Math.max(300, bubbleRightEdge - bubbleLeft);


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
    <>
      <OrientationGuard />
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
            style={{ zIndex: 40, width: hasTens ? 660 : 700 }}
          >
            <h1
              className="font-body text-[30px] font-semibold text-[var(--navy)]"
              style={{ lineHeight: 1.35 }}
            >
              {phase === "initial-count" && step.challenge.initialCount
                ? step.challenge.initialCount.question.text
                : phase === "observe"
                  ? step.challenge.tens > 0
                    ? "Observe os grupos de 10 e os peixes que estão separados."
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
              phase={
                phase === "represent" ? "solved" : phase === "initial-count" ? "observe" : phase
              }
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
              8 peixes · 3 saíram · 5 ficaram
            </p>
            <p
              className="mt-1 font-display text-[40px] font-bold text-[var(--navy)]"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              8 − 3 = 5
            </p>
          </div>
          <div className="mt-4 flex w-full justify-center overflow-visible" style={{ zIndex: 10 }}>
            <FishScene
              tens={0}
              ones={8}
              removeTens={0}
              removeOnes={3}
              phase="solved"
              animationKey={animationKey}
              highlightRemaining
              compact
            />
          </div>
        </div>
      )}



      {/* METACOGNIÇÃO — composição exclusiva */}
      {step.kind === "meta" && currentSpeech && (
        <MetacognitionScreen
          meta={step.meta}
          answered={metaAnswered}
          wrong={metaWrong}
          speech={currentSpeech}
          speaking={speaking}
          finished={finished}
          onAnswer={(correct) => {
            if (correct) {
              setMetaWrong(false);
              setMetaAnswered(true);
            } else {
              setMetaWrong(true);
            }
          }}
          onPlay={() => {
            if (speaking) {
              stop();
              return;
            }
            speak(currentSpeech);
          }}
          onNext={goNext}
        />
      )}

      {/* MARA — área protegida no canto inferior esquerdo */}
      {step.kind !== "cover" && step.kind !== "meta" && representLayout !== "tens" && (
        <div
          ref={maraRef}
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


      {/* BALÃO DE FALA — sempre à direita da área ocupada pela Mara */}
      {currentSpeech && step.kind !== "meta" && representLayout !== "tens" && (
        <div
          className="absolute"
          style={{
            zIndex: 30,
            left: bubbleLeft,
            width: bubbleWidth,
            bottom:
              representLayout === "simple"
                ? 245
                : representLayout === "tens"
                  ? 10
                  : hasTens
                    ? 8
                    : 178,
          }}
        >
          <SpeechBubble
            text={currentSpeech.text}
            speaking={speaking}
            finished={finished}
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

        {step.kind === "challenge" && phase === "solved" && !hasTens && (
          <button
            type="button"
            onClick={() => {
              if (phase !== "solved") return;
              clearInteractionTimers();
              setPhase("represent");
            }}
            aria-label="Mostrar com números o que aconteceu"
            className="animate-scale-in cursor-pointer rounded-[26px] border-4 border-[var(--navy)] bg-[var(--cream)] px-6 py-4 font-body text-[26px] font-semibold text-[var(--navy)] shadow-[0_3px_0_rgba(12,42,74,0.2)] transition-transform duration-150 hover:scale-[1.03] active:scale-[0.97] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--navy)]"
          >
            Mostrar com números
          </button>
        )}

        {step.kind === "challenge" &&
          (phase === "observe" || (phase === "initial-count" && countDone)) && (
            <AssetButton
              asset="next"
              width={190}
              label="Ver o que acontece no recife"
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

        {(step.kind === "intro" || step.kind === "transition" || step.kind === "summary") && (

          <AssetButton asset="next" width={190} label="Seguir para a próxima tela" onClick={goNext} />
        )}


        {step.kind === "final" && (
          <>
            <AssetButton asset="back" width={170} label="Voltar para a tela anterior" onClick={goBack} />
            <AssetButton asset="restart" width={200} label="Recomeçar a atividade" onClick={restart} />
          </>
        )}
      </div>

      {/* CONTINUAÇÃO APÓS O ACERTO — zona própria nas telas com cardumes */}
      {step.kind === "challenge" && phase === "solved" && hasTens && (
        <div className="absolute animate-scale-in" style={{ zIndex: 50, right: 24, bottom: 152 }}>
          <button
            type="button"
            onClick={() => {
              clearInteractionTimers();
              setPhase("represent");
            }}
            aria-label="Mostrar com números o que aconteceu"
            className="cursor-pointer rounded-[26px] border-4 border-[var(--navy)] bg-[var(--cream)] px-6 py-4 font-body text-[26px] font-semibold text-[var(--navy)] shadow-[0_3px_0_rgba(12,42,74,0.2)] transition-transform duration-150 hover:scale-[1.03] active:scale-[0.97] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--navy)]"
          >
            Mostrar com números
          </button>
        </div>
      )}

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

      {/* ALTERNATIVAS DA CONTAGEM INICIAL — mesma zona espacial da fase question */}
      {step.kind === "challenge" &&
        phase === "initial-count" &&
        step.challenge.initialCount &&
        !countDone && (
          <div
            className={`absolute inset-x-0 bottom-[36px] flex ${hasTens ? "justify-end pr-8" : "justify-center"}`}
            style={{ zIndex: 40 }}
          >
            <div className={hasTens ? "" : "pr-[240px] pl-[240px]"}>
              <AnswerOptions
                options={step.challenge.initialCount.options}
                selected={countSelected}
                correctAnswer={step.challenge.initialCount.answer}
                solved={false}
                onSelect={answerInitialCount}
              />
            </div>
          </div>
        )}


      {/* ZONA C — REPRESENTAÇÃO SIMBÓLICA (composição própria da fase) */}
      {step.kind === "challenge" && phase === "represent" && representation && representLayout === "tens" && (
        /**
         * Faixa inferior única: [MARA] gap [BALÃO + ÁUDIO] gap [OPERAÇÃO].
         * Os três blocos vivem no mesmo sistema de layout (flex + gap),
         * sem coordenadas absolutas independentes, o que mantém as áreas
         * protegidas mesmo quando o canvas é escalado em iframe/Portal.
         */
        <div
          className="absolute inset-x-0 bottom-0 flex items-end gap-6 px-6 pb-2"
          style={{ zIndex: 40, height: 250 }}
        >
          <div className="shrink-0 self-end">
            <Character pose={pose} height={210} />
          </div>

          {currentSpeech && (
            <div className="min-w-0 flex-1 pb-4">
              <SpeechBubble
                text={currentSpeech.text}
                speaking={speaking}
                finished={finished}
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

          <div className="flex shrink-0 justify-center pb-4" style={{ width: 470 }}>
            <OperationBuilder
              representation={representation}
              choices={availableRepChoices}
              filled={repFilled}
              activeBlank={activeBlank}
              onChoose={chooseNumber}
              compact
            />
          </div>
        </div>
      )}

      {step.kind === "challenge" && phase === "represent" && representation && representLayout !== "tens" && (
        <div
          className="absolute flex justify-center"
          style={{ zIndex: 40, left: 470, right: 20, bottom: 24 }}
        >
          <div className="flex w-full justify-center">
            <OperationBuilder
              representation={representation}
              choices={repChoices}
              filled={repFilled}
              activeBlank={activeBlank}
              onChoose={chooseNumber}
              compact={hasTens}
            />
          </div>
        </div>
      )}


      {/* ZONA D — NAVEGAÇÃO PRÓPRIA DA MICROETAPA "REPRESENT" (fora da zona da operação) */}
      {step.kind === "challenge" && phase === "represent" && repDone && (
        <div
          className="absolute animate-scale-in"
          style={
            representLayout === "tens"
              ? { zIndex: 50, right: 24, top: 24 }
              : { zIndex: 50, right: 24, bottom: 240 }
          }
        >
          <AssetButton asset="next" width={190} label="Seguir para a próxima tela" onClick={goNext} />
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
    </>
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
