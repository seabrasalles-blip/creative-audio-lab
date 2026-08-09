import { useEffect, useState } from "react";

/**
 * Camada amigável para orientação vertical.
 * Apenas cobre a atividade: o jogo continua montado e o progresso é preservado.
 */
export function OrientationGuard() {
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const check = () => {
      const portrait = window.innerHeight > window.innerWidth;
      setBlocked(portrait && window.innerWidth < 700);
    };
    check();
    window.addEventListener("resize", check);
    window.addEventListener("orientationchange", check);
    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", check);
    };
  }, []);

  if (!blocked) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center overflow-hidden bg-[var(--deep-sea)] px-6"
      style={{ zIndex: 100 }}
      role="dialog"
      aria-label="Gire a tela"
    >
      <div className="max-w-[420px] rounded-[28px] border-4 border-[var(--navy)] bg-[var(--cream)] px-7 py-6 text-center">
        <p className="font-body text-[24px] font-semibold text-[var(--navy)]" style={{ lineHeight: 1.4 }}>
          Para brincar melhor, vire a tela para o lado.
        </p>
      </div>
    </div>
  );
}
