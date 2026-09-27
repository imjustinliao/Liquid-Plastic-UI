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

test("press feedback is the pointer-origin hollow water wave", async ({ page }) => {
  await page.goto("/");
  const support = page.getByRole("radiogroup", { name: "Help sections" }).getByRole("radio", { name: "Support" });
  const box = await support.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box!.x + box!.width * .72, box!.y + box!.height * .42);
  await page.mouse.down();

  const ripple = support.locator(":scope > .lp-ripple");
  await expect(ripple).toHaveCount(1);
  const paint = await ripple.evaluate((node) => {
    const style = getComputedStyle(node);
    const wave = node.getBoundingClientRect();
    return {
      animationName: style.animationName,
      animationDuration: style.animationDuration,
      backgroundImage: style.backgroundImage,
      zIndex: style.zIndex,
      diameter: Number.parseFloat((node as HTMLElement).style.width),
      centerX: Number.parseFloat((node as HTMLElement).style.left) + Number.parseFloat((node as HTMLElement).style.width) / 2,
      rendered: wave.width > 0 && wave.height > 0,
    };
  });
  expect(paint.animationName).toBe("lp-water-ripple");
  expect(paint.animationDuration).toBe("0.52s");
  expect(paint.backgroundImage).toContain("38%");
  expect(paint.backgroundImage).toContain("46%");
  expect(paint.zIndex).toBe("0");
  expect(paint.diameter).toBe(Math.ceil(Math.hypot(box!.width, box!.height) * 2));
  expect(paint.centerX).toBeGreaterThan(box!.width / 2);
  expect(paint.rendered).toBe(true);

  await page.mouse.up();
  await expect(support).toHaveAttribute("aria-checked", "true");
  await expect(ripple).toHaveCount(0, { timeout: 900 });

  const settle = await page.getByRole("radiogroup", { name: "Help sections" }).evaluate((node) => {
    const style = getComputedStyle(node, "::before");
    return { duration: style.transitionDuration, easing: style.transitionTimingFunction };
  });
  expect(settle.duration).toContain("0.42s");
  expect(settle.easing).toContain("linear(");
});
