import { expect, test } from "@playwright/test";

test("product rows and CTA motion use the shared visual grammar", async ({ page }) => {
  await page.goto("/respond");

  const choice = page.getByRole("button", { name: /Uang sudah terkirim/i });
  await expect.poll(() =>
    choice.evaluate((element) => getComputedStyle(element).borderRadius)
  ).toBe("16px");
  await expect.poll(() =>
    page.locator("p.border-dashed").evaluate((element) =>
      getComputedStyle(element).borderRadius
    )
  ).toBe("20px");

  await choice.click();
  const sourceLink = page.locator(".product-source-link").first();
  await sourceLink.hover();
  await expect.poll(() =>
    sourceLink.evaluate((element) => getComputedStyle(element).color)
  ).toBe("rgb(255, 255, 255)");

  const primaryAction = page.locator(".product-button--primary").first();
  await primaryAction.hover();
  await expect(primaryAction).toHaveClass(/is-hovering/);
  await expect.poll(() =>
    primaryAction.evaluate((element) =>
      getComputedStyle(element, "::before").opacity
    )
  ).toBe("1");
  await expect.poll(() =>
    primaryAction.evaluate((element) =>
      getComputedStyle(element, "::before").zIndex
    )
  ).toBe("-1");
});

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

test("unsure stays exclusive from concrete incidents", async ({ page }) => {
  await page.goto("/respond");

  const transfer = page.getByRole("button", { name: /Uang sudah terkirim/i });
  const credential = page.getByRole("button", { name: /OTP, PIN, password/i });
  const unsure = page.getByRole("button", { name: /Saya tidak yakin apa yang sudah terjadi/i });

  await transfer.click();
  await credential.click();
  await unsure.click();

  await expect(unsure).toHaveAttribute("aria-pressed", "true");
  await expect(transfer).toHaveAttribute("aria-pressed", "false");
  await expect(credential).toHaveAttribute("aria-pressed", "false");

  await transfer.click();
  await expect(unsure).toHaveAttribute("aria-pressed", "false");
  await expect(transfer).toHaveAttribute("aria-pressed", "true");
});

test("copy failure stays visible as an actionable error", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: () => Promise.reject(new Error("Clipboard blocked")),
      },
    });
  });
  await page.goto("/respond");
  await page.getByRole("button", { name: /Uang sudah terkirim/i }).click();
  await page.getByRole("button", { name: "Salin semua langkah" }).click();

  await expect(page.getByRole("alert").filter({
    hasText: "Clipboard tidak tersedia",
  })).toBeVisible();
});
