import "server-only";

import { fileTypeFromBuffer } from "file-type";
import sharp from "sharp";

import { env } from "@/lib/env";
import { DomainError } from "@/lib/errors";

export type ProcessedImage = {
  bytes: Uint8Array;
  mimeType: "image/png" | "image/jpeg" | "image/webp";
};

export type UploadFile = Pick<File, "size" | "arrayBuffer">;

const formats = new Map<string, ProcessedImage["mimeType"]>([
  ["png", "image/png"],
  ["jpg", "image/jpeg"],
  ["jpeg", "image/jpeg"],
  ["webp", "image/webp"],
]);

export async function preprocessImage(file: UploadFile): Promise<ProcessedImage> {
  if (file.size > env.MAX_UPLOAD_BYTES) {
    throw new DomainError("Image too large", "FILE_TOO_LARGE");
  }

  if (file.size === 0) {
    throw new DomainError("Image is empty", "INVALID_IMAGE");
  }

  const originalBytes = Buffer.from(await file.arrayBuffer());
  const detected = await fileTypeFromBuffer(originalBytes);
  const mimeType = detected ? formats.get(detected.ext) : undefined;

  if (!mimeType) {
    throw new DomainError("Unsupported image format", "UNSUPPORTED_FILE");
  }

  try {
    const image = sharp(originalBytes, { failOn: "error" });
    const metadata = await image.metadata();

    if (!metadata.width || !metadata.height || metadata.width * metadata.height > 40_000_000) {
      throw new DomainError("Invalid image dimensions", "INVALID_IMAGE");
    }

    const output = await image
      .rotate()
      .resize({ width: 1_600, height: 1_600, fit: "inside", withoutEnlargement: true })
      .toFormat(mimeType === "image/jpeg" ? "jpeg" : mimeType === "image/webp" ? "webp" : "png")
      .toBuffer();

    return { bytes: output, mimeType };
  } catch (error) {
    if (error instanceof DomainError) throw error;
    throw new DomainError("Image cannot be decoded", "INVALID_IMAGE");
  }
}
