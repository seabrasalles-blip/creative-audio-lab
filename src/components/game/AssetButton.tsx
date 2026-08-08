import type { ButtonHTMLAttributes } from "react";

import { buttons, type ButtonKey } from "@/data/assets";
import { cn } from "@/lib/utils";

type AssetButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asset: ButtonKey;
  label: string;
  width?: number;
};

/**
 * Botão ilustrado oficial: a aparência vem SEMPRE do PNG fornecido.
 * O elemento HTML fornece acessibilidade, foco, disabled e clique.
 */
export function AssetButton({
  asset,
  label,
  width = 200,
  className,
  ...props
}: AssetButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "cursor-pointer bg-transparent p-0 transition-transform duration-150",
        "hover:scale-[1.03] active:scale-[0.97]",
        "focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--cream)]",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100",
        className,
      )}
      {...props}
    >
      <img
        src={buttons[asset]}
        alt=""
        style={{ width, height: "auto" }}
        className="block h-auto select-none object-contain"
        draggable={false}
      />
    </button>
  );
}
