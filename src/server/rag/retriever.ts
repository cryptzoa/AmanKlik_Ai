import "server-only";

import { GoogleGenAI } from "@google/genai";

import { env } from "@/lib/env";
import { redactText } from "@/lib/redaction";
import { reportServerError } from "@/server/observability/report-error";
import rawIndex from "@/server/rag/generated/knowledge-index.json";
import type { KnowledgeChunk, KnowledgeIndex, KnowledgeMatch, KnowledgeRetrieval } from "@/server/rag/types";
import { withAiConcurrency } from "@/server/ai/concurrency";

const index = rawIndex as KnowledgeIndex;
const MAX_QUERY_CHARS = 1_500;
const MIN_KEYWORD_SCORE = 5;
const MIN_EMBEDDING_SIMILARITY = 0.45;
const STOP_WORDS = new Set([
  "ada", "agar", "aku", "akan", "atau", "dari", "dan", "di", "dia", "ini", "itu", "jika", "ke", "kami",
  "kamu", "karena", "mau", "mereka", "pada", "saya", "sebagai", "sudah", "supaya", "yang", "untuk",
  "the", "a", "an", "is", "of", "to", "in", "on", "with",
]);

function normalized(input: string): string {
  return input.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("id-ID").replace(/[^a-z0-9]+/g, " ").trim();
}

function tokens(input: string): Set<string> {
  return new Set(normalized(input).split(/\s+/).filter((token) => token.length > 1 && !STOP_WORDS.has(token)));
}

function keywordScore(query: string, queryTokens: Set<string>, chunk: KnowledgeChunk): number {
  const normalizedQuery = normalized(query);
  let score = 0;

  for (const phrase of chunk.keywords) {
    const candidate = normalized(phrase);
    if (!candidate) continue;
    if (normalizedQuery.includes(candidate)) score += candidate.includes(" ") ? 9 : 5;
  }

  for (const topic of chunk.topics) {
    if (queryTokens.has(normalized(topic))) score += 4;
  }

  const chunkTokens = tokens(`${chunk.documentTitle} ${chunk.title} ${chunk.text}`);
  for (const token of queryTokens) {
    if (chunkTokens.has(token)) score += 1;
  }

  return score;
}

function cosineSimilarity(left: number[], right: number[]): number {
  if (!left.length || left.length !== right.length) return -1;
  let dot = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;

  for (let index = 0; index < left.length; index += 1) {
    dot += left[index] * right[index];
    leftMagnitude += left[index] ** 2;
    rightMagnitude += right[index] ** 2;
  }

  if (!leftMagnitude || !rightMagnitude) return -1;
  return dot / (Math.sqrt(leftMagnitude) * Math.sqrt(rightMagnitude));
}

function toMatch(chunk: KnowledgeChunk, score: number, mode: KnowledgeMatch["mode"]): KnowledgeMatch {
  const { embedding, ...safeChunk } = chunk;
  void embedding;
  return { ...safeChunk, score, mode };
}

function keywordRetrieve(query: string, topK: number): KnowledgeRetrieval {
  const queryTokens = tokens(query);
  const matches = index.chunks
    .map((chunk) => ({ chunk, score: keywordScore(query, queryTokens, chunk) }))
    .filter(({ score }) => score >= MIN_KEYWORD_SCORE)
    .sort((left, right) => right.score - left.score || left.chunk.id.localeCompare(right.chunk.id))
    .slice(0, topK)
    .map(({ chunk, score }) => toMatch(chunk, score, "keyword"));

  return { mode: matches.length ? "keyword" : "none", matches };
}

function hasEmbeddingIndex(): boolean {
  return Boolean(
    index.embeddingModel
      && index.embeddingDimension === env.RAG_EMBEDDING_DIM
      && index.chunks.length
      && index.chunks.every((chunk) => chunk.embedding.length === env.RAG_EMBEDDING_DIM),
  );
}

async function embedQuery(query: string): Promise<number[]> {
  return withAiConcurrency(async () => {
    const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
    const model = index.embeddingModel ?? env.GEMINI_EMBEDDING_MODEL;
    const embedding2 = model.includes("embedding-2");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), env.AI_TIMEOUT_MS);
    try {
      const response = await ai.models.embedContent({
        model,
        contents: embedding2 ? `task: search result | query: ${query}` : query,
        config: {
          abortSignal: controller.signal,
          ...(!embedding2 ? { taskType: "RETRIEVAL_QUERY" } : {}),
          outputDimensionality: env.RAG_EMBEDDING_DIM,
        },
      });
      return response.embeddings?.[0]?.values ?? [];
    } finally {
      clearTimeout(timeout);
    }
  });
}

export function getKnowledgeIndex(): KnowledgeIndex {
  return index;
}

export function formatKnowledgeForPrompt(matches: KnowledgeMatch[]): string[] {
  return matches.map((match) => [
    `Reference: ${match.documentTitle}  (${match.publisher}`,
    `Guidance: ${match.text}`,
  ].join("\n"));
}

export async function retrieveKnowledge(input: string, topK = env.RAG_TOP_K): Promise<KnowledgeRetrieval> {
  const query = redactText(input).slice(0, MAX_QUERY_CHARS).trim();
  if (!query) return { mode: "none", matches: [] };

  if (env.AI_MODE === "live" && hasEmbeddingIndex()) {
    try {
      const queryEmbedding = await embedQuery(query);
      if (queryEmbedding.length === env.RAG_EMBEDDING_DIM) {
        const matches = index.chunks
          .map((chunk) => ({ chunk, score: cosineSimilarity(queryEmbedding, chunk.embedding) }))
          .filter(({ score }) => score >= MIN_EMBEDDING_SIMILARITY)
          .sort((left, right) => right.score - left.score)
          .slice(0, topK)
          .map(({ chunk, score }) => toMatch(chunk, score, "embedding"));
        if (matches.length) return { mode: "embedding", matches };
      }
    } catch (error) {
      reportServerError("rag.embedding", error);
    }
  }

  return keywordRetrieve(query, topK);
}
