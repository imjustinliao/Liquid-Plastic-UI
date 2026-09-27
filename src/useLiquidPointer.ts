import { PointerEvent as ReactPointerEvent, useCallback, useEffect, useRef } from "react";

type LiquidElement = HTMLElement & { dataset: DOMStringMap };

export function useLiquidPointer<T extends LiquidElement>() {
  const frame = useRef(0);
  const point = useRef({ x: 50, y: 50, target: null as T | null });

  const paint = useCallback(() => {
    frame.current = 0;
    const { target, x, y } = point.current;
    if (!target) return;
    target.style.setProperty("--lp-light-x", `${x}%`);
    target.style.setProperty("--lp-light-y", `${y}%`);
    target.dataset.liquidLit = "true";
  }, []);

  const onPointerMove = useCallback((event: ReactPointerEvent<T>) => {
    if (event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    point.current = {
      target: event.currentTarget,
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    };
    if (!frame.current) frame.current = requestAnimationFrame(paint);
  }, [paint]);

  const onPointerLeave = useCallback((event: ReactPointerEvent<T>) => {
    event.currentTarget.removeAttribute("data-liquid-lit");
    point.current.target = null;
  }, []);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);
  return { onPointerMove, onPointerLeave };
}

export function createRipple(event: ReactPointerEvent<HTMLElement>) {
  if (event.button !== 0 || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const host = event.currentTarget;
  const rect = host.getBoundingClientRect();
  const size = Math.ceil(Math.hypot(rect.width, rect.height) * 2);
  const ripple = document.createElement("span");
  ripple.className = "lp-ripple";
  ripple.setAttribute("aria-hidden", "true");
  ripple.style.cssText = `width:${size}px;height:${size}px;left:${event.clientX - rect.left - size / 2}px;top:${event.clientY - rect.top - size / 2}px`;
  host.querySelector(":scope > .lp-ripple")?.remove();
  host.append(ripple);
  const remove = () => ripple.remove();
  ripple.addEventListener("animationend", remove, { once: true });
  window.setTimeout(remove, 700);
}
