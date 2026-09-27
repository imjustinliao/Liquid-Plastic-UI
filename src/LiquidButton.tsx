import { ButtonHTMLAttributes, forwardRef } from "react";
import { createRipple, useLiquidPointer } from "./useLiquidPointer";

export type LiquidButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "quiet";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
};

export const LiquidButton = forwardRef<HTMLButtonElement, LiquidButtonProps>(function LiquidButton(
  { className = "", variant = "secondary", size = "md", loading = false, disabled, children, type = "button", onPointerDown, onPointerMove, onPointerLeave, ...props },
  ref,
) {
  const pointer = useLiquidPointer<HTMLButtonElement>();
  return (
    <button
      {...props}
      ref={ref}
      type={type}
      className={`lp-button ${className}`.trim()}
      data-variant={variant}
      data-size={size}
      data-loading={loading || undefined}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      onPointerDown={(event) => {
        createRipple(event);
        onPointerDown?.(event);
      }}
      onPointerMove={(event) => {
        pointer.onPointerMove(event);
        onPointerMove?.(event);
      }}
      onPointerLeave={(event) => {
        pointer.onPointerLeave(event);
        onPointerLeave?.(event);
      }}
    >
      {loading && <span className="lp-spinner" aria-hidden="true" />}
      <span className="lp-button__content">{children}</span>
    </button>
  );
});
