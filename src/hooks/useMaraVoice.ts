import { useCallback, useEffect, useRef, useState } from "react";

import { audioSources } from "@/data/audio";
import type { Speech } from "@/types/game";

/**
 * Fala da Mara em pt-BR.
 * Prioridade: arquivo de áudio gravado. Fallback: SpeechSynthesis pt-BR.
 * Um áudio sempre interrompe o anterior; nunca há dois áudios simultâneos.
 */
export function useMaraVoice() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [finished, setFinished] = useState(false);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
  }, []);

  const speakWithSynthesis = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const brazilianVoice =
      voices.find((v) => v.lang === "pt-BR") ||
      voices.find((v) => v.lang.toLowerCase().startsWith("pt-br"));
    if (brazilianVoice) utterance.voice = brazilianVoice;
    utterance.lang = "pt-BR";
    utterance.rate = 0.92;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.onend = () => {
      setSpeaking(false);
      setFinished(true);
    };
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }, []);

  const speak = useCallback(
    (speech: Speech) => {
      stop();
      setFinished(false);
      const src = audioSources[speech.key];
      if (src) {
        const audio = new Audio(src);
        audioRef.current = audio;
        audio.onended = () => {
          setSpeaking(false);
          setFinished(true);
        };
        audio.onerror = () => {
          console.error(`Áudio indisponível para a fala "${speech.key}" (${src}).`);
          speakWithSynthesis(speech.text);
        };
        setSpeaking(true);
        void audio.play().catch(() => {
          speakWithSynthesis(speech.text);
        });
        return;
      }
      speakWithSynthesis(speech.text);
    },
    [speakWithSynthesis, stop],
  );

  useEffect(() => stop, [stop]);

  return { speak, stop, speaking, finished };
}
