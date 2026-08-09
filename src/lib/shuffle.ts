/**
 * Embaralhamento determinístico por chave: a mesma chave produz sempre a mesma
 * ordem, então as alternativas não mudam de lugar entre renders nem após um erro.
 */
function hash(key: string): number {
  let h = 2166136261;
  for (let i = 0; i < key.length; i += 1) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function stableShuffle<T>(items: T[], key: string): T[] {
  const out = [...items];
  let seed = hash(key) || 1;
  const next = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(next() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}
