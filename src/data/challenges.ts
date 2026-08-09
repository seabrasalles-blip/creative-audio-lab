import { ficou, grupo, havia, retomada, saiu } from "@/lib/pt";
import type { Challenge, RepRole } from "@/types/game";

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
    hint: "Cada cardume vale 10. Conte o cardume e junte os peixes separados.",
    observe: "Comece pelos cardumes e depois olhe os peixes separados.",
    abertura: "Muito bem!",
    errors: ["Observe novamente. Comece pelo cardume."],
  },
  {
    id: "c6",
    number: 6,
    tens: 1,
    ones: 4,
    removeTens: 0,
    removeOnes: 3,
    options: [10, 11, 12],
    hint: "Conte o cardume como 10 e junte os peixes que ficaram.",
    observe: "Olhe primeiro o cardume. Depois os peixes separados.",
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
    hint: "Comece pelo cardume e depois conte os peixes separados.",
    observe: "Observe o recife com calma.",
    abertura: "Exato!",
    errors: ["Observe novamente os peixes separados que ficaram."],
  },
  {
    id: "c8",
    number: 8,
    tens: 1,
    ones: 8,
    removeTens: 0,
    removeOnes: 5,
    options: [12, 13, 14],
    hint: "O cardume continua inteiro. Conte só os peixes separados.",
    observe: "Comece pelos cardumes. Depois conte os peixes separados.",
    abertura: "Muito bem!",
    errors: ["Quase! Conte o cardume e junte os peixes que ficaram."],
  },
  {
    id: "c9",
    number: 9,
    tens: 2,
    ones: 1,
    removeTens: 1,
    removeOnes: 0,
    options: [10, 11, 20],
    hint: "Veja quantos cardumes continuam no recife.",
    observe: "Olhe com atenção para os cardumes.",
    abertura: "Isso mesmo!",
    errors: ["Observe novamente. Quantos cardumes ainda estão no recife?"],
  },
  {
    id: "c10",
    number: 10,
    tens: 2,
    ones: 4,
    removeTens: 1,
    removeOnes: 2,
    options: [11, 12, 14],
    hint: "Conte os cardumes que ficaram e depois os peixes separados.",
    observe: "Comece pelos cardumes.",
    abertura: "Exato!",
    errors: ["Quase! Some os cardumes que ficaram com os peixes separados."],
  },
  {
    id: "c11",
    number: 11,
    tens: 3,
    ones: 5,
    removeTens: 2,
    removeOnes: 3,
    options: [12, 13, 22],
    hint: "Cada cardume que ficou vale 10 peixes.",
    observe: "Olhe primeiro os cardumes. Depois os peixes separados.",
    abertura: "Muito bem!",
    errors: ["Observe novamente. Conte os cardumes que permaneceram."],
  },
  {
    id: "c12",
    number: 12,
    tens: 4,
    ones: 6,
    removeTens: 2,
    removeOnes: 4,
    options: [20, 22, 24],
    hint: "Conte os cardumes que ficaram e depois os peixes que ficaram.",
    observe: "Conte com calma: primeiro os cardumes, depois os peixes.",
    abertura: "Isso mesmo!",
    errors: ["Quase! Quantos cardumes ainda estão no recife?"],
  },
];

/**
 * Microetapa de representação: andaimagem progressiva.
 * nível 0 = demonstração; 1 = uma lacuna; 2 = duas lacunas; 3 = três lacunas.
 */
type RepSeed = {
  level: 0 | 1 | 2 | 3;
  blanks: RepRole[];
  choices: number[];
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
  c1: {
    level: 0,
    blanks: [],
    choices: [],
    prompt: "Podemos mostrar com números: havia 5, saiu 1 e ficaram 4.",
    done: SINAL,
  },
  c2: {
    level: 0,
    blanks: [],
    choices: [],
    prompt: "Olhe: 6 mostra quantos havia, 2 mostra quantos saíram e 4 mostra quantos ficaram.",
    done: "Depois do sinal de igual mostramos quantos ficaram.",
  },
  c3: {
    level: 1,
    blanks: ["result"],
    choices: [4, 5, 6],
    prompt: "Qual número mostra quantos ficaram?",
    done: "Isso! O 5 mostra quantos ficaram.",
  },
  c4: {
    level: 1,
    blanks: ["initial"],
    choices: [4, 5, 9],
    prompt: "Qual número mostra quantos havia no começo?",
    done: "Isso! 9 − 4 = 5.",
  },
  c5: {
    level: 1,
    blanks: ["removed"],
    choices: [2, 10, 12],
    prompt: "Qual número mostra quantos saíram?",
    done: "Isso! 12 − 2 = 10.",
  },
  c6: {
    level: 1,
    blanks: ["initial"],
    choices: [3, 11, 14],
    prompt: "Qual número mostra quantos havia?",
    done: "Isso! 14 − 3 = 11.",
  },
  c7: {
    level: 1,
    blanks: ["result"],
    choices: [4, 12, 16],
    prompt: "Qual número mostra quantos ficaram?",
    done: "Isso! 16 − 4 = 12.",
  },
  c8: {
    level: 2,
    blanks: ["removed", "result"],
    choices: [5, 13],
    prompt: "Agora encontre os dois números que faltam.",
    done: "Muito bem! 18 − 5 = 13.",
  },
  c9: {
    level: 2,
    blanks: ["initial", "result"],
    choices: [21, 11],
    prompt: "Qual era a quantidade inicial? E quanto ficou?",
    done: "Muito bem! 21 − 10 = 11.",
  },
  c10: {
    level: 2,
    blanks: ["initial", "removed"],
    choices: [24, 12],
    prompt: "Mostre quantos havia e quantos saíram.",
    done: "Muito bem! 24 − 12 = 12.",
  },
  c11: {
    level: 3,
    blanks: ["initial", "removed", "result"],
    choices: [35, 23, 12],
    prompt: "Agora monte a operação que mostra o que aconteceu.",
    done: "Você mostrou com números o que aconteceu no recife.",
  },
  c12: {
    level: 3,
    blanks: ["initial", "removed", "result"],
    choices: [46, 24, 22],
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
  return {
    id: s.id,
    number: s.number,
    tens: s.tens,
    ones: s.ones,
    removeTens: s.removeTens,
    removeOnes: s.removeOnes,
    prompt:
      s.tens > 0
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
  };
});

export const tutorial = challenges[0]!;
export const scoredChallenges = challenges.filter((c) => c.number !== null);
export { grupo };
