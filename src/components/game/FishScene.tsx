import { AnimatePresence, motion } from "framer-motion";

import { animals } from "@/data/assets";
import type { Phase } from "@/types/game";

type SceneProps = {
  tens: number;
  ones: number;
  removeTens: number;
  removeOnes: number;
  phase: Phase;
  animationKey: number;
  highlightRemaining?: boolean;
  /** Composição condensada usada quando há dezenas (cardumes + unidades). */
  compact?: boolean;
};

const FISH_WIDTH = 74;

/** Cardumes grandes o bastante para a criança reconhecer os 10 peixes. */
function groupWidth(tens: number) {
  return tens >= 4 ? 170 : 190;
}

/**
 * Cena matemática: cardumes (dezenas) e peixes individuais (unidades).
 * Somente os assets fornecidos são usados.
 */
export function FishScene({
  tens,
  ones,
  removeTens,
  removeOnes,
  phase,
  animationKey,
  highlightRemaining = false,
  compact = false,
}: SceneProps) {
  const leaving = phase !== "observe";
  const GROUP_WIDTH = groupWidth(tens);

  const groups = Array.from({ length: tens }, (_, i) => ({
    id: `g${i}`,
    leaves: i >= tens - removeTens,
  }));
  const units = Array.from({ length: ones }, (_, i) => ({
    id: `u${i}`,
    leaves: i >= ones - removeOnes,
    src: i % 2 === 0 ? animals.fishTurquoise : animals.fishYellow,
  }));

  return (
    <div
      key={animationKey}
      className={`flex flex-col items-center justify-start ${compact ? "gap-2" : "gap-6"}`}
      style={{ zIndex: 10 }}
    >

      {tens > 0 && (
        <div className={`flex items-center justify-center ${compact ? "gap-6" : "gap-10"}`}>

          <AnimatePresence>
            {groups.map((g, index) =>
              leaving && g.leaves ? null : (
                <motion.img
                  key={g.id}
                  src={animals.fishGroup10}
                  alt="Cardume organizado com 10 peixes"
                  style={{ width: GROUP_WIDTH }}
                  className="h-auto object-contain"
                  initial={false}
                  animate={
                    highlightRemaining
                      ? { scale: 1.04, opacity: 1 }
                      : { scale: 1, opacity: 1 }
                  }
                  exit={{ x: 620, opacity: 0, transition: { duration: 1.1, delay: index * 0.1 } }}
                />
              ),
            )}
          </AnimatePresence>
        </div>
      )}

      {ones > 0 && (
        <div
          className={`flex flex-wrap items-center justify-center ${compact ? "max-w-[760px] gap-4" : "max-w-[900px] gap-6"}`}
        >

          <AnimatePresence>
            {units.map((u, index) =>
              leaving && u.leaves ? null : (
                <motion.img
                  key={u.id}
                  src={u.src}
                  alt="Peixe do recife"
                  style={{ width: FISH_WIDTH }}
                  className="h-auto object-contain"
                  initial={false}
                  animate={
                    highlightRemaining
                      ? { scale: 1.06, opacity: 1 }
                      : { scale: 1, opacity: 1 }
                  }
                  exit={{
                    x: 620,
                    opacity: 0,
                    transition: {
                      duration: 1.0,
                      delay: (removeTens > 0 ? 0.9 : 0) + index * 0.08,
                    },
                  }}
                />
              ),
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
