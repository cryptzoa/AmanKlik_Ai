import { expect, test } from "@playwright/test";

test("health endpoint responds with the public envelope", async ({ request }) => {
  const response = await request.get("/api/health");

  expect(response.ok()).toBeTruthy();
  const body = await response.json();

  expect(body.ok).toBe(true);
  expect(typeof body.data.status).toBe("string");
  expect(typeof body.data.database).toBe("string");
  expect(typeof body.data.version).toBe("string");
});

test("public pages send the baseline browser security policy", async ({ request }) => {
  const response = await request.get("/");

  expect(response.headers()["x-content-type-options"]).toBe("nosniff");
  expect(response.headers()["x-frame-options"]).toBe("DENY");
  expect(response.headers()["cross-origin-opener-policy"]).toBe("same-origin");
  expect(response.headers()["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(response.headers()["content-security-policy"]).toContain("object-src 'none'");
});

test("core product pages render and connect", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Jangan percaya pesannya/i })).toBeVisible();
  await page.getByRole("link", { name: "Cek pesan" }).click();
  await expect(page).toHaveURL(/\/scan$/);
  await expect(page.getByRole("tab", { name: "Pesan" })).toBeVisible();

  await page.goto("/simulator");
  await expect(page.getByRole("heading", { name: /Latih refleks amanmu/i })).toBeVisible();
  await expect(page.getByRole("button", { name: "Pemberitahuan OTP" })).toBeVisible();
});

test("landing stays readable with reduced motion and on mobile", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /Jangan percaya pesannya/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Satu pesan/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Nama merek bisa ditempel/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Bukan keputusan AI mentah/i })).toBeVisible();

  const width = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
  expect(width.scroll).toBe(width.client);
  await page.getByText("Menu", { exact: true }).click();
  await expect(page.getByRole("navigation", { name: "Navigasi seluler" })).toBeVisible();
});

test("scanner can load every kind of synthetic fixture", async ({ page }) => {
  await page.goto("/scan");

  await page.getByRole("button", { name: /T2 · Ancaman/i }).click();
  await expect(page.getByLabel("Tempel pesan yang ingin diperiksa")).toContainText("kode OTP");

  await page.getByRole("tab", { name: "Tautan" }).click();
  await page.getByRole("button", { name: /U2 · Host/i }).click();
  await expect(page.getByLabel("Tautan yang ingin diperiksa")).toHaveValue("http://192.0.2.10/verify-account");

  await page.getByRole("tab", { name: "Screenshot" }).click();
  await page.getByRole("button", { name: /IMG_T1/i }).click();
  await expect(page.getByAltText("Preview screenshot yang dipilih")).toBeVisible();
});

test("every product surface uses the animated interior system without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const surfaces = [
    ["/scan", /Periksa sebelum percaya/i],
    ["/simulator", /Latih refleks amanmu/i],
    ["/learn", /Kenali polanya sendiri/i],
    ["/history", /Jejak pemeriksaanmu/i],
    ["/alamat-yang-tidak-ada", /Jalurnya berhenti di sini/i],
  ] as const;

  for (const [route, heading] of surfaces) {
    await page.goto(route);
    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    const width = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
    expect(width.scroll, `${route} memiliki horizontal overflow`).toBe(width.client);
  }
});

test("Lenis is attached globally when motion is allowed", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/learn");

  await expect.poll(() => page.evaluate(() => document.documentElement.classList.contains("lenis"))).toBe(true);
  await expect(page.locator("[data-scroll-progress-bar]")).toHaveCount(1);
});
