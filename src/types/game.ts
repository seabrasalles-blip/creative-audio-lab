import type { BackgroundKey, MaraPose } from "@/data/assets";

/** Uma fala da Mara: texto sempre visível + áudio correspondente. */
export type Speech = {
  /** chave única, usada também para localizar o arquivo de áudio */
  key: string;
  text: string;
};

export type RepRole = "initial" | "removed" | "result";

/** Microetapa de representação simbólica após o acerto (andaimagem progressiva). */
export type Representation = {
  /** 0 = demonstração, 1 = uma lacuna, 2 = duas lacunas, 3 = três lacunas */
  level: 0 | 1 | 2 | 3;
  initial: number;
  removed: number;
  result: number;
  /** lacunas na ordem inicial → retirada → restante */
  blanks: RepRole[];
  /** números disponíveis para clique */
  choices: number[];
  prompt: Speech;
  done: Speech;
};

export type Challenge = {
  id: string;
  /** número do desafio pontuado (1..12); null para tutorial/demonstração */
  number: number | null;
  tens: number;
  ones: number;
  removeTens: number;
  removeOnes: number;
  prompt: string;
  options: number[];
  answer: number;
  hint: Speech;
  observe: Speech;
  correct: Speech;
  errors: Speech[];
  representation: Representation;
};

export type MetaQuestion = {
  id: string;
  question: Speech;
  options: { label: string; correct: boolean }[];
  correct: Speech;
  retry: Speech;
};

export type Step =
  | { kind: "cover"; id: string }
  | { kind: "intro"; id: string; background: BackgroundKey; pose: MaraPose; speech: Speech }
  | { kind: "challenge"; id: string; challenge: Challenge }
  | {
      kind: "transition";
      id: string;
      background: BackgroundKey;
      pose: MaraPose;
      speech: Speech;
      showTenGroup?: boolean;
      demo?: { tens: number; ones: number; removeTens: number; removeOnes: number };
    }
  | { kind: "summary"; id: string; speech: Speech }
  | { kind: "meta"; id: string; meta: MetaQuestion }
  | { kind: "final"; id: string; speech: Speech };

export type Phase = "observe" | "removing" | "question" | "solved" | "represent";
