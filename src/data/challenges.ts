import type { Challenge } from "@/types/game";

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
  };
});

export const tutorial = challenges[0]!;
export const scoredChallenges = challenges.filter((c) => c.number !== null);
