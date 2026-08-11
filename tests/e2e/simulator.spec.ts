import { expect, test } from "@playwright/test";

test("Latihan explains every decision before allowing the scenario to continue", async ({ page }) => {
  await page.goto("/simulator");

  await page.getByRole("button", { name: /Percaya karena suara dan fotonya cocok/i }).click();
  const feedback = page.getByRole("heading", { name: /Kenapa keputusan ini dinilai begitu/i });
  await expect(feedback).toBeFocused();
  await expect(page.getByText(/^Berisiko · 0\/100$/i)).toBeVisible();
  await page.getByRole("button", { name: /Lanjut ke keputusan berikutnya/i }).click();

  await page.getByRole("button", { name: /Tunda dan cek melalui grup keluarga/i }).click();
  await expect(page.getByText(/^Langkah aman · 100\/100$/i)).toBeVisible();
  await page.getByRole("button", { name: /Lanjut ke keputusan berikutnya/i }).click();

  await page.getByRole("button", { name: /Berhenti sampai orangnya bisa dikonfirmasi/i }).click();
  await page.getByRole("button", { name: /Lihat hasil latihan/i }).click();

  await expect(page.getByText("67/ 100")).toBeVisible();
  await expect(page.getByRole("heading", { name: /Suara, foto, dan jawaban di chat bukan verifikasi/i })).toBeVisible();
  await expect(page.getByText(/2 aman · 0 belum cukup · 1 berisiko/i)).toBeVisible();
});

test("Latihan works with keyboard on mobile without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/simulator");

  await page.getByLabel("Skenario aktif").selectOption("bank-otp");
  const safeChoice = page.getByRole("button", { name: /Tutup telepon lalu buka aplikasi/i });
  await safeChoice.focus();
  await page.keyboard.press("Enter");

  await expect(safeChoice).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText(/^Langkah aman · 100\/100$/i)).toBeVisible();
  await expect(page.getByRole("progressbar", { name: /Kemajuan skenario/i })).toHaveAttribute("aria-valuenow", "1");

  const width = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
  expect(width.scroll).toBe(width.client);
});
