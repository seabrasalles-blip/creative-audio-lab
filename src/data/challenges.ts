import { ficou, havia, retomada, saiu, saiuPosposto } from "@/lib/pt";
import type { Challenge, RepChoice, RepRole } from "@/types/game";

type Seed = {
  id: string;
  number: number | null;
  tens: number;
  ones: number;
  removeTens: number;
  removeOnes: number;
  options: number[];
  /** dica: sempre uma estratégia, nunca a resposta */
  hint: string;
  /** fala de observação: orienta a atenção, nunca entrega a quantidade */
  observe: string;
  /** abertura do feedback de acerto (a retomada numérica é gerada) */
  abertura: string;
  errors: string[];
  /** observação ativa: a criança responde quantos há antes da retirada */
  initialCountCheck?: boolean;
  initialCountQuestion?: string;
  initialCountOptions?: number[];
  initialCountCorrect?: string;
  initialCountRetry?: string;
};

const seeds: Seed[] = [
  {
    id: "tutorial",
    number: null,
    tens: 0,
    ones: 3,
    removeTens: 0,
    removeOnes: 1,
    options: [2, 3, 4],
    hint: "Você pode apontar para cada peixe enquanto conta.",
    observe: "Olhe com atenção para o recife e conte com calma.",
    abertura: "Isso mesmo!",
    errors: ["Observe novamente. Conte os peixes que ficaram."],
  },
  {
    id: "c1",
    number: 1,
    tens: 0,
    ones: 5,
    removeTens: 0,
    removeOnes: 1,
    options: [3, 4, 5],
    hint: "Conte somente os peixes que ainda estão no recife.",
    observe: "Conte com calma antes de continuar.",
    abertura: "Muito bem!",
    errors: ["Observe novamente. Conte os peixes que ficaram."],
    initialCountCheck: true,
    initialCountQuestion: "Quantos peixes há no recife?",
    initialCountOptions: [4, 5, 6],
    initialCountCorrect: "Isso! Há 5 peixes. Agora veja o que acontece.",
    initialCountRetry: "Conte novamente os peixes.",
  },
  {
    id: "c2",
    number: 2,
    tens: 0,
    ones: 6,
    removeTens: 0,
    removeOnes: 2,
    options: [4, 5, 6],
    hint: "Você pode apontar para cada peixe enquanto conta.",
    observe: "Quantos peixes você consegue contar?",
    abertura: "Isso!",
    errors: ["Quase! Conte apenas os peixes que permaneceram no recife."],
    initialCountCheck: true,
    initialCountQuestion: "Quantos peixes há no recife?",
    initialCountOptions: [5, 6, 7],
    initialCountCorrect: "Isso! Há 6 peixes. Agora veja o que acontece.",
    initialCountRetry: "Conte novamente os peixes.",
  },
  {
    id: "c3",
    number: 3,
    tens: 0,
    ones: 8,
    removeTens: 0,
    removeOnes: 3,
    options: [5, 6, 11],
    hint: "Neste desafio, queremos descobrir quantos ficaram. Observe os peixes que permaneceram no recife.",
    observe: "Olhe com atenção para o recife.",
    abertura: "Exato!",
    errors: ["Observe novamente os peixes que ficaram no recife."],
    initialCountCheck: true,
    initialCountQuestion: "Quantos peixes há no começo?",
    initialCountOptions: [7, 8, 9],
    initialCountCorrect: "Isso! Há 8 peixes. Agora veja o que acontece.",
    initialCountRetry: "Conte novamente os peixes.",
  },
  {
    id: "c4",
    number: 4,
    tens: 0,
    ones: 9,
    removeTens: 0,
    removeOnes: 4,
    options: [4, 5, 6],
    hint: "Conte primeiro os peixes que ficaram, um de cada vez.",
    observe: "Conte com calma. Depois veja o que acontece.",
    abertura: "Isso mesmo!",
    errors: ["Quase! Conte apenas os peixes que permaneceram no recife."],
  },
  {
    id: "c5",
    number: 5,
    tens: 1,
    ones: 2,
    removeTens: 0,
    removeOnes: 2,
    options: [10, 11, 12],
    hint: "Conte o grupo de 10 e junte os peixes separados.",
    observe: "Comece pelo grupo de 10 e depois olhe os peixes separados.",
    abertura: "Muito bem!",
    errors: ["Observe novamente. Comece pelo grupo de 10."],
    initialCountCheck: true,
    initialCountQuestion: "Quantos peixes há ao todo?",
    initialCountOptions: [10, 12, 20],
    initialCountCorrect: "Isso! Ao todo são 12 peixes. Agora veja o que acontece.",
    initialCountRetry: "Comece pelo grupo de 10 e depois conte os peixes separados.",
  },
  {
    id: "c6",
    number: 6,
    tens: 1,
    ones: 4,
    removeTens: 0,
    removeOnes: 3,
    options: [10, 11, 12],
    hint: "Conte o grupo de 10 e junte os peixes que ficaram.",
    observe: "Olhe primeiro o grupo de 10. Depois os peixes separados.",
    abertura: "Isso!",
    errors: ["Quase! Veja quais peixes separados ainda estão no recife."],
  },
  {
    id: "c7",
    number: 7,
    tens: 1,
    ones: 6,
    removeTens: 0,
    removeOnes: 4,
    options: [11, 12, 13],
    hint: "Comece pelo grupo de 10 e depois conte os peixes separados.",
    observe: "Observe o recife com calma.",
    abertura: "Exato!",
    errors: ["Observe novamente os peixes separados que ficaram."],
    initialCountCheck: true,
    initialCountQuestion: "Quantos peixes há ao todo?",
    initialCountOptions: [10, 16, 6],
    initialCountCorrect: "Isso! Ao todo são 16 peixes. Agora veja o que acontece.",
    initialCountRetry: "Comece pelo grupo de 10 e depois conte os peixes separados.",
  },
  {
    id: "c8",
    number: 8,
    tens: 1,
    ones: 8,
    removeTens: 0,
    removeOnes: 5,
    options: [12, 13, 14],
    hint: "O grupo de 10 continua inteiro. Conte só os peixes separados.",
    observe: "Comece pelo grupo de 10. Depois conte os peixes separados.",
    abertura: "Muito bem!",
    errors: ["Quase! Conte o grupo de 10 e junte os peixes que ficaram."],
  },
  {
    id: "c9",
    number: 9,
    tens: 2,
    ones: 1,
    removeTens: 1,
    removeOnes: 0,
    options: [10, 11, 20],
    hint: "Veja quantos grupos de 10 continuam no recife.",
    observe: "Observe quantos peixes há antes de começarmos.",
    abertura: "Isso mesmo!",
    errors: ["Observe novamente. Quantos grupos de 10 ainda estão no recife?"],
  },
  {
    id: "c10",
    number: 10,
    tens: 2,
    ones: 4,
    removeTens: 1,
    removeOnes: 2,
    options: [11, 12, 14],
    hint: "Conte os grupos de 10 que ficaram e depois os peixes separados.",
    observe: "Observe quantos peixes há antes de começarmos.",
    abertura: "Exato!",
    errors: ["Quase! Some os grupos de 10 que ficaram com os peixes separados."],
  },
  {
    id: "c11",
    number: 11,
    tens: 3,
    ones: 5,
    removeTens: 2,
    removeOnes: 3,
    options: [12, 13, 22],
    hint: "Cada grupo de 10 que ficou tem 10 peixes.",
    observe: "Observe quantos peixes há antes de começarmos.",
    abertura: "Muito bem!",
    errors: ["Observe novamente. Conte os grupos de 10 que permaneceram."],
  },
  {
    id: "c12",
    number: 12,
    tens: 4,
    ones: 6,
    removeTens: 2,
    removeOnes: 4,
    options: [20, 22, 24],
    hint: "Conte os grupos de 10 que ficaram e depois os peixes que ficaram.",
    observe: "Conte com calma: primeiro os grupos de 10, depois os peixes.",
    abertura: "Isso mesmo!",
    errors: ["Quase! Quantos grupos de 10 ainda estão no recife?"],
  },
];

/**
 * Microetapa de representação: andaimagem progressiva.
 * nível 0 = demonstração; 1 = uma lacuna; 2 = duas lacunas; 3 = três lacunas.
 */
type RepSeed = {
  level: 0 | 1 | 2 | 3;
  blanks: RepRole[];
  choices: RepChoice[];
  prompt: string;
  done: string;
};

const SINAL = "Nesta situação, o sinal de menos representa a quantidade que saiu.";

const repSeeds: Record<string, RepSeed> = {
  tutorial: {
    level: 0,
    blanks: [],
    choices: [],
    prompt: "Podemos mostrar com números: havia 3, saiu 1 e ficaram 2.",
    done: SINAL,
  },
  // Desafio 1 — demonstração completa
  c1: {
    level: 0,
    blanks: [],
    choices: [],
    prompt: "Podemos mostrar com números: havia 5, saiu 1 e ficaram 4.",
    done: SINAL,
  },
  // Desafio 2 — demonstração completa
  c2: {
    level: 0,
    blanks: [],
    choices: [],
    prompt: "Olhe: 6 mostra quantos havia, 2 mostra quantos saíram e 4 mostra quantos ficaram.",
    done: "Depois do sinal de igual mostramos quantos ficaram.",
  },
  // Desafio 3 — uma lacuna (resultado)
  c3: {
    level: 1,
    blanks: ["result"],
    choices: [
      { id: "c3-a", value: 4 },
      { id: "c3-b", value: 5 },
      { id: "c3-c", value: 6 },
    ],
    prompt: "Qual número mostra quantos ficaram?",
    done: "Isso! O 5 mostra quantos ficaram.",
  },
  c4: {
    level: 1,
    blanks: ["initial"],
    choices: [
      { id: "c4-a", value: 4 },
      { id: "c4-b", value: 5 },
      { id: "c4-c", value: 9 },
    ],
    prompt: "Qual número mostra quantos havia no começo?",
    done: "Isso! 9 − 4 = 5.",
  },
  // Desafio 4 — uma lacuna (quanto saiu)
  c5: {
    level: 1,
    blanks: ["removed"],
    choices: [
      { id: "c5-a", value: 2 },
      { id: "c5-b", value: 10 },
      { id: "c5-c", value: 12 },
    ],
    prompt: "Qual número mostra quantos saíram?",
    done: "Isso! 12 − 2 = 10.",
  },
  c6: {
    level: 1,
    blanks: ["initial"],
    choices: [
      { id: "c6-a", value: 3 },
      { id: "c6-b", value: 11 },
      { id: "c6-c", value: 14 },
    ],
    prompt: "Qual número mostra quantos havia?",
    done: "Isso! 14 − 3 = 11.",
  },
  // Desafio 5 — duas lacunas
  c7: {
    level: 2,
    blanks: ["removed", "result"],
    choices: [
      { id: "c7-removed", value: 4 },
      { id: "c7-result", value: 12 },
    ],
    prompt: "Agora encontre os dois números que faltam.",
    done: "Muito bem! 16 − 4 = 12.",
  },
  c8: {
    level: 2,
    blanks: ["removed", "result"],
    choices: [
      { id: "c8-removed", value: 5 },
      { id: "c8-result", value: 13 },
    ],
    prompt: "Agora encontre os dois números que faltam.",
    done: "Muito bem! 18 − 5 = 13.",
  },
  // Desafio 6 — duas lacunas
  c9: {
    level: 2,
    blanks: ["initial", "result"],
    choices: [
      { id: "c9-initial", value: 21 },
      { id: "c9-result", value: 11 },
    ],
    prompt: "Qual era a quantidade inicial? E quanto ficou?",
    done: "Muito bem! 21 − 10 = 11.",
  },
  // Desafio 7 — três lacunas (dois valores 12, com ids próprios)
  c10: {
    level: 3,
    blanks: ["initial", "removed", "result"],
    choices: [
      { id: "c10-initial-24", value: 24 },
      { id: "c10-removed-12", value: 12 },
      { id: "c10-result-12", value: 12 },
    ],
    prompt: "Agora monte a operação que mostra o que aconteceu.",
    done: "Você mostrou com números o que aconteceu no recife.",
  },
  // Desafio 8 — três lacunas
  c11: {
    level: 3,
    blanks: ["initial", "removed", "result"],
    choices: [
      { id: "c11-initial", value: 35 },
      { id: "c11-removed", value: 23 },
      { id: "c11-result", value: 12 },
    ],
    prompt: "Mostre com números o que aconteceu no recife.",
    done: "Você mostrou com números o que aconteceu no recife.",
  },
  c12: {
    level: 3,
    blanks: ["initial", "removed", "result"],
    choices: [
      { id: "c12-initial", value: 46 },
      { id: "c12-removed", value: 24 },
      { id: "c12-result", value: 22 },
    ],
    prompt: "Mostre com números o que aconteceu no recife.",
    done: "Você mostrou com números o que aconteceu no recife.",
  },
};

export const challenges: Challenge[] = seeds.map((s) => {
  const total = s.tens * 10 + s.ones;
  const removed = s.removeTens * 10 + s.removeOnes;
  const result = total - removed;
  const restTens = s.tens - s.removeTens;
  const restOnes = s.ones - s.removeOnes;
  const hasInitialCount = s.initialCountCheck === true;
  return {
    id: s.id,
    number: s.number,
    tens: s.tens,
    ones: s.ones,
    removeTens: s.removeTens,
    removeOnes: s.removeOnes,
    // Quando a criança já identificou a quantidade inicial, não repetimos esse número.
    prompt: hasInitialCount
      ? `${saiuPosposto(s.removeTens, s.removeOnes)}. Quantos ficaram?`
      : s.tens > 0
        ? `${havia(s.tens, s.ones)}. ${saiu(s.removeTens, s.removeOnes)}. Quantos peixes ficaram?`
        : `${havia(0, s.ones)}. ${saiu(0, s.removeOnes)}. Quantos ficaram?`,
    options: s.options,
    answer: result,
    hint: { key: `${s.id}-hint`, text: s.hint },
    observe: { key: `${s.id}-observe`, text: s.observe },
    correct: {
      key: `${s.id}-correct`,
      text:
        s.tens > 0
          ? `${retomada(s.abertura, total, removed, result)} ${ficou(restTens, restOnes)}.`
          : retomada(s.abertura, total, removed, result),
    },
    errors: s.errors.map((text, i) => ({ key: `${s.id}-error-${i + 1}`, text })),
    representation: {
      level: repSeeds[s.id]!.level,
      initial: total,
      removed,
      result,
      blanks: repSeeds[s.id]!.blanks,
      choices: repSeeds[s.id]!.choices,
      prompt: { key: `${s.id}-rep`, text: repSeeds[s.id]!.prompt },
      done: { key: `${s.id}-rep-done`, text: repSeeds[s.id]!.done },
    },
    initialCount: hasInitialCount
      ? {
          question: { key: `${s.id}-count`, text: s.initialCountQuestion! },
          options: s.initialCountOptions!,
          answer: total,
          correct: { key: `${s.id}-count-correct`, text: s.initialCountCorrect! },
          retry: { key: `${s.id}-count-retry`, text: s.initialCountRetry! },
        }
      : null,
  };
});

export const tutorial = challenges[0]!;
export const scoredChallenges = challenges.filter((c) => c.number !== null);
