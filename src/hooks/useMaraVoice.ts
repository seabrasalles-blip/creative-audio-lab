import { useCallback, useEffect, useRef, useState } from "react";

import { audioSources } from "@/data/audio";
import { getMaraVoice, initMaraVoice, isSpeechSupported } from "@/lib/mara-voice";
import type { Speech } from "@/types/game";

/**
 * Fala da Mara em pt-BR.
 * Prioridade: arquivo de áudio gravado. Fallback: SpeechSynthesis pt-BR
 * com voz selecionada de forma consistente para toda a sessão.
 * Um áudio sempre interrompe o anterior; nunca há dois áudios simultâneos.
 */
export function useMaraVoice() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [finished, setFinished] = useState(false);

  // Carrega a lista de vozes assim que possível (sem iniciar nenhuma fala).
  useEffect(() => {
    initMaraVoice();
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    if (isSpeechSupported()) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
  }, []);

  const speakWithSynthesis = useCallback((text: string) => {
    if (!isSpeechSupported()) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = getMaraVoice();
    if (voice) utterance.voice = voice;
    utterance.lang = "pt-BR";
    utterance.rate = 0.9;
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
