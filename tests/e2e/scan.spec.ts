import { expect, test } from "@playwright/test";

test("tabs, validation, and URL failure preserve a safe input path", async ({ page }) => {
  let releaseResponse!: () => void;
  const responseGate = new Promise<void>((resolve) => {
    releaseResponse = resolve;
  });
  let apiCalls = 0;
  const targetRequests: string[] = [];

  page.on("request", (request) => {
    if (request.url().startsWith("https://example.com/")) {
      targetRequests.push(request.url());
    }
  });
  await page.route("**/api/scans/url", async (route) => {
    apiCalls += 1;
    await responseGate;
    await route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({
        ok: false,
        error: { message: "Analisis uji belum tersedia." },
      }),
    });
  });

  await page.goto("/scan");
  const textTab = page.getByRole("tab", { name: "Pesan" });
  await textTab.press("End");
  const urlTab = page.getByRole("tab", { name: "Tautan" });
  await expect(urlTab).toBeFocused();
  await expect(urlTab).toHaveAttribute("aria-selected", "true");
  await urlTab.press("Home");
  await expect(textTab).toBeFocused();

  await page.getByRole("button", { name: "Analisis sekarang" }).click();
  await expect(page.getByLabel("Tempel pesan yang ingin diperiksa"))
    .toBeFocused();
  await expect(page.getByLabel("Tempel pesan yang ingin diperiksa"))
    .toHaveAttribute("aria-invalid", "true");

  await urlTab.click();
  const urlInput = page.getByLabel("Tautan yang ingin diperiksa");
  await urlInput.fill("https://example.com/account/verify");
  const submit = page.locator('button[type="submit"]');
  await submit.click();
  await expect(page.locator('[data-tone="loading"]')).toContainText(
    "Menerima input",
  );
  await expect(submit).toBeDisabled();

  releaseResponse();
  await expect(page.getByRole("alert").filter({
    hasText: "Analisis uji belum tersedia.",
  })).toBeVisible();
  await expect(urlInput).toHaveValue("https://example.com/account/verify");
  expect(apiCalls).toBe(1);
  expect(targetRequests).toEqual([]);
});

test("network failure uses product copy and retains the message", async ({ page }) => {
  await page.route("**/api/scans/text", (route) => route.abort("failed"));
  await page.goto("/scan");

  const input = page.getByLabel("Tempel pesan yang ingin diperiksa");
  await input.fill("Pesan uji meminta transfer sekarang juga.");
  await page.getByRole("button", { name: "Analisis sekarang" }).click();

  await expect(page.getByRole("alert").filter({
    hasText: "Jaringan belum dapat menjangkau AmanKlik",
  })).toBeVisible();
  await expect(input).toHaveValue("Pesan uji meminta transfer sekarang juga.");
});
