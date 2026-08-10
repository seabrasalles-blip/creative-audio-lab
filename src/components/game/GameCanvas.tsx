import type { ReactNode } from "react";

import { backgrounds, type BackgroundKey } from "@/data/assets";
import { useCanvasScale } from "@/hooks/useCanvasScale";

export function GameCanvas({
  background,
  children,
}: {
  background: BackgroundKey;
  children: ReactNode;
}) {
  const { scale, width, height, containerRef } = useCanvasScale();

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex items-center justify-center overflow-hidden bg-[var(--deep-sea)]"
    >
      <div
        style={{ width, height, transform: `scale(${scale})` }}
        className="relative origin-center overflow-hidden"
      >
        <img
          src={backgrounds[background]}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ zIndex: 0 }}
          draggable={false}
        />
        {children}
      </div>
    </div>
  );
}
