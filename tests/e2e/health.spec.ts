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
  await expect(page.getByRole("button", { name: "Keluarga, nomor baru, dan suara mirip" })).toBeVisible();

  await page.goto("/respond");
  await expect(page.getByRole("heading", { name: /Sudah terlanjur/i })).toBeVisible();
  await page.getByRole("button", { name: /Uang sudah terkirim/i }).click();
  await expect(page.getByRole("heading", { name: /Hubungi bank atau e-wallet sekarang/i })).toBeVisible();

  await page.goto("/scan/conversation");
  await expect(page.getByRole("heading", { name: /Baca urutannya/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /Analisis percakapan/i })).toBeVisible();

  await page.goto("/family");
  await expect(page.getByRole("heading", { name: /Jalurnya berhenti di sini/i })).toBeVisible();

  await page.goto("/benchmark");
  await expect(page.getByRole("heading", { name: /Buktikan batasnya/i })).toBeVisible();
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
  const mobileNavigation = page.getByRole("navigation", { name: "Navigasi seluler" });
  await expect(mobileNavigation).toBeVisible();
  await expect(mobileNavigation.getByRole("link", { name: "Kasus", exact: true })).toBeVisible();
  await expect(mobileNavigation.getByRole("link", { name: "Learn", exact: true })).toBeVisible();
  await expect(mobileNavigation.getByRole("link", { name: "History", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Family" })).toHaveCount(0);
});

test("landing and interior pages share one complete navigation", async ({ page }) => {
  for (const route of ["/", "/scan"]) {
    await page.goto(route);

    const primary = page.getByRole("navigation", { name: "Navigasi utama" });
    await expect(primary.getByRole("link", { name: "Scan", exact: true })).toBeVisible();
    await expect(primary.getByRole("link", { name: "Action", exact: true })).toBeVisible();
    await expect(primary.getByRole("link", { name: "Latihan", exact: true })).toBeVisible();

    await primary.getByText("Lainnya +", { exact: true }).click();
    const secondary = page.getByRole("navigation", { name: "Navigasi tambahan" });
    await expect(secondary.getByRole("link", { name: "Kasus", exact: true })).toBeVisible();
    await expect(secondary.getByRole("link", { name: "Learn", exact: true })).toBeVisible();
    await expect(secondary.getByRole("link", { name: "History", exact: true })).toBeVisible();
  }

  await expect(page.getByRole("navigation", { name: "Navigasi utama" }).getByRole("link", { name: "Scan", exact: true }))
    .toHaveAttribute("aria-current", "page");
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
    ["/respond", /Sudah terlanjur/i],
    ["/scan/conversation", /Baca urutannya/i],
    ["/investigate", /Bandingkan bukti yang berbeda/i],
    ["/intelligence", /Lihat polanya, bukan orangnya/i],
    ["/benchmark", /Buktikan batasnya/i],
    ["/connect", /AmanKlik di tempat pesan datang/i],
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
