import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

const PORT = 3333;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const OUTPUT_DIR = path.resolve(process.cwd(), "docs/screenshots");

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function isServerReady() {
  try {
    const res = await fetch(`${BASE_URL}/api/health`);
    return res.ok;
  } catch {
    return false;
  }
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  console.log("Starting Next.js test server...");
  const server = spawn("pnpm", ["exec", "next", "dev", "--port", String(PORT)], {
    env: { ...process.env, PORT: String(PORT) },
    stdio: "pipe",
  });

  let ready = false;
  for (let i = 0; i < 45; i++) {
    if (await isServerReady()) {
      ready = true;
      break;
    }
    await wait(1000);
  }

  if (!ready) {
    server.kill();
    throw new Error("Next.js server failed to start in time");
  }

  console.log("Next.js server ready. Launching Playwright browser...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: "light",
  });

  const page = await context.newPage();

  const pagesToCapture = [
    {
      name: "landing-hero.png",
      url: `${BASE_URL}/`,
      waitAfterLoad: 3000,
      action: async () => {},
    },
    {
      name: "url-anatomy.png",
      url: `${BASE_URL}/`,
      waitAfterLoad: 2500,
      action: async () => {
        const anatomySection = page.locator("#url-anatomy-title");
        if (await anatomySection.count()) {
          await anatomySection.scrollIntoViewIfNeeded();
          await wait(800);
        }
      },
    },
    {
      name: "scan-hub.png",
      url: `${BASE_URL}/scan`,
      waitAfterLoad: 2000,
      action: async () => {
        await page.evaluate(() => window.scrollBy(0, 260));
        await wait(500);
      },
    },
    {
      name: "simulator.png",
      url: `${BASE_URL}/simulator`,
      waitAfterLoad: 2000,
      action: async () => {
        await page.evaluate(() => window.scrollBy(0, 280));
        await wait(500);
      },
    },
    {
      name: "respond.png",
      url: `${BASE_URL}/respond`,
      waitAfterLoad: 2000,
      action: async () => {
        await page.evaluate(() => window.scrollBy(0, 240));
        await wait(500);
      },
    },
    {
      name: "benchmark.png",
      url: `${BASE_URL}/benchmark`,
      waitAfterLoad: 2000,
      action: async () => {
        await page.evaluate(() => window.scrollBy(0, 260));
        await wait(500);
      },
    },
  ];

  for (const item of pagesToCapture) {
    console.log(`Navigating to ${item.url}...`);
    await page.goto(item.url, { waitUntil: "networkidle" });
    await wait(item.waitAfterLoad);
    if (item.action) {
      await item.action();
    }

    const outPath = path.join(OUTPUT_DIR, item.name);
    await page.screenshot({ path: outPath, fullPage: false });
    console.log(`Saved screenshot: ${outPath}`);
  }

  await browser.close();
  server.kill("SIGTERM");
  console.log("All screenshots captured successfully!");
}

main().catch((err) => {
  console.error("Failed to capture screenshots:", err);
  process.exit(1);
});
