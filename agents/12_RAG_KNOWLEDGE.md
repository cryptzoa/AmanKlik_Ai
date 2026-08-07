# 12 — RAG / Knowledge Retrieval

## Goal

Ground educational recommendations in a small curated corpus without a vector database.

## Architecture

```text
curated Markdown
 -> chunk
 -> gemini-embedding-2
 -> generated JSON index

runtime input
 -> query embedding
 -> local cosine similarity
 -> top K
 -> AI prompt/action mapper
```

## Corpus

`src/server/rag/corpus/`

Each source:

```yaml
---
id: official-source-topic
title: ...
publisher: ...
source_url: ...
retrieved_at: 2026-08-xx
language: id
---
```

Use concise paraphrased guidance, not long copies.

Initial topics:
- OTP/PIN/password;
- independent verification;
- after-transfer response;
- preserving evidence;
- official reporting direction;
- link/domain caution;
- impersonation.

## Generated index

`src/server/rag/generated/knowledge-index.json`

Recommended dimension: 768.

```ts
interface KnowledgeChunk {
  id: string;
  sourceId: string;
  title: string;
  sourceUrl: string;
  text: string;
  embedding: number[];
}
```

May be committed because corpus is curated/non-sensitive and demo stability matters.

## Script

`scripts/build-knowledge-index.ts`:
1. read Markdown/frontmatter;
2. chunk;
3. request embeddings;
4. deterministic output order;
5. never include secrets.

## Runtime
- normalize/redact query when practical;
- one query embedding;
- cosine similarity local;
- top 3 default;
- minimum similarity threshold;
- cap retrieved text.

## Keyword fallback

If embedding fails, deterministic topic keyword mapper retrieves corpus. Mark retrieval mode `keyword`.

## Screenshot

After Gemini extracts text:
- retrieve guidance;
- construct deterministic action plan;
- no second Gemini call solely to rewrite guidance.

## UI sources

If guidance derives from official corpus:
- title;
- publisher;
- official source link.

Never turn user-submitted suspicious URL into a source link.

## No vector DB

No Pinecone/Qdrant/Weaviate/pgvector for MVP.

## Corpus quality

- official/credible;
- paraphrase;
- retrieval date;
- remove outdated claims;
- human review every chunk;
- avoid absolute institution-specific statements unless sourced.

## Privacy

Do not persist query embeddings tied to private raw content. Runtime embeddings may remain memory-only.
