import { CSSProperties, KeyboardEvent, ReactNode, useEffect, useId, useLayoutEffect, useMemo, useRef } from "react";
import { useControllableState } from "./useControllableState";
import { createRipple, useLiquidPointer } from "./useLiquidPointer";

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export type SegmentOption<T extends string = string> = {
  value: T;
  label: ReactNode;
  disabled?: boolean;
  ariaLabel?: string;
  panelId?: string;
  tabId?: string;
};

export type SegmentedControlProps<T extends string = string> = {
  options: readonly SegmentOption<T>[];
  value?: T;
  defaultValue?: T;
  onValueChange?: (value: T) => void;
  ariaLabel: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  equalWidth?: boolean;
  disabled?: boolean;
  semantics?: "selection" | "tabs";
  style?: CSSProperties;
};

export function SegmentedControl<T extends string = string>({
  options,
  value,
  defaultValue = options.find((option) => !option.disabled)?.value,
  onValueChange,
  ariaLabel,
  className = "",
  size = "md",
  equalWidth = true,
  disabled = false,
  semantics = "selection",
  style,
}: SegmentedControlProps<T>) {
  if (defaultValue === undefined) throw new Error("SegmentedControl requires at least one enabled option.");
  const [selected, setSelected] = useControllableState(value, defaultValue, onValueChange);
  const group = useRef<HTMLDivElement>(null);
  const buttons = useRef(new Map<T, HTMLButtonElement>());
  const baseId = useId().replace(/:/g, "");
  const pointer = useLiquidPointer<HTMLDivElement>();

  const enabled = useMemo(() => options.filter((option) => !disabled && !option.disabled), [disabled, options]);
  const resolvedSelected = enabled.some((option) => option.value === selected) ? selected : enabled[0]?.value ?? selected;

  useEffect(() => {
    if (value === undefined && resolvedSelected !== selected) setSelected(resolvedSelected);
  }, [resolvedSelected, selected, setSelected, value]);

  useIsomorphicLayoutEffect(() => {
    const root = group.current;
    const target = buttons.current.get(resolvedSelected);
    if (!root || !target) return;
    const place = () => {
      const outer = root.getBoundingClientRect();
      const inner = target.getBoundingClientRect();
      root.style.setProperty("--lp-segment-x", `${inner.left - outer.left - root.clientLeft}px`);
      root.style.setProperty("--lp-segment-y", `${inner.top - outer.top - root.clientTop}px`);
      root.style.setProperty("--lp-segment-w", `${inner.width}px`);
      root.style.setProperty("--lp-segment-h", `${inner.height}px`);
      root.style.setProperty("--lp-segment-radius", getComputedStyle(target).borderRadius);
      root.dataset.ready = root.dataset.ready ? "true" : "placed";
      if (root.dataset.ready === "placed") requestAnimationFrame(() => { if (root.isConnected) root.dataset.ready = "true"; });
    };
    place();
    const observer = new ResizeObserver(place);
    observer.observe(root);
    buttons.current.forEach((button) => observer.observe(button));
    document.fonts?.ready.then(place);
    return () => observer.disconnect();
  }, [options, resolvedSelected]);

  const move = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const current = enabled.findIndex((option) => option.value === options[index]?.value);
    const delta = event.key === "ArrowRight" ? 1 : -1;
    const next = event.key === "Home" ? enabled[0] : event.key === "End" ? enabled.at(-1) : enabled[(current + delta + enabled.length) % enabled.length];
    if (!next) return;
    setSelected(next.value);
    buttons.current.get(next.value)?.focus();
  };

  return (
    <div
      {...pointer}
      ref={group}
      role={semantics === "tabs" ? "tablist" : "radiogroup"}
      aria-label={ariaLabel}
      className={`lp-segments ${className}`.trim()}
      data-size={size}
      data-equal={equalWidth || undefined}
      style={style}
    >
      {options.map((option, index) => {
        const active = option.value === resolvedSelected;
        return (
          <button
            key={option.value}
            ref={(node) => { if (node) buttons.current.set(option.value, node); else buttons.current.delete(option.value); }}
            id={option.tabId ?? `lp-segment-${baseId}-${index}`}
            type="button"
            role={semantics === "tabs" ? "tab" : "radio"}
            aria-checked={semantics === "selection" ? active : undefined}
            aria-selected={semantics === "tabs" ? active : undefined}
            aria-controls={semantics === "tabs" ? option.panelId : undefined}
            aria-label={option.ariaLabel}
            tabIndex={active ? 0 : -1}
            disabled={disabled || option.disabled}
            onClick={() => setSelected(option.value)}
            onKeyDown={(event) => move(event, index)}
            onPointerDown={createRipple}
          >
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
