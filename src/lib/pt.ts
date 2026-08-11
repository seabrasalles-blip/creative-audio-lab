/**
 * Helpers de concordância de número e verbo em pt-BR.
 * Fonte única para todos os textos da atividade: enunciados, falas, dicas,
 * feedbacks, representação e telas de síntese.
 *
 * Regra importante: "havia" é invariável ("Havia 1 peixe" / "Havia 6 peixes").
 */

export type Grupo = { text: string; singular: boolean };

export function peixes(n: number): string {
  return n === 1 ? "1 peixe" : `${n} peixes`;
}

/**
 * O asset com exatamente 10 peixes é sempre nomeado como "grupo de 10 peixes".
 * "Cardume" não é usado como unidade matemática.
 */
export function gruposDez(n: number): string {
  return n === 1 ? "1 grupo de 10 peixes" : `${n} grupos de 10 peixes`;
}

/** Descreve uma quantidade em grupos de 10 + peixes e informa se o verbo vai no singular. */
export function grupo(tens: number, ones: number): Grupo {
  const parts: string[] = [];
  if (tens > 0) parts.push(gruposDez(tens));
  if (ones > 0 || tens === 0) parts.push(peixes(ones));
  const singular = parts.length === 1 && (tens > 0 ? tens === 1 : ones === 1);
  return { text: parts.join(" e "), singular };
}

/** "Havia 1 peixe" / "Havia 6 peixes" / "Havia 2 grupos de 10 peixes e 4 peixes" */
export function havia(tens: number, ones: number): string {
  return `Havia ${grupo(tens, ones).text}`;
}

/** "Saiu 1 peixe" / "Saíram 2 peixes" / "Saiu 1 grupo de 10 peixes" */
export function saiu(tens: number, ones: number): string {
  const g = grupo(tens, ones);
  return `${g.singular ? "Saiu" : "Saíram"} ${g.text}`;
}

/** Forma posposta: "1 peixe saiu." / "2 peixes saíram." */
export function saiuPosposto(tens: number, ones: number): string {
  const g = grupo(tens, ones);
  return `${g.text} ${g.singular ? "saiu" : "saíram"}`;
}

/** "Ficou 1 peixe" / "Ficaram 2 peixes" / "Ficou 1 grupo de 10 peixes e 2 peixes" */
export function ficou(tens: number, ones: number): string {
  const g = grupo(tens, ones);
  return `${g.singular ? "Ficou" : "Ficaram"} ${g.text}`;
}

/** Formas apenas numéricas, para retomadas curtas no feedback de acerto. */
export function saiuNum(n: number): string {
  return n === 1 ? "saiu 1" : `saíram ${n}`;
}

export function ficouNum(n: number): string {
  return n === 1 ? "ficou 1" : `ficaram ${n}`;
}

/** Retomada do acerto: "Isso mesmo! Havia 5, saiu 1 e ficaram 4." */
export function retomada(abertura: string, initial: number, removed: number, result: number) {
  return `${abertura} Havia ${initial}, ${saiuNum(removed)} e ${ficouNum(result)}.`;
}
