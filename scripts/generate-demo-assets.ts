import { mkdir } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

import { DEMO_IMAGE_FIXTURES, DEMO_TEXT_FIXTURES } from "../src/lib/demo/scan-fixtures";

function escapeXml(input: string): string {
  return input.replace(/[<>&'\"]/g, (character) => ({
    "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", "\"": "&quot;",
  })[character] ?? character);
}

function screenshotSvg(title: string, lines: string[], accent: string): string {
  const text = lines.map((line, index) => (
    `<text x="132" y="${420 + index * 64}" font-family="Arial, sans-serif" font-size="34" fill="#171913">${escapeXml(line)}</text>`
  )).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">
    <rect width="1080" height="1350" fill="#edece4"/>
    <rect x="60" y="70" width="960" height="1210" rx="54" fill="#f9f8f2" stroke="#c7c7bc" stroke-width="3"/>
    <circle cx="128" cy="174" r="34" fill="${accent}"/>
    <text x="184" y="164" font-family="Arial, sans-serif" font-size="30" font-weight="700" fill="#171913">${escapeXml(title)}</text>
    <text x="184" y="202" font-family="Arial, sans-serif" font-size="20" fill="#727468">Kontak sintetis · fixture demo</text>
    <line x1="96" y1="250" x2="984" y2="250" stroke="#d8d8cf" stroke-width="2"/>
    <rect x="96" y="330" width="840" height="430" rx="36" fill="#ffffff" stroke="#deded5" stroke-width="2"/>
    ${text}
    <text x="836" y="718" font-family="Arial, sans-serif" font-size="20" fill="#727468">18.42</text>
    <rect x="96" y="830" width="888" height="116" rx="58" fill="#efefe8"/>
    <text x="148" y="900" font-family="Arial, sans-serif" font-size="27" fill="#8a8b82">Tulis balasan…</text>
    <rect x="96" y="1045" width="888" height="132" rx="24" fill="#171913"/>
    <text x="142" y="1101" font-family="Arial, sans-serif" font-size="20" letter-spacing="3" fill="#b8f05a">AMAN KLIK · DEMO</text>
    <text x="142" y="1144" font-family="Arial, sans-serif" font-size="23" fill="#f9f8f2">Semua nama dan isi pesan bersifat fiktif.</text>
  </svg>`;
}

async function main() {
  const outputDirectory = path.join(process.cwd(), "public/demo");
  await mkdir(outputDirectory, { recursive: true });

  for (const [index, image] of DEMO_IMAGE_FIXTURES.entries()) {
    const fixture = DEMO_TEXT_FIXTURES.find((candidate) => candidate.id === image.textFixtureId);
    if (!fixture?.screenshotLines) throw new Error(`Fixture screenshot ${image.id} tidak ditemukan.`);
    const svg = screenshotSvg(image.title, fixture.screenshotLines, index === 0 ? "#ff6b55" : "#7957ff");
    await sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true }).toFile(path.join(outputDirectory, path.basename(image.path)));
    process.stdout.write(`Generated ${image.id}: ${image.path}\n`);
  }
}

void main();
