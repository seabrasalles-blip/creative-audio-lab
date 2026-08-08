import type { Challenge, RepRole } from "@/types/game";

type Seed = {
  id: string;
  number: number | null;
  tens: number;
  ones: number;
  removeTens: number;
  removeOnes: number;
  options: number[];
  hint: string;
  observe: string;
  correct: string;
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
    hint: "Conte somente os peixes que continuam no recife.",
    observe:
      "Primeiro veja quantos há. Depois observe quantos saem. Por fim, descubra quantos ficaram.",
    correct: "Isso mesmo! Havia 3 peixes, 1 saiu e ficaram 2.",
    errors: ["Observe novamente os peixes que ficaram no recife."],
  },
  {
    id: "c1",
    number: 1,
    tens: 0,
    ones: 5,
    removeTens: 0,
    removeOnes: 1,
    options: [3, 4, 5],
    hint: "Conte primeiro os que ficaram.",
    observe: "Havia 5 peixes no recife. Veja quantos saem.",
    correct: "Muito bem! Eram 5 peixes, saiu 1 e ficaram 4.",
    errors: ["Veja quantos saíram do grupo e conte de novo os que ficaram."],
  },
  {
    id: "c2",
    number: 2,
    tens: 0,
    ones: 6,
    removeTens: 0,
    removeOnes: 2,
    options: [4, 5, 6],
    hint: "Toque nos peixes com o olhar e conte um por um.",
    observe: "Havia 6 peixes no recife. Veja quantos saem.",
    correct: "Isso! Eram 6 peixes, saíram 2 e ficaram 4.",
    errors: ["Você encontrou quantos saíram. Agora descubra quantos ficaram."],
  },
  {
    id: "c3",
    number: 3,
    tens: 0,
    ones: 8,
    removeTens: 0,
    removeOnes: 3,
    options: [5, 6, 11],
    hint: "Na subtração, contamos apenas o que permaneceu.",
    observe: "Havia 8 peixes no recife. Veja quantos saem.",
    correct: "Exato! Eram 8 peixes, saíram 3 e ficaram 5.",
    errors: ["Conte somente os que permaneceram no recife."],
  },
  {
    id: "c4",
    number: 4,
    tens: 0,
    ones: 9,
    removeTens: 0,
    removeOnes: 4,
    options: [4, 5, 6],
    hint: "Olhe para o grupo que continua no recife.",
    observe: "Havia 9 peixes no recife. Veja quantos saem.",
    correct: "Isso mesmo! Eram 9 peixes, saíram 4 e ficaram 5.",
    errors: ["Observe novamente os peixes que ficaram."],
  },
  {
    id: "c5",
    number: 5,
    tens: 1,
    ones: 2,
    removeTens: 0,
    removeOnes: 2,
    options: [10, 11, 12],
    hint: "Lembre-se: cada cardume tem 10 peixes.",
    observe: "Havia 1 cardume e 2 peixes separados. Veja quantos saem.",
    correct: "Muito bem! Ficou 1 cardume inteiro: 10 peixes.",
    errors: ["Observe primeiro o cardume. Depois os peixes separados."],
  },
  {
    id: "c6",
    number: 6,
    tens: 1,
    ones: 4,
    removeTens: 0,
    removeOnes: 3,
    options: [10, 11, 12],
    hint: "Comece pelo cardume e depois conte os peixes separados.",
    observe: "Havia 1 cardume e 4 peixes separados. Veja quantos saem.",
    correct: "Isso! Ficou 1 cardume e 1 peixe: 11.",
    errors: ["Conte o cardume como 10 e junte os peixes que ficaram."],
  },
  {
    id: "c7",
    number: 7,
    tens: 1,
    ones: 6,
    removeTens: 0,
    removeOnes: 4,
    options: [11, 12, 13],
    hint: "Observe um cardume de cada vez.",
    observe: "Havia 1 cardume e 6 peixes separados. Veja quantos saem.",
    correct: "Exato! Ficou 1 cardume e 2 peixes: 12.",
    errors: ["Veja quais peixes separados ainda estão no recife."],
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
    observe: "Havia 1 cardume e 8 peixes separados. Veja quantos saem.",
    correct: "Muito bem! Ficou 1 cardume e 3 peixes: 13.",
    errors: ["Observe primeiro o cardume. Quantos peixes ficaram ao lado dele?"],
  },
  {
    id: "c9",
    number: 9,
    tens: 2,
    ones: 1,
    removeTens: 1,
    removeOnes: 0,
    options: [10, 11, 20],
    hint: "Um cardume inteiro saiu. Quantos cardumes ficaram?",
    observe: "Havia 2 cardumes e 1 peixe separado. Veja o que sai.",
    correct: "Isso mesmo! Ficou 1 cardume e 1 peixe: 11.",
    errors: ["Observe primeiro os cardumes. Quantos deles ainda estão no recife?"],
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
    observe: "Havia 2 cardumes e 4 peixes separados. Veja o que sai.",
    correct: "Exato! Ficou 1 cardume e 2 peixes: 12.",
    errors: ["Veja os cardumes que permaneceram e some os peixes separados."],
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
    observe: "Havia 3 cardumes e 5 peixes separados. Veja o que sai.",
    correct: "Muito bem! Ficou 1 cardume e 2 peixes: 12.",
    errors: ["Observe primeiro os cardumes. Depois conte os peixes separados."],
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
    observe: "Havia 4 cardumes e 6 peixes separados. Veja o que sai.",
    correct:
      "Isso mesmo! Havia 4 cardumes e 6 peixes. Saíram 2 cardumes e 4 peixes. Ficaram 2 cardumes e 2 peixes: 22.",
    errors: ["Observe primeiro os cardumes. Quantos deles ainda estão no recife?"],
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

const repSeeds: Record<string, RepSeed> = {
  tutorial: {
    level: 0,
    blanks: [],
    choices: [],
    prompt: "Podemos mostrar com números: havia 3, 1 saiu e ficaram 2.",
    done: "O sinal de menos mostra que uma quantidade foi retirada.",
  },
  c1: {
    level: 0,
    blanks: [],
    choices: [],
    prompt: "Podemos mostrar com números o que aconteceu. Havia 5 peixes, 1 saiu e ficaram 4.",
    done: "O sinal de menos mostra que uma quantidade foi retirada.",
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

function describe(tens: number, ones: number) {
  const parts: string[] = [];
  if (tens > 0) parts.push(tens === 1 ? "1 cardume" : `${tens} cardumes`);
  if (ones > 0) parts.push(ones === 1 ? "1 peixe" : `${ones} peixes`);
  return parts.join(" e ");
}

export const challenges: Challenge[] = seeds.map((s) => {
  const total = s.tens * 10 + s.ones;
  const removed = s.removeTens * 10 + s.removeOnes;
  return {
    id: s.id,
    number: s.number,
    tens: s.tens,
    ones: s.ones,
    removeTens: s.removeTens,
    removeOnes: s.removeOnes,
    prompt:
      s.tens > 0
        ? `Havia ${describe(s.tens, s.ones)}. Saíram ${describe(
            s.removeTens,
            s.removeOnes,
          )}. Quantos peixes ficaram?`
        : `Havia ${total} peixes. Saíram ${removed}. Quantos ficaram?`,
    options: s.options,
    answer: total - removed,
    hint: { key: `${s.id}-hint`, text: s.hint },
    observe: { key: `${s.id}-observe`, text: s.observe },
    correct: { key: `${s.id}-correct`, text: s.correct },
    errors: s.errors.map((text, i) => ({ key: `${s.id}-error-${i + 1}`, text })),
    representation: {
      level: repSeeds[s.id]!.level,
      initial: total,
      removed,
      result: total - removed,
      blanks: repSeeds[s.id]!.blanks,
      choices: repSeeds[s.id]!.choices,
      prompt: { key: `${s.id}-rep`, text: repSeeds[s.id]!.prompt },
      done: { key: `${s.id}-rep-done`, text: repSeeds[s.id]!.done },
    },
  };
});

export const tutorial = challenges[0]!;
export const scoredChallenges = challenges.filter((c) => c.number !== null);
