// Registro único de assets ilustrados do projeto.
// Todos os visuais vêm EXCLUSIVAMENTE destes arquivos fornecidos.
// Nenhuma imagem é gerada, desenhada em CSS/SVG ou buscada em fontes externas.

import fishGroup10 from "@/assets/animals/fish-group-10.png.asset.json";
import fishTurquoise from "@/assets/animals/fish-turquoise.png.asset.json";
import fishYellow from "@/assets/animals/fish-yellow.png.asset.json";
import seahorse from "@/assets/animals/seahorse.png.asset.json";
import starfish from "@/assets/animals/starfish.png.asset.json";

import bgActivity from "@/assets/backgrounds/bg-activity.png.asset.json";
import bgFinal from "@/assets/backgrounds/bg-final.png.asset.json";
import bgReflection from "@/assets/backgrounds/bg-reflection.png.asset.json";
import bgTransitionCave from "@/assets/backgrounds/bg-transition-cave.png.asset.json";
import bgTransitionTen from "@/assets/backgrounds/bg-transition-ten.png.asset.json";
import coverTitle from "@/assets/backgrounds/cover-title.png.asset.json";

import btnAudio from "@/assets/buttons/btn-audio.png.asset.json";
import btnBack from "@/assets/buttons/btn-back.png.asset.json";
import btnHint from "@/assets/buttons/btn-hint.png.asset.json";
import btnNext from "@/assets/buttons/btn-next.png.asset.json";
import btnRestart from "@/assets/buttons/btn-restart.png.asset.json";
import btnStart from "@/assets/buttons/btn-start.png.asset.json";

import cave from "@/assets/environment/cave.png.asset.json";
import coral from "@/assets/environment/coral.png.asset.json";
import rocks from "@/assets/environment/rocks.png.asset.json";
import seaweed from "@/assets/environment/seaweed.png.asset.json";
import shell from "@/assets/environment/shell.png.asset.json";

import maraCelebrating from "@/assets/mara/mara-celebrating.png.asset.json";
import maraFeedback from "@/assets/mara/mara-feedback.png.asset.json";
import maraNeutral from "@/assets/mara/mara-neutral.png.asset.json";
import maraPointing from "@/assets/mara/mara-pointing.png.asset.json";
import maraPresenting from "@/assets/mara/mara-presenting.png.asset.json";
import maraPresenting1 from "@/assets/mara/mara-presenting1.png.asset.json";
import maraThinking from "@/assets/mara/mara-thinking.png.asset.json";

export const mara = {
  neutral: maraNeutral.url,
  presenting: maraPresenting.url,
  presentingAlt: maraPresenting1.url,
  pointing: maraPointing.url,
  thinking: maraThinking.url,
  celebrating: maraCelebrating.url,
  feedback: maraFeedback.url,
  // ASSETS AUSENTES: mara-observing.png e mara-encouraging.png não foram
  // fornecidos. Nenhuma imagem substituta foi criada: reutilizamos abaixo
  // poses oficiais existentes até que os arquivos sejam enviados.
  observing: maraThinking.url,
  encouraging: maraFeedback.url,
} as const;

export type MaraPose = keyof typeof mara;

export const animals = {
  fishGroup10: fishGroup10.url,
  fishTurquoise: fishTurquoise.url,
  fishYellow: fishYellow.url,
  seahorse: seahorse.url,
  starfish: starfish.url,
} as const;

export const backgrounds = {
  cover: coverTitle.url,
  activity: bgActivity.url,
  transitionTen: bgTransitionTen.url,
  transitionCave: bgTransitionCave.url,
  reflection: bgReflection.url,
  final: bgFinal.url,
} as const;

export type BackgroundKey = keyof typeof backgrounds;

export const buttons = {
  start: btnStart.url,
  next: btnNext.url,
  back: btnBack.url,
  restart: btnRestart.url,
  hint: btnHint.url,
  audio: btnAudio.url,
} as const;

export type ButtonKey = keyof typeof buttons;

export const environment = {
  coral: coral.url,
  seaweed: seaweed.url,
  shell: shell.url,
  rocks: rocks.url,
  cave: cave.url,
} as const;

export const preloadList: string[] = [
  ...Object.values(mara),
  ...Object.values(animals),
  ...Object.values(backgrounds),
  ...Object.values(buttons),
  ...Object.values(environment),
];
