import { expect, test } from "@playwright/test";

test.describe("AmanKlik AI Promo Film (JEDA)", () => {
  test("renders promo page in preview mode with full controls", async ({ page }) => {
    await page.goto("/promo");

    // Canvas stage is present
    const canvas = page.locator(".promo-canvas");
    await expect(canvas).toBeVisible();

    // Controls overlay is present
    const playBtn = page.getByTestId("promo-play-btn");
    await expect(playBtn).toBeVisible();

    const restartBtn = page.getByTestId("promo-restart-btn");
    await expect(restartBtn).toBeVisible();

    const scrubber = page.getByTestId("promo-scrubber");
    await expect(scrubber).toBeVisible();

    // Scene marker buttons exist
    await expect(page.getByTestId("scene-marker-scene-pressure")).toBeVisible();
    await expect(page.getByTestId("scene-marker-scene-pause")).toBeVisible();
    await expect(page.getByTestId("scene-marker-scene-brand")).toBeVisible();
    await expect(page.getByTestId("scene-marker-scene-scan")).toBeVisible();
    await expect(page.getByTestId("scene-marker-scene-end")).toBeVisible();
  });

  test("plays and pauses with Space shortcut", async ({ page }) => {
    await page.goto("/promo");

    const playBtn = page.getByTestId("promo-play-btn");
    await expect(playBtn).toHaveAttribute("aria-label", "Putar animasi");

    // Press Space to play
    await page.keyboard.press("Space");
    await expect(playBtn).toHaveAttribute("aria-label", "Jeda animasi");

    // Press Space again to pause
    await page.keyboard.press("Space");
    await expect(playBtn).toHaveAttribute("aria-label", "Putar animasi");
  });

  test("supports 9:16 portrait format", async ({ page }) => {
    await page.goto("/promo?ratio=9x16");

    const canvas = page.locator(".promo-canvas");
    await expect(canvas).toBeVisible();

    // Portrait button is active in controls
    const portraitLink = page.getByRole("link", { name: "9:16" });
    await expect(portraitLink).toHaveClass(/font-bold/);
  });

  test("supports 15s short cut", async ({ page }) => {
    await page.goto("/promo?cut=15s");

    const canvas = page.locator(".promo-canvas");
    await expect(canvas).toBeVisible();

    // 15s cut indicator is active
    const shortCutLink = page.getByRole("link", { name: "15s" });
    await expect(shortCutLink).toHaveClass(/font-bold/);
  });

  test("supports clean record mode", async ({ page }) => {
    await page.goto("/promo?mode=record");

    // Clean ready screen is visible
    await expect(page.getByText("MODE REKAM SIAP")).toBeVisible();

    // Controls bar is hidden in record mode
    await expect(page.getByTestId("promo-controls-bar")).not.toBeVisible();

    // Press Space to start recording
    await page.keyboard.press("Space");
    await expect(page.getByText("MODE REKAM SIAP")).not.toBeVisible();
  });
});
