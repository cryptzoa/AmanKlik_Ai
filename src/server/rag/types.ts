export type KnowledgeChunk = {
  id: string;
  documentId: string;
  title: string;
  documentTitle: string;
  publisher: string;
  sourceUrl: string;
  retrievedAt: string;
  language: string;
  topics: string[];
  actionTags: string[];
  keywords: string[];
  text: string;
  embedding: number[];
};

export type KnowledgeIndex = {
  schemaVersion: 1;
  generatedAt: string;
  embeddingModel: string | null;
  embeddingDimension: number | null;
  chunks: KnowledgeChunk[];
};

export type KnowledgeMatch = Omit<KnowledgeChunk, "embedding"> & {
  score: number;
  mode: "embedding" | "keyword";
};

export type KnowledgeRetrieval = {
  mode: "embedding" | "keyword" | "none";
  matches: KnowledgeMatch[];
};
