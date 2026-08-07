import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import "dotenv/config";

import { DEMO_IMAGE_FIXTURES, DEMO_TEXT_FIXTURES, DEMO_URL_FIXTURES } from "../src/lib/demo/scan-fixtures";

async function main() {
  const confirmed = process.argv.includes("--confirm-live");
  const requestedIds = process.argv.slice(2).filter((argument) => !argument.startsWith("--"));

  if (process.env.AI_MODE !== "live" || !confirmed) {
    throw new Error("Prewarm hanya berjalan saat AI_MODE=live dan flag --confirm-live diberikan.");
  }
  if (!requestedIds.length) throw new Error("Berikan minimal satu fixture ID yang disetujui, misalnya T1 U1 IMG_T2.");

  const baseUrl = new URL(process.env.APP_BASE_URL || "http://localhost:3000");
  const allowed = new Set<string>([
    ...DEMO_TEXT_FIXTURES.map((fixture) => fixture.id),
    ...DEMO_URL_FIXTURES.map((fixture) => fixture.id),
    ...DEMO_IMAGE_FIXTURES.map((fixture) => fixture.id),
  ]);

  for (const id of requestedIds) {
    if (!allowed.has(id)) throw new Error(`Fixture ID tidak diizinkan: ${id}`);

    const textFixture = DEMO_TEXT_FIXTURES.find((fixture) => fixture.id === id);
    const urlFixture = DEMO_URL_FIXTURES.find((fixture) => fixture.id === id);
    const imageFixture = DEMO_IMAGE_FIXTURES.find((fixture) => fixture.id === id);
    let response: Response;
    let route: string;

    if (textFixture) {
      route = "/api/scans/text";
      response = await fetch(new URL(route, baseUrl), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textFixture.text }),
      });
    } else if (urlFixture) {
      route = "/api/scans/url";
      response = await fetch(new URL(route, baseUrl), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlFixture.url }),
      });
    } else if (imageFixture) {
      route = "/api/scans/image";
      const bytes = await readFile(path.join(process.cwd(), "public", imageFixture.path));
      const form = new FormData();
      form.set("file", new Blob([bytes], { type: "image/png" }), path.basename(imageFixture.path));
      response = await fetch(new URL(route, baseUrl), { method: "POST", body: form });
    } else {
      throw new Error(`Fixture tidak ditemukan: ${id}`);
    }

    process.stdout.write(`${id} ${route} HTTP ${response.status}\n`);
    if (!response.ok) process.exitCode = 1;
  }
}

void main();
