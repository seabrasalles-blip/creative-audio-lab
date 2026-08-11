import { challenges } from "@/data/challenges";
import type { MetaQuestion, Step } from "@/types/game";

const byId = (id: string) => challenges.find((c) => c.id === id)!;

const metaQuestions: MetaQuestion[] = [
  {
    id: "meta-op",
    question: {
      key: "meta-op",
      text: "Havia 8 peixes e 3 saíram. Qual operação mostra o que aconteceu?",
    },
    options: [
      { label: "8 − 3 = 5", correct: true },
      { label: "8 + 3 = 11", correct: false },
      { label: "5 − 3 = 2", correct: false },
    ],
    correct: {
      key: "meta-op-correct",
      text: "Isso! 8 − 3 = 5 mostra quantos havia, quantos saíram e quantos ficaram.",
    },
    retry: {
      key: "meta-op-retry",
      text: "Olhe a cena: comece pela quantidade que havia e veja quantos saíram.",
    },
    scene: { tens: 0, ones: 8, removeTens: 0, removeOnes: 3 },
  },
  {
    id: "meta-role",
    question: { key: "meta-role", text: "Na operação 14 − 3 = 11, o que o número 3 mostra?" },
    options: [
      { label: "Quantos havia.", correct: false },
      { label: "Quantos saíram.", correct: true },
      { label: "Quantos ficaram.", correct: false },
    ],
    correct: {
      key: "meta-role-correct",
      text: "Isso! O número depois do sinal de menos mostra quantos saíram.",
    },
    retry: {
      key: "meta-role-retry",
      text: "Veja: 14 mostra quantos havia e 11 mostra quantos ficaram.",
    },
  },
];

export const flow: Step[] = [
  { kind: "cover", id: "cover" },
  {
    kind: "intro",
    id: "intro",
    background: "activity",
    pose: "presenting",
    speech: {
      key: "mara-intro",
      text: "Olá! Eu sou a Mara. Vamos observar o recife e descobrir quantos animais ficam quando alguns saem?",
    },
  },
  // MOMENTO 1 — retirada com pequenas quantidades
  { kind: "challenge", id: "c1", challenge: byId("c1") },
  { kind: "challenge", id: "c2", challenge: byId("c2") },
  { kind: "challenge", id: "c3", challenge: byId("c3") },
  {
    kind: "transition",
    id: "t-ten",
    background: "transitionTen",
    pose: "pointing",
    showTenGroup: true,
    speech: {
      key: "mara-transition-ten",
      text: "Agora há mais peixes! Para facilitar a contagem, alguns se organizaram em grupos de 10. Este grupo tem 10 peixes.",
    },
  },
  // MOMENTO 2 — grupos de 10 e números maiores
  { kind: "challenge", id: "c5", challenge: byId("c5") },
  { kind: "challenge", id: "c7", challenge: byId("c7") },
  {
    kind: "transition",
    id: "t-cave",
    background: "transitionCave",
    pose: "observing",
    demo: { tens: 2, ones: 3, removeTens: 1, removeOnes: 1 },
    speech: {
      key: "mara-transition-groups",
      text: "Agora pode sair um grupo de 10 inteiro e também alguns peixes separados. Ficaram 1 grupo de 10 e 2 peixes: 12.",
    },
  },
  // MOMENTO 3 — retirada de grupos de 10 e peixes separados
  { kind: "challenge", id: "c9", challenge: byId("c9") },
  { kind: "challenge", id: "c10", challenge: byId("c10") },
  { kind: "challenge", id: "c11", challenge: byId("c11") },
  {
    kind: "summary",
    id: "summary",
    speech: {
      key: "mara-summary",
      text: "Primeiro observamos quantos peixes havia. Depois vimos quantos saíram. Por fim descobrimos quantos ficaram.",
    },
  },
  ...metaQuestions.map((meta) => ({ kind: "meta" as const, id: meta.id, meta })),
  {
    kind: "final",
    id: "final",
    speech: {
      key: "mara-final",
      text: "Você descobriu quantos animais ficaram depois que uma parte saiu. Isso é subtração!",
    },
  },
];

/** Desafios ativos no percurso (fonte única do indicador de progresso). */
export const activeChallengeIds = flow
  .filter((step) => step.kind === "challenge")
  .map((step) => step.id);

export const totalChallenges = activeChallengeIds.length;
