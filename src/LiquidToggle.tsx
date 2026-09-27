import { ButtonHTMLAttributes, forwardRef } from "react";
import { useControllableState } from "./useControllableState";
import { createRipple, useLiquidPointer } from "./useLiquidPointer";

export type LiquidSwitchProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
};

export const LiquidSwitch = forwardRef<HTMLButtonElement, LiquidSwitchProps>(function LiquidSwitch(
  { checked, defaultChecked = false, onCheckedChange, label, className = "", disabled, onPointerDown, onPointerMove, onPointerLeave, onClick, ...props },
  ref,
) {
  const [active, setActive] = useControllableState(checked, defaultChecked, onCheckedChange);
  const pointer = useLiquidPointer<HTMLButtonElement>();
  return (
    <button
      {...props}
      ref={ref}
      type="button"
      role="switch"
      aria-checked={active}
      aria-label={props["aria-label"] ?? label}
      className={`lp-toggle ${className}`.trim()}
      disabled={disabled}
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
      onClick={(event) => {
        setActive(!active);
        onClick?.(event);
      }}
    >
      <span className="lp-toggle__track" aria-hidden="true"><span className="lp-toggle__thumb" /></span>
      {label && <span className="lp-toggle__label">{label}</span>}
    </button>
  );
});
