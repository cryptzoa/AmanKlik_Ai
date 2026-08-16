import { expect, test } from "@playwright/test";

const rawToken = `akx_${"a".repeat(43)}`;

test("token ceremony creates, copies, dismisses, and revokes without a DOM leak", async ({
  baseURL,
  context,
  page,
}) => {
  const origin = new URL(baseURL ?? "http://127.0.0.1:3000").origin;
  await context.grantPermissions(["clipboard-read", "clipboard-write"], {
    origin,
  });

  const requests: Array<{ method: string; url: string; body: string | null }> = [];
  let items: Array<Record<string, string | null>> = [];

  await page.route("**/api/integrations/tokens", async (route) => {
    const request = route.request();
    requests.push({
      method: request.method(),
      url: request.url(),
      body: request.postData(),
    });

    if (request.method() === "POST") {
      items = [{
        id: "11111111-1111-4111-8111-111111111111",
        name: "Browser utama",
        createdAt: "2026-08-14T10:00:00.000Z",
        lastUsedAt: null,
        expiresAt: "2026-11-12T10:00:00.000Z",
      }];
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({ ok: true, data: { token: rawToken } }),
      });
      return;
    }

    if (request.method() === "DELETE") {
      items = [];
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({ ok: true, data: { revoked: true } }),
      });
      return;
    }

    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ ok: true, data: { items } }),
    });
  });

  await page.goto("/connect");
  await expect(page.getByText("Belum ada perangkat yang terhubung."))
    .toBeVisible();

  await page.getByRole("button", { name: "Buat kode akses" }).click();
  await expect(page.getByRole("heading", {
    name: "Salin sebelum menutup tampilan ini.",
  })).toBeFocused();
  await expect(page.getByText(rawToken, { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Salin kode akses" }).click();
  await expect(page.getByRole("status")).toContainText("Kode akses tersalin.");

  await page.getByRole("button", { name: "Selesai dan tutup" }).click();
  await expect(page.getByText(rawToken, { exact: true })).toHaveCount(0);
  expect(await page.content()).not.toContain(rawToken);

  await expect(page.getByRole("heading", { name: "Browser utama" }))
    .toBeVisible();
  await page.getByRole("button", {
    name: "Cabut akses Browser utama",
  }).click();
  await expect(page.getByRole("status")).toContainText(
    "Akses untuk Browser utama sudah dicabut.",
  );
  await expect(page.getByText("Belum ada perangkat yang terhubung."))
    .toBeVisible();

  expect(requests.every(({ url }) => url.startsWith(`${origin}/`)))
    .toBe(true);
  expect(requests.every(({ body }) => !body?.includes(rawToken))).toBe(true);
});

test("HTTP failure is unavailable state, not an empty token list", async ({ page }) => {
  await page.route("**/api/integrations/tokens", async (route) => {
    await route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({
        ok: false,
        error: { message: "Layanan token belum tersedia." },
      }),
    });
  });

  await page.goto("/connect");
  await expect(page.getByText("Daftar akses belum dapat dimuat."))
    .toBeVisible();
  await expect(page.getByText("Belum ada perangkat yang terhubung."))
    .toHaveCount(0);

  await page.getByRole("button", { name: "Buat kode akses" }).click();
  await expect(page.getByRole("alert").filter({
    hasText: "Layanan token belum tersedia.",
  })).toBeVisible();
});
