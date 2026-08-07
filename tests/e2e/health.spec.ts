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

test("core product pages render and connect", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Jangan percaya pesannya/i })).toBeVisible();
  await page.getByRole("link", { name: "Cek pesan" }).click();
  await expect(page).toHaveURL(/\/scan$/);
  await expect(page.getByRole("tab", { name: "Pesan" })).toBeVisible();

  await page.goto("/simulator");
  await expect(page.getByRole("heading", { name: /Latih keputusanmu/i })).toBeVisible();
  await expect(page.getByRole("button", { name: "Pemberitahuan OTP" })).toBeVisible();
});
