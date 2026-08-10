/**
 * Seleção central da voz da Mara (Web Speech API).
 *
 * A Web Speech API NÃO expõe o gênero da voz. A preferência por uma voz
 * feminina é apenas uma estratégia de prioridade sobre nomes conhecidos:
 * usamos preferencialmente uma voz pt-BR previamente identificada como
 * feminina quando disponível; caso contrário, a melhor voz pt-BR (ou pt,
 * ou padrão) disponível no dispositivo.
 */

/** Lista configurável — adicione nomes conforme as vozes vistas nos testes. */
export const preferredFemaleVoiceNames: string[] = [
  "Luciana", // macOS/iOS pt-BR
  "Francisca",
  "Maria", // Microsoft Maria (pt-BR)
  "Microsoft Maria",
  "Microsoft Francisca",
  "Microsoft Thalita",
  "Thalita",
  "Google português do Brasil",
  "Fernanda",
  "Vitória",
  "Vitoria",
  "Camila",
  "Helena",
  "Female",
];

const isDev = import.meta.env?.DEV === true;

const matchesPreferred = (voice: SpeechSynthesisVoice) => {
  const name = voice.name.toLowerCase();
  return preferredFemaleVoiceNames.some((preferred) => name.includes(preferred.toLowerCase()));
};

const isPtBr = (voice: SpeechSynthesisVoice) => voice.lang.toLowerCase().replace("_", "-") === "pt-br";
const isPt = (voice: SpeechSynthesisVoice) => voice.lang.toLowerCase().startsWith("pt");

/** Estratégia de prioridade + fallback. Nunca bloqueia a fala. */
export function selectMaraVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;
  const ptBr = voices.filter(isPtBr);

  // P1: pt-BR exata + nome preferido (preferindo voz local, mais estável).
  const preferredPtBr = ptBr.filter(matchesPreferred);
  const localPreferred = preferredPtBr.find((v) => v.localService);
  if (localPreferred) return localPreferred;
  // P2: outra pt-BR pela lista de nomes preferidos.
  if (preferredPtBr[0]) return preferredPtBr[0];
  // P3: qualquer pt-BR.
  if (ptBr[0]) return ptBr[0];
  // P4: qualquer português.
  const pt = voices.filter(isPt);
  if (pt.filter(matchesPreferred)[0]) return pt.filter(matchesPreferred)[0]!;
  if (pt[0]) return pt[0];
  // P5: voz padrão do navegador.
  return voices.find((v) => v.default) ?? voices[0] ?? null;
}

let cachedVoice: SpeechSynthesisVoice | null = null;
let cachedSignature = "";
let listenerAttached = false;

export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function refreshVoice(): SpeechSynthesisVoice | null {
  if (!isSpeechSupported()) return null;
  const voices = window.speechSynthesis.getVoices();
  const signature = voices.map((v) => `${v.name}|${v.lang}`).join(";");
  if (signature === cachedSignature) return cachedVoice;
  cachedSignature = signature;
  cachedVoice = selectMaraVoice(voices);
  if (isDev && voices.length > 0) {
    console.table(
      voices.map((v) => ({
        name: v.name,
        lang: v.lang,
        default: v.default,
        localService: v.localService,
      })),
    );
    console.info(
      `[Mara Voice] Selected: ${cachedVoice?.name ?? "(voz padrão do navegador)"} — ${cachedVoice?.lang ?? "n/a"}`,
    );
  }
  return cachedVoice;
}

/** Inicializa o carregamento das vozes e escuta "voiceschanged" uma única vez. */
export function initMaraVoice(): void {
  if (!isSpeechSupported()) return;
  refreshVoice();
  if (!listenerAttached) {
    listenerAttached = true;
    window.speechSynthesis.addEventListener?.("voiceschanged", () => {
      // Atualiza apenas a voz das PRÓXIMAS falas; nunca interrompe a atual.
      refreshVoice();
    });
  }
}

/** Voz da Mara para a sessão (mesma voz em todo o app). */
export function getMaraVoice(): SpeechSynthesisVoice | null {
  if (!isSpeechSupported()) return null;
  if (!cachedVoice) return refreshVoice();
  return cachedVoice;
}
