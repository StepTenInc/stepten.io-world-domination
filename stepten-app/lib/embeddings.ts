/**
 * Embeddings Utility
 * Functions for generating and working with OpenAI text embeddings
 * Used for semantic similarity analysis in internal linking
 */

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Article embedding data structure for Supabase storage
 */
export interface ArticleEmbedding {
  article_id: string;
  embedding: number[];
  content_preview: string;
  created_at: string;
  updated_at: string;
}

/**
 * Generates a text embedding using OpenAI's text-embedding-3-small model
 *
 * @param text - The text content to embed (article content, title, etc.)
 * @param model - The OpenAI embedding model to use (default: text-embedding-3-small)
 * @returns Promise resolving to the embedding vector (1536 dimensions)
 * @throws Error if OpenAI API key is missing or API call fails
 *
 * @example
 * ```ts
 * const embedding = await generateEmbedding("This is my article content...");
 * console.log(embedding.length); // 1536
 * ```
 */
export async function generateEmbedding(
  text: string,
  model: string = "text-embedding-3-small"
): Promise<number[]> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }

    // Truncate text to avoid exceeding token limits (8191 tokens for text-embedding-3-small)
    // Approximately 4 characters per token, so we limit to ~32,000 characters
    const truncatedText = text.slice(0, 32000);

    const response = await openai.embeddings.create({
      model,
      input: truncatedText,
      encoding_format: "float",
    });

    if (!response.data || response.data.length === 0) {
      throw new Error("No embedding returned from OpenAI API");
    }

    return response.data[0].embedding;
  } catch (error: any) {
    console.error("Error generating embedding:", error);
    throw new Error(`Failed to generate embedding: ${error.message}`);
  }
}

/**
 * Calculates cosine similarity between two embedding vectors
 * Returns a value between -1 and 1, where 1 means identical, 0 means orthogonal, -1 means opposite
 *
 * @param vecA - First embedding vector
 * @param vecB - Second embedding vector
 * @returns Cosine similarity score (0-1 range, higher = more similar)
 * @throws Error if vectors have different dimensions
 *
 * @example
 * ```ts
 * const similarity = calculateCosineSimilarity(embedding1, embedding2);
 * console.log(similarity); // 0.85 (highly similar)
 * ```
 */
export function calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error(
      `Vector dimensions don't match: ${vecA.length} vs ${vecB.length}`
    );
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    magnitudeA += vecA[i] * vecA[i];
    magnitudeB += vecB[i] * vecB[i];
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  const similarity = dotProduct / (magnitudeA * magnitudeB);

  // Normalize to 0-1 range (cosine similarity is naturally -1 to 1)
  // In practice, text embeddings are rarely negative
  return Math.max(0, Math.min(1, similarity));
}

/**
 * Finds semantically similar articles based on embedding similarity
 *
 * @param targetEmbedding - The embedding vector of the current article
 * @param candidateArticles - Array of articles with their embeddings
 * @param topK - Number of top similar articles to return (default: 10)
 * @param minSimilarity - Minimum similarity threshold (0-1, default: 0.5)
 * @returns Array of articles sorted by similarity (highest first)
 *
 * @example
 * ```ts
 * const similarArticles = findSimilarArticles(
 *   currentEmbedding,
 *   allArticles,
 *   5,  // top 5
 *   0.7 // minimum 70% similarity
 * );
 * ```
 */
export function findSimilarArticles<T extends { embedding: number[] }>(
  targetEmbedding: number[],
  candidateArticles: T[],
  topK: number = 10,
  minSimilarity: number = 0.5
): Array<T & { similarityScore: number }> {
  try {
    // Calculate similarity for each article
    const articlesWithSimilarity = candidateArticles.map((article) => {
      const similarity = calculateCosineSimilarity(targetEmbedding, article.embedding);
      return {
        ...article,
        similarityScore: similarity,
      };
    });

    // Filter by minimum similarity and sort by score (descending)
    const filtered = articlesWithSimilarity
      .filter((article) => article.similarityScore >= minSimilarity)
      .sort((a, b) => b.similarityScore - a.similarityScore);

    // Return top K results
    return filtered.slice(0, topK);
  } catch (error: any) {
    console.error("Error finding similar articles:", error);
    return [];
  }
}

/**
 * Caches an article embedding in Supabase for future use
 *
 * @param supabase - Supabase client instance
 * @param articleId - Unique identifier for the article
 * @param embedding - The embedding vector to cache
 * @param contentPreview - Short preview of the article content (for debugging)
 * @returns Promise resolving to true if successful, false otherwise
 *
 * @example
 * ```ts
 * const success = await cacheEmbedding(
 *   supabase,
 *   "article-123",
 *   embeddingVector,
 *   "This is the first 200 characters..."
 * );
 * ```
 */
export async function cacheEmbedding(
  supabase: any,
  articleId: string,
  embedding: number[],
  contentPreview: string
): Promise<boolean> {
  try {
    const now = new Date().toISOString();

    const { error } = await supabase.from("article_embeddings").upsert(
      {
        article_id: articleId,
        embedding,
        content_preview: contentPreview.slice(0, 200),
        created_at: now,
        updated_at: now,
      },
      {
        onConflict: "article_id",
      }
    );

    if (error) {
      console.error("Error caching embedding:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error caching embedding:", error);
    return false;
  }
}

/**
 * Retrieves a cached embedding from Supabase
 *
 * @param supabase - Supabase client instance
 * @param articleId - Unique identifier for the article
 * @returns Promise resolving to the embedding vector if found, null otherwise
 *
 * @example
 * ```ts
 * const cachedEmbedding = await getCachedEmbedding(supabase, "article-123");
 * if (cachedEmbedding) {
 *   // Use cached embedding
 * } else {
 *   // Generate new embedding
 * }
 * ```
 */
export async function getCachedEmbedding(
  supabase: any,
  articleId: string
): Promise<number[] | null> {
  try {
    const { data, error } = await supabase
      .from("article_embeddings")
      .select("embedding")
      .eq("article_id", articleId)
      .single();

    if (error || !data) {
      return null;
    }

    return data.embedding;
  } catch (error) {
    console.error("Error retrieving cached embedding:", error);
    return null;
  }
}

/**
 * Generates or retrieves a cached embedding for an article
 * This is the recommended high-level function to use
 *
 * @param supabase - Supabase client instance
 * @param articleId - Unique identifier for the article
 * @param articleContent - Full article content (used if cache miss)
 * @returns Promise resolving to the embedding vector
 *
 * @example
 * ```ts
 * const embedding = await getOrGenerateEmbedding(
 *   supabase,
 *   "article-123",
 *   "Full article content here..."
 * );
 * ```
 */
export async function getOrGenerateEmbedding(
  supabase: any,
  articleId: string,
  articleContent: string
): Promise<number[]> {
  // Try to get from cache first
  const cached = await getCachedEmbedding(supabase, articleId);
  if (cached) {
    return cached;
  }

  // Generate new embedding
  const embedding = await generateEmbedding(articleContent);

  // Cache for future use (don't await, fire and forget)
  cacheEmbedding(
    supabase,
    articleId,
    embedding,
    articleContent.slice(0, 200)
  ).catch((err) => console.warn("Failed to cache embedding:", err));

  return embedding;
}
