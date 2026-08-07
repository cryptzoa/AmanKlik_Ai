import "dotenv/config";

import { readFile, readdir, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import { GoogleGenAI } from "@google/genai";

const projectRoot = process.cwd();
const corpusDirectory = path.join(projectRoot, "src/server/rag/corpus");
const outputFile = path.join(projectRoot, "src/server/rag/generated/knowledge-index.json");
const keywordOnly = process.argv.includes("--keyword-only");
const optionalEmbedding = process.argv.includes("--optional");
const embeddingModel = process.env.GEMINI_EMBEDDING_MODEL || "gemini-embedding-2";
const embeddingDimension = Number(process.env.RAG_EMBEDDING_DIM || 768);

function parseList(value = "") {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function parseDocument(source, filename) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`Frontmatter tidak valid: ${filename}`);

  const metadata = Object.fromEntries(
    match[1].split("\n").filter(Boolean).map((line) => {
      const separator = line.indexOf(":");
      if (separator < 1) throw new Error(`Baris frontmatter tidak valid di ${filename}`);
      return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()];
    }),
  );

  const required = ["id", "title", "publisher", "source_url", "retrieved_at", "language"];
  for (const key of required) {
    if (!metadata[key]) throw new Error(`Field ${key} wajib ada di ${filename}`);
  }

  const sections = match[2].trim().split(/\n(?=##\s)/).filter(Boolean);
  return sections.map((section, index) => {
    const heading = section.match(/^##\s+(.+)$/m)?.[1]?.trim() || metadata.title;
    const text = section.replace(/^##\s+.+\n+/, "").trim();
    return {
      id: `${metadata.id}-${index + 1}`,
      documentId: metadata.id,
      title: heading,
      documentTitle: metadata.title,
      publisher: metadata.publisher,
      sourceUrl: metadata.source_url,
      retrievedAt: metadata.retrieved_at,
      language: metadata.language,
      topics: parseList(metadata.topics),
      actionTags: parseList(metadata.action_tags),
      keywords: parseList(metadata.keywords),
      text,
      embedding: [],
    };
  });
}

async function embedDocuments(chunks) {
  if (keywordOnly) return chunks;
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY wajib untuk membangun embedding; gunakan --keyword-only untuk fallback lokal.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await ai.models.embedContent({
    model: embeddingModel,
    contents: chunks.map((chunk) => `${chunk.documentTitle}\n${chunk.title}\n${chunk.text}`),
    config: {
      taskType: "RETRIEVAL_DOCUMENT",
      outputDimensionality: embeddingDimension,
    },
  });

  if (!response.embeddings || response.embeddings.length !== chunks.length) {
    throw new Error("Jumlah embedding tidak sesuai dengan jumlah chunk.");
  }

  return chunks.map((chunk, index) => {
    const embedding = response.embeddings?.[index]?.values;
    if (!embedding || embedding.length !== embeddingDimension) {
      throw new Error(`Dimensi embedding tidak valid untuk ${chunk.id}.`);
    }
    return { ...chunk, embedding };
  });
}

const filenames = (await readdir(corpusDirectory)).filter((name) => name.endsWith(".md")).sort();
const chunks = [];
for (const filename of filenames) {
  chunks.push(...parseDocument(await readFile(path.join(corpusDirectory, filename), "utf8"), filename));
}

let indexedChunks;
let embeddingEnabled = !keywordOnly;
try {
  indexedChunks = await embedDocuments(chunks);
} catch (error) {
  if (!optionalEmbedding) throw error;
  indexedChunks = chunks;
  embeddingEnabled = false;
  process.stderr.write("Knowledge embedding unavailable; continuing with deterministic keyword index.\n");
}
const payload = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  embeddingModel: embeddingEnabled ? embeddingModel : null,
  embeddingDimension: embeddingEnabled ? embeddingDimension : null,
  chunks: indexedChunks,
};

await mkdir(path.dirname(outputFile), { recursive: true });
await writeFile(outputFile, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
process.stdout.write(`Knowledge index: ${indexedChunks.length} chunk (${embeddingEnabled ? "embedding" : "keyword"})\n`);
