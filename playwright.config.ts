import { defineConfig, devices } from "@playwright/test";

const requestedPort = Number(process.env.PLAYWRIGHT_PORT ?? "3000");
const port = Number.isInteger(requestedPort) &&
    requestedPort >= 1_024 && requestedPort <= 65_535
  ? requestedPort
  : 3_000;
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: "list",
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  webServer: {
    command: `pnpm exec next dev --port ${port}`,
    url: `${baseURL}/api/health`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox-smoke",
      testMatch: /critical-smoke\.spec\.ts/,
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit-smoke",
      testMatch: /critical-smoke\.spec\.ts/,
      use: { ...devices["Desktop Safari"] },
    },
  ],
});
