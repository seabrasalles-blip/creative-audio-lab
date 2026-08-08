import { challenges } from "@/data/challenges";
import type { MetaQuestion, Step } from "@/types/game";

const byId = (id: string) => challenges.find((c) => c.id === id)!;

const metaQuestions: MetaQuestion[] = [
  {
    id: "m1",
    question: { key: "meta-1", text: "O que ajudou você a descobrir as respostas?" },
    options: [
      { label: "Observar os cardumes e os peixes separados.", correct: true },
      { label: "Escolher o maior número.", correct: false },
      { label: "Contar apenas os que saíram.", correct: false },
    ],
    correct: {
      key: "meta-1-correct",
      text: "Sim! Olhar os cardumes e depois os peixes separados organiza a contagem.",
    },
    retry: {
      key: "meta-1-retry",
      text: "Pense no que você fez em cada desafio antes de responder.",
    },
  },
  {
    id: "m2",
    question: { key: "meta-2", text: "O que um cardume organizado representa?" },
    options: [
      { label: "10 peixes.", correct: true },
      { label: "2 peixes.", correct: false },
      { label: "1 peixe.", correct: false },
    ],
    correct: { key: "meta-2-correct", text: "Isso! Cada cardume organizado tem 10 peixes." },
    retry: { key: "meta-2-retry", text: "Lembre-se do cardume que você viu se formar." },
  },
  {
    id: "m3",
    question: { key: "meta-3", text: "O que fazemos em uma situação de retirada?" },
    options: [
      { label: "Descobrimos quanto restou.", correct: true },
      { label: "Aumentamos a quantidade.", correct: false },
      { label: "Juntamos dois grupos.", correct: false },
    ],
    correct: {
      key: "meta-3-correct",
      text: "Exato! Quando uma parte sai, descobrimos quanto ficou.",
    },
    retry: { key: "meta-3-retry", text: "Pense nos peixes que saíram e nos que ficaram." },
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
  { kind: "challenge", id: "tutorial", challenge: byId("tutorial") },
  { kind: "challenge", id: "c1", challenge: byId("c1") },
  { kind: "challenge", id: "c2", challenge: byId("c2") },
  { kind: "challenge", id: "c3", challenge: byId("c3") },
  { kind: "challenge", id: "c4", challenge: byId("c4") },
  {
    kind: "transition",
    id: "t-ten",
    background: "transitionTen",
    pose: "pointing",
    showTenGroup: true,
    speech: {
      key: "mara-transition-ten",
      text: "Os peixes formaram cardumes! Cada cardume organizado tem 10 peixes.",
    },
  },
  { kind: "challenge", id: "c5", challenge: byId("c5") },
  { kind: "challenge", id: "c6", challenge: byId("c6") },
  { kind: "challenge", id: "c7", challenge: byId("c7") },
  { kind: "challenge", id: "c8", challenge: byId("c8") },
  {
    kind: "transition",
    id: "t-cave",
    background: "transitionCave",
    pose: "observing",
    demo: { tens: 2, ones: 3, removeTens: 1, removeOnes: 1 },
    speech: {
      key: "mara-transition-groups",
      text: "Agora podem sair cardumes inteiros e também alguns peixes separados. Ficaram 1 cardume e 2 peixes: 12.",
    },
  },
  { kind: "challenge", id: "c9", challenge: byId("c9") },
  { kind: "challenge", id: "c10", challenge: byId("c10") },
  { kind: "challenge", id: "c11", challenge: byId("c11") },
  { kind: "challenge", id: "c12", challenge: byId("c12") },
  {
    kind: "summary",
    id: "summary",
    speech: {
      key: "mara-summary",
      text: "Subtrair é descobrir quanto resta quando uma parte é retirada.",
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
