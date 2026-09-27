import { expect, test } from "@playwright/test";

test("demo is interactive, keyboard accessible, and responsive", async ({ page }) => {
  await page.goto("/");
  const group = page.getByRole("radiogroup", { name: "Help sections" });
  await expect(group).toBeVisible();
  const support = group.getByRole("radio", { name: "Support" });
  await support.click();
  await expect(support).toHaveAttribute("aria-checked", "true");
  await support.press("ArrowRight");
  await expect(group.getByRole("radio", { name: "Community" })).toHaveAttribute("aria-checked", "true");
  await page.getByRole("switch", { name: "Atmosphere motion" }).click();
  await expect(page.getByRole("switch", { name: "Atmosphere motion" })).toHaveAttribute("aria-checked", "false");
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator("body")).not.toHaveCSS("overflow-x", "scroll");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  await page.setViewportSize({ width: 320, height: 720 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});
