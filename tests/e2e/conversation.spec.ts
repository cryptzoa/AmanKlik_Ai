import { expect, test } from "@playwright/test";

test("conversation draft manages bounds, validation, and focus", async ({ page }) => {
  await page.goto("/scan/conversation");
  await expect(page.getByText("Contoh buatan.")).toBeVisible();
  await page.getByRole("button", { name: "Mulai kosong" }).click();

  const first = page.getByLabel("Pesan 1", { exact: true });
  await expect(first).toBeFocused();
  await expect(page.getByRole("button", { name: "Hapus pesan 1" }))
    .toBeDisabled();

  const add = page.getByRole("button", { name: "+ Tambah pesan" });
  await add.click();
  const third = page.getByLabel("Pesan 3", { exact: true });
  await expect(third).toBeFocused();
  await page.getByRole("button", { name: "Hapus pesan 3" }).click();
  await expect(page.getByLabel("Pesan 2", { exact: true })).toBeFocused();

  await first.fill("Pesan pembuka sintetis.");
  await page.getByLabel("Pesan 2", { exact: true }).fill(
    "Balasan sintetis.",
  );
  for (let expectedCount = 3; expectedCount <= 12; expectedCount += 1) {
    await add.click();
    await expect(page.locator("textarea")).toHaveCount(expectedCount);
    await page.getByLabel(`Pesan ${expectedCount}`, { exact: true }).fill(
      `Pesan sintetis ${expectedCount}.`,
    );
  }
  await expect(page.locator("textarea")).toHaveCount(12);
  await expect(add).toBeDisabled();

  await first.fill("");
  await page.getByRole("button", { name: "Analisis percakapan" }).click();
  await expect(first).toBeFocused();
  await expect(first).toHaveAttribute("aria-invalid", "true");
  await expect(page.getByText("Isi pesan tidak boleh kosong.").first())
    .toBeVisible();
});

test("conversation API error keeps the ordered draft", async ({ page }) => {
  await page.route("**/api/scans/conversation", async (route) => {
    await route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({
        ok: false,
        error: { message: "Analisis percakapan sedang tidak tersedia." },
      }),
    });
  });
  await page.goto("/scan/conversation");
  await page.getByRole("button", { name: "Mulai kosong" }).click();

  const first = page.getByLabel("Pesan 1", { exact: true });
  const second = page.getByLabel("Pesan 2", { exact: true });
  await first.fill("Nomor lama saya rusak, ini nomor baru.");
  await second.fill("Tolong transfer sekarang dan jangan telepon.");
  await page.getByRole("button", { name: "Analisis percakapan" }).click();

  await expect(page.getByRole("alert").filter({
    hasText: "Analisis percakapan sedang tidak tersedia.",
  })).toBeVisible();
  await expect(first).toHaveValue("Nomor lama saya rusak, ini nomor baru.");
  await expect(second).toHaveValue(
    "Tolong transfer sekarang dan jangan telepon.",
  );
});

test("conversation sender menu is styled, keyboard-operable, and updates the timeline", async ({ page }) => {
  await page.goto("/scan/conversation");

  const senderMenu = page.getByRole("button", { name: "Pengirim" }).first();
  await expect(senderMenu).toHaveAttribute("aria-expanded", "false");
  await senderMenu.click();
  await expect(senderMenu).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("menu", { name: "Pengirim" })).toBeVisible();

  const selfOption = page.getByRole("menuitemradio", { name: "Saya" });
  await selfOption.click();
  await expect(senderMenu).toContainText("Saya");
  await expect(page.getByText("Saya → Pengirim", { exact: true })).toBeVisible();

  await senderMenu.press("ArrowDown");
  await expect(selfOption).toBeFocused();
  await selfOption.press("Escape");
  await expect(senderMenu).toBeFocused();
  await expect(senderMenu).toHaveAttribute("aria-expanded", "false");

  const privacyPanel = page.locator(".product-dark-inset");
  await expect(privacyPanel).toBeVisible();
  await expect(privacyPanel).toHaveCSS("border-top-left-radius", "24px");
});
