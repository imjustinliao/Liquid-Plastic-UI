import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(cleanup);

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(globalThis, "ResizeObserver", { value: ResizeObserverMock, writable: true });
Object.defineProperty(document, "fonts", { value: { ready: Promise.resolve() }, configurable: true });
Object.defineProperty(globalThis, "matchMedia", {
  value: (query: string) => ({ matches: false, media: query, addEventListener() {}, removeEventListener() {} }),
  writable: true,
});
