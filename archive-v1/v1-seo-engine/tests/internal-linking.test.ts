/**
 * Internal Linking Engine Tests
 * Tests for embeddings and internal linking functionality
 */

import { describe, expect, test } from '@jest/globals';
import {
  calculateCosineSimilarity,
  findSimilarArticles,
} from '../lib/embeddings';
import { calculateRelevanceScore } from '../lib/internal-linking';

describe('Embeddings Utility', () => {
  test('calculateCosineSimilarity - identical vectors', () => {
    const vecA = [1, 0, 0];
    const vecB = [1, 0, 0];
    const similarity = calculateCosineSimilarity(vecA, vecB);
    expect(similarity).toBe(1); // Identical vectors
  });

  test('calculateCosineSimilarity - orthogonal vectors', () => {
    const vecA = [1, 0, 0];
    const vecB = [0, 1, 0];
    const similarity = calculateCosineSimilarity(vecA, vecB);
    expect(similarity).toBe(0); // Orthogonal vectors
  });

  test('calculateCosineSimilarity - similar vectors', () => {
    const vecA = [1, 0.5, 0];
    const vecB = [1, 0.6, 0];
    const similarity = calculateCosineSimilarity(vecA, vecB);
    expect(similarity).toBeGreaterThan(0.95); // Very similar
    expect(similarity).toBeLessThanOrEqual(1);
  });

  test('calculateCosineSimilarity - different dimensions throws error', () => {
    const vecA = [1, 0, 0];
    const vecB = [1, 0];
    expect(() => calculateCosineSimilarity(vecA, vecB)).toThrow();
  });

  test('calculateCosineSimilarity - zero vectors', () => {
    const vecA = [0, 0, 0];
    const vecB = [1, 0, 0];
    const similarity = calculateCosineSimilarity(vecA, vecB);
    expect(similarity).toBe(0);
  });

  test('findSimilarArticles - filters by minimum similarity', () => {
    const targetEmbedding = [1, 0, 0];
    const candidates = [
      { id: '1', embedding: [1, 0, 0] },      // similarity: 1.0
      { id: '2', embedding: [0.9, 0.1, 0] },  // similarity: ~0.99
      { id: '3', embedding: [0.5, 0.5, 0] },  // similarity: ~0.71
      { id: '4', embedding: [0, 1, 0] },      // similarity: 0.0
    ];

    const results = findSimilarArticles(targetEmbedding, candidates, 10, 0.5);

    expect(results.length).toBe(3); // Only 3 above threshold
    expect(results[0].id).toBe('1'); // Highest similarity first
    expect(results[0].similarityScore).toBe(1);
  });

  test('findSimilarArticles - respects topK limit', () => {
    const targetEmbedding = [1, 0, 0];
    const candidates = [
      { id: '1', embedding: [1, 0, 0] },
      { id: '2', embedding: [0.9, 0.1, 0] },
      { id: '3', embedding: [0.8, 0.2, 0] },
      { id: '4', embedding: [0.7, 0.3, 0] },
    ];

    const results = findSimilarArticles(targetEmbedding, candidates, 2, 0);

    expect(results.length).toBe(2); // Only top 2
    expect(results[0].id).toBe('1');
    expect(results[1].id).toBe('2');
  });

  test('findSimilarArticles - handles empty candidates', () => {
    const targetEmbedding = [1, 0, 0];
    const candidates: any[] = [];

    const results = findSimilarArticles(targetEmbedding, candidates, 10, 0.5);

    expect(results.length).toBe(0);
  });
});

describe('Internal Linking Engine', () => {
  test('calculateRelevanceScore - perfect match', () => {
    const score = calculateRelevanceScore(
      1.0,    // 100% semantic similarity
      5,      // 5 topics overlap
      true    // keyword match
    );

    expect(score).toBe(100); // 60 + 30 + 10 = 100
  });

  test('calculateRelevanceScore - good match', () => {
    const score = calculateRelevanceScore(
      0.8,    // 80% semantic similarity
      3,      // 3 topics overlap
      true    // keyword match
    );

    expect(score).toBe(76); // 48 + 18 + 10 = 76
  });

  test('calculateRelevanceScore - moderate match', () => {
    const score = calculateRelevanceScore(
      0.5,    // 50% semantic similarity
      1,      // 1 topic overlap
      false   // no keyword match
    );

    expect(score).toBe(36); // 30 + 6 + 0 = 36
  });

  test('calculateRelevanceScore - weak match', () => {
    const score = calculateRelevanceScore(
      0.2,    // 20% semantic similarity
      0,      // no topics overlap
      false   // no keyword match
    );

    expect(score).toBe(12); // 12 + 0 + 0 = 12
  });

  test('calculateRelevanceScore - caps topic overlap at 30 points', () => {
    const score = calculateRelevanceScore(
      0,      // 0% semantic similarity
      10,     // 10 topics (should cap at 30 points)
      false   // no keyword match
    );

    expect(score).toBe(30); // 0 + 30 (capped) + 0 = 30
  });
});

describe('Edge Cases', () => {
  test('handles very large embeddings (1536 dimensions)', () => {
    const vecA = Array(1536).fill(0);
    vecA[0] = 1;

    const vecB = Array(1536).fill(0);
    vecB[0] = 1;

    const similarity = calculateCosineSimilarity(vecA, vecB);
    expect(similarity).toBe(1);
  });

  test('handles normalized embeddings', () => {
    // Embeddings are typically normalized (magnitude = 1)
    const magnitude = Math.sqrt(0.5 * 0.5 + 0.5 * 0.5 + 0.5 * 0.5 + 0.5 * 0.5);
    const vecA = [0.5 / magnitude, 0.5 / magnitude, 0.5 / magnitude, 0.5 / magnitude];
    const vecB = [0.5 / magnitude, 0.5 / magnitude, 0.5 / magnitude, 0.5 / magnitude];

    const similarity = calculateCosineSimilarity(vecA, vecB);
    expect(similarity).toBeCloseTo(1, 5);
  });

  test('handles negative values in embeddings', () => {
    const vecA = [1, -1, 0];
    const vecB = [-1, 1, 0];

    const similarity = calculateCosineSimilarity(vecA, vecB);
    expect(similarity).toBe(0); // Negative correlation normalized to 0
  });
});

// Integration test examples (require actual API keys - skip in CI)
describe.skip('Integration Tests', () => {
  test('generateEmbedding - creates valid embedding', async () => {
    // This test requires OPENAI_API_KEY
    const { generateEmbedding } = require('../lib/embeddings');

    const embedding = await generateEmbedding('This is a test article about SEO.');

    expect(embedding).toBeDefined();
    expect(embedding.length).toBe(1536);
    expect(embedding[0]).toBeGreaterThan(-1);
    expect(embedding[0]).toBeLessThan(1);
  });

  test('API endpoint returns valid response', async () => {
    // This test requires running server and valid API keys
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:33333'}/api/seo/suggest-internal-links`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        articleId: 'test-123',
        articleContent: '<h1>Test</h1><p>Content here</p>',
        metadata: {
          title: 'Test Article',
          focusKeyword: 'test',
        },
      }),
    });

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('currentArticleId');
    expect(data).toHaveProperty('suggestions');
    expect(data).toHaveProperty('metrics');
  });
});
