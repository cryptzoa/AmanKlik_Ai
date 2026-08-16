import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test("critical navigation and recovery remain usable", async ({ page }) => {
  await page.goto("/scan");
  await expect(page.getByRole("heading", {
    name: /Apa yang ingin kamu periksa/i,
  })).toBeVisible();
  await expect(page.getByRole("tab", { name: "Pesan" })).toBeVisible();

  await page.getByRole("link", { name: "Tindakan", exact: true }).click();
  await expect(page).toHaveURL(/\/respond$/);
  await expect(page.getByRole("heading", { name: /Sudah terlanjur/i }))
    .toBeVisible();
  await expect(page.locator("[data-transition-overlay]"))
    .toHaveAttribute("data-transition-state", "idle");

  await page.goto("/result/bukan-uuid");
  await expect(page.getByRole("heading", { name: /Jalurnya berhenti/i }))
    .toBeVisible();
  await expect(page.getByRole("link", { name: /Mulai periksa/i })).toBeVisible();
});

test("mobile scan and simulator reflow without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  for (const route of ["/scan", "/simulator"]) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await expect(page.locator(".product-scope")).toBeVisible();
    const width = await page.evaluate(() => ({
      client: document.documentElement.clientWidth,
      scroll: document.documentElement.scrollWidth,
    }));
    expect(width.scroll, `${route} memiliki horizontal overflow`).toBe(
      width.client,
    );
  }
});

test("reduced motion keeps the task transition short and usable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/scan");

  await page.getByRole("link", { name: "Tindakan", exact: true }).click();

  await expect(page).toHaveURL(/\/respond$/);
  await expect(page.getByRole("heading", { name: /Sudah terlanjur/i }))
    .toBeVisible();
  await expect(page.locator("[data-transition-overlay]"))
    .toHaveAttribute("data-transition-state", "idle");
});
