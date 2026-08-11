import { expect, test } from "@playwright/test";

test("money transfer flow exposes bank, IASC, and police as the first three actions", async ({ page }) => {
  await page.goto("/respond");
  await page.getByRole("button", { name: /Uang sudah terkirim/i }).click();

  await expect(page.getByRole("button", { name: /Bank, kartu, atau e-wallet/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /Marketplace/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /Email utama/i })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /WhatsApp/i })).toHaveCount(0);

  const response = page.getByRole("region", { name: /Hubungi bank atau e-wallet sekarang/i });
  await expect(response.getByRole("heading", { name: /Hubungi bank atau e-wallet sekarang/i })).toBeVisible();
  await expect(response.getByRole("heading", { name: /Laporkan segera melalui portal resmi IASC/i })).toBeVisible();
  await expect(response.getByRole("heading", { name: /Buat Laporan Polisi/i })).toBeVisible();
  await expect(response.getByRole("link", { name: /iasc\.ojk\.go\.id/i }).first()).toHaveAttribute("href", "https://iasc.ojk.go.id/");
});

test("credential flow can be refined and reset with keyboard on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/respond");

  const incident = page.getByRole("button", { name: /OTP, PIN, password/i });
  await incident.focus();
  await page.keyboard.press("Enter");
  await expect(incident).toHaveAttribute("aria-pressed", "true");

  const financialAsset = page.getByRole("button", { name: /Bank, kartu, atau e-wallet/i });
  await financialAsset.focus();
  await page.keyboard.press("Space");
  await expect(financialAsset).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("heading", { name: /Kunci akses bank, kartu, atau e-wallet/i })).toBeVisible();

  const width = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
  expect(width.scroll).toBe(width.client);

  const reset = page.getByRole("button", { name: /Ulangi pilihan/i });
  await reset.focus();
  await page.keyboard.press("Enter");
  await expect(incident).toHaveAttribute("aria-pressed", "false");
  await expect(page.getByText(/Pilih situasi di atas/i)).toBeVisible();
});
