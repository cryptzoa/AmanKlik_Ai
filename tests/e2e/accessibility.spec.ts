import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/scan",
  "/scan/conversation",
  "/respond",
  "/simulator",
  "/learn",
  "/benchmark",
  "/history",
  "/investigate",
  "/connect",
  "/privacy",
  "/alamat-yang-tidak-ada",
] as const;

test("product routes have no serious or critical accessibility violations", async ({ page }) => {
  test.setTimeout(60_000);
  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const route of routes) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page).toHaveTitle(/AmanKlik/i);

    const report = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .disableRules(["document-title"])
      .analyze();
    const blockers = report.violations.filter((violation) =>
      violation.impact === "critical" || violation.impact === "serious"
    );

    expect(blockers, `${route}: ${JSON.stringify(blockers, null, 2)}`).toEqual([]);
  }
});

test("skip link and privacy print mode preserve the reading path", async ({ page }) => {
  await page.goto("/privacy");

  const skipLink = page.getByRole("link", { name: "Lewati ke konten utama" });
  await page.keyboard.press("Tab");
  await expect(skipLink).toBeFocused();
  await skipLink.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();

  await page.emulateMedia({ media: "print" });
  await expect(page.locator("[data-shell-header]")).toBeHidden();
  await expect(page.locator("footer")).toBeHidden();
  await expect(page.getByRole("heading", {
    name: /Apa yang terjadi pada data yang kamu kirim/i,
  })).toBeVisible();
});

test("landing and mobile navigation have no serious accessibility violations", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  for (const menuOpen of [false, true]) {
    if (menuOpen) {
      await page.getByRole("button", { name: "Buka Menu" }).click();
      await expect(page.getByRole("dialog", { name: "Menu navigasi" }))
        .toBeVisible();
    }

    const report = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    const blockers = report.violations.filter((violation) =>
      violation.impact === "critical" || violation.impact === "serious"
    );
    expect(blockers, JSON.stringify(blockers, null, 2)).toEqual([]);
  }
});

test("privacy remains an explicitly unapproved, non-indexable technical draft", async ({ page }) => {
  const response = await page.goto("/privacy");

  expect(response?.status()).toBe(200);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex, nofollow/i,
  );
  await expect(page.getByText("Belum disetujui sebagai kebijakan publik"))
    .toBeVisible();
  await expect(page.getByText(/Belum ada tombol untuk menghapus seluruh data sesi/i))
    .toBeVisible();
  await expect(page.getByRole("navigation", {
    name: "Daftar isi privasi",
  })).toBeVisible();
  await expect(page.getByRole("link", { name: /Buka situs IASC/i }))
    .toHaveAttribute("href", "https://iasc.ojk.go.id/");
  await expect(page.getByRole("link", { name: /Buka situs IASC/i }))
    .toHaveAttribute("rel", "noreferrer");
  await expect(page.locator("body")).not.toContainText(/\b(?:TODO|lorem ipsum)\b/i);
});
