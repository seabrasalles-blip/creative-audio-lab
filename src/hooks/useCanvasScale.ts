import { useEffect, useState } from "react";

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 675;

/** Escala proporcional do canvas 1200x675 dentro da viewport, sem scroll. */
export function useCanvasScale() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      setScale(
        Math.min(window.innerWidth / CANVAS_WIDTH, window.innerHeight / CANVAS_HEIGHT),
      );
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return { scale, width: CANVAS_WIDTH, height: CANVAS_HEIGHT };
}
