import { useEffect, useRef, useState, type RefObject } from "react";

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 675;

/**
 * Escala proporcional do canvas 1200x675 dentro do container real disponível
 * (viewport, iframe ou container do Portal), sem scroll e mantendo 16:9.
 */
export function useCanvasScale(): {
  scale: number;
  width: number;
  height: number;
  containerRef: RefObject<HTMLDivElement | null>;
} {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;

    const update = () => {
      const rect = el?.getBoundingClientRect();
      const availableWidth = rect?.width || window.innerWidth;
      const availableHeight = rect?.height || window.innerHeight;
      const next = Math.min(availableWidth / CANVAS_WIDTH, availableHeight / CANVAS_HEIGHT);
      if (next > 0) setScale(next);
    };

    update();

    let ro: ResizeObserver | undefined;
    if (el && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(update);
      ro.observe(el);
    }
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return { scale, width: CANVAS_WIDTH, height: CANVAS_HEIGHT, containerRef };
}
