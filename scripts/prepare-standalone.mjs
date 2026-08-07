import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname } from "node:path";

function copyDirectory(source, destination) {
  if (!existsSync(source)) {
    return;
  }

  rmSync(destination, { recursive: true, force: true });
  mkdirSync(dirname(destination), { recursive: true });
  cpSync(source, destination, { recursive: true });
  console.log(`[postbuild] Copied ${source} to ${destination}`);
}

copyDirectory(".next/static", ".next/standalone/.next/static");
copyDirectory("public", ".next/standalone/public");
