import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const origin = process.env.LP_DEMO_URL ?? "http://127.0.0.1:4173";
const output = resolve("docs/images");
await mkdir(output, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto(origin, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);

for (const name of ["segmented", "button", "toggle"]) {
  const card = page.locator(`[data-shot="${name}"]`);
  const stage = card.locator(".stage");
  await stage.scrollIntoViewIfNeeded();
  if (name === "segmented") await stage.getByRole("radio", { name: "Layers" }).hover();
  if (name === "button") await stage.getByRole("button", { name: "Preview" }).hover();
  if (name === "toggle") await stage.getByRole("switch", { name: "Atmosphere motion" }).focus();
  const selector = name === "segmented" ? ".lp-segments" : name === "button" ? ".lp-button" : ".lp-toggle";
  const bounds = await stage.locator(selector).evaluateAll((elements) => {
    const rects = elements.map((element) => element.getBoundingClientRect());
    return {
      left: Math.min(...rects.map((rect) => rect.left)),
      top: Math.min(...rects.map((rect) => rect.top)),
      right: Math.max(...rects.map((rect) => rect.right)),
      bottom: Math.max(...rects.map((rect) => rect.bottom)),
    };
  });
  const padX = 64, padY = 52;
  await page.screenshot({
    path: resolve(output, `${name}.png`),
    clip: { x: bounds.left - padX, y: bounds.top - padY, width: bounds.right - bounds.left + padX * 2, height: bounds.bottom - bounds.top + padY * 2 },
  });
}

await browser.close();
