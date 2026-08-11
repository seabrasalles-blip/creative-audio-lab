import type { BackgroundKey, MaraPose } from "@/data/assets";

/** Uma fala da Mara: texto sempre visível + áudio correspondente. */
export type Speech = {
  /** chave única, usada também para localizar o arquivo de áudio */
  key: string;
  text: string;
};

export type RepRole = "initial" | "removed" | "result";

/**
 * Opção numérica da representação simbólica.
 * O id é semântico e único: 24 − 12 = 12 tem dois valores iguais, e cada card
 * precisa de identidade própria para não se perder por chave duplicada.
 */
export type RepChoice = { id: string; value: number };

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
  choices: RepChoice[];
  prompt: Speech;
  done: Speech;
};

/** Observação ativa: a criança identifica a quantidade inicial antes da retirada. */
export type InitialCount = {
  /** pergunta principal — vai no card superior */
  question: Speech;
  /** mediação da Mara — vai no balão e no áudio, nunca repete a pergunta */
  mediation: Speech;
  options: number[];
  answer: number;
  correct: Speech;
  retry: Speech;
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
  /** presente apenas nos desafios com observação ativa (andaimagem inicial) */
  initialCount: InitialCount | null;
};

export type MetaQuestion = {
  id: string;
  question: Speech;
  options: { label: string; correct: boolean }[];
  correct: Speech;
  retry: Speech;
  /** situação concreta que permanece visível ao lado da pergunta */
  scene?: { tens: number; ones: number; removeTens: number; removeOnes: number };
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

export type Phase = "observe" | "initial-count" | "removing" | "question" | "solved" | "represent";
