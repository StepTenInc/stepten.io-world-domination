/**
 * Internal Linking Engine - Frontend Usage Example
 * Shows how to integrate the internal linking engine into Step 6 (SEO Optimization)
 */

'use client';

import { useState, useEffect } from 'react';
import { InternalLinkingAnalysis, InternalLinkSuggestion } from '@/lib/seo-types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface InternalLinkingPanelProps {
  articleId: string;
  articleContent: string;
  articleTitle: string;
  focusKeyword: string;
  metaDescription?: string;
  onLinkApplied?: (suggestion: InternalLinkSuggestion) => void;
}

export function InternalLinkingPanel({
  articleId,
  articleContent,
  articleTitle,
  focusKeyword,
  metaDescription,
  onLinkApplied,
}: InternalLinkingPanelProps) {
  const [analysis, setAnalysis] = useState<InternalLinkingAnalysis | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);

  // Generate internal link suggestions
  const generateSuggestions = async () => {
    setIsGenerating(true);

    try {
      const response = await fetch('/api/seo/suggest-internal-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId,
          articleContent,
          metadata: {
            title: articleTitle,
            focusKeyword,
            metaDescription,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate suggestions');
      }

      const data: InternalLinkingAnalysis = await response.json();
      setAnalysis(data);

      toast.success(`Generated ${data.suggestions.length} link suggestions!`);
    } catch (error: any) {
      console.error('Error generating suggestions:', error);
      toast.error(error.message || 'Failed to generate link suggestions');
    } finally {
      setIsGenerating(false);
    }
  };

  // Apply a link suggestion
  const applySuggestion = (suggestion: InternalLinkSuggestion) => {
    setSelectedSuggestion(suggestion.id);

    // Update suggestion status to 'accepted'
    setAnalysis((prev) => {
      if (!prev) return null;

      return {
        ...prev,
        suggestions: prev.suggestions.map((s) =>
          s.id === suggestion.id ? { ...s, status: 'accepted' as const } : s
        ),
      };
    });

    // Callback to parent component to insert the link
    onLinkApplied?.(suggestion);

    toast.success(`Applied link to "${suggestion.targetArticle.title}"`);
  };

  // Reject a link suggestion
  const rejectSuggestion = (suggestionId: string) => {
    setAnalysis((prev) => {
      if (!prev) return null;

      return {
        ...prev,
        suggestions: prev.suggestions.map((s) =>
          s.id === suggestionId ? { ...s, status: 'rejected' as const } : s
        ),
      };
    });

    toast('Link suggestion rejected');
  };

  // Calculate status color
  const getStatusColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Internal Linking Suggestions</h3>
          <p className="text-sm text-muted-foreground">
            AI-powered suggestions for contextual internal links
          </p>
        </div>

        <Button
          onClick={generateSuggestions}
          disabled={isGenerating}
        >
          {isGenerating ? 'Analyzing...' : 'Generate Suggestions'}
        </Button>
      </div>

      {/* Metrics */}
      {analysis && (
        <div className="grid grid-cols-4 gap-4">
          <div className="rounded-lg border p-4">
            <div className="text-2xl font-bold">{analysis.metrics.totalInternalLinks}</div>
            <div className="text-sm text-muted-foreground">Total Links</div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="text-2xl font-bold">
              {analysis.metrics.optimalRange[0]}-{analysis.metrics.optimalRange[1]}
            </div>
            <div className="text-sm text-muted-foreground">Optimal Range</div>
          </div>

          <div className="rounded-lg border p-4">
            <div className={`text-2xl font-bold ${analysis.metrics.orphanedContent ? 'text-red-600' : 'text-green-600'}`}>
              {analysis.metrics.orphanedContent ? 'Yes' : 'No'}
            </div>
            <div className="text-sm text-muted-foreground">Orphaned</div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="text-2xl font-bold">
              {Math.round(analysis.metrics.topicClusterCoverage)}%
            </div>
            <div className="text-sm text-muted-foreground">Coverage</div>
          </div>
        </div>
      )}

      {/* Suggestions List */}
      {analysis && analysis.suggestions.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium">Suggested Links ({analysis.suggestions.length})</h4>

          {analysis.suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className={`rounded-lg border p-4 transition-all ${
                suggestion.status === 'accepted'
                  ? 'border-green-500 bg-green-50'
                  : suggestion.status === 'rejected'
                  ? 'border-red-500 bg-red-50 opacity-50'
                  : 'hover:border-primary'
              }`}
            >
              {/* Target Article */}
              <div className="mb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h5 className="font-medium">{suggestion.targetArticle.title}</h5>
                    <p className="text-sm text-muted-foreground">
                      /{suggestion.targetArticle.slug}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {suggestion.status === 'suggested' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => applySuggestion(suggestion)}
                        >
                          Apply
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => rejectSuggestion(suggestion.id)}
                        >
                          Reject
                        </Button>
                      </>
                    )}

                    {suggestion.status === 'accepted' && (
                      <div className="rounded bg-green-500 px-3 py-1 text-sm text-white">
                        Applied
                      </div>
                    )}

                    {suggestion.status === 'rejected' && (
                      <div className="rounded bg-red-500 px-3 py-1 text-sm text-white">
                        Rejected
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Anchor Text */}
              <div className="mb-3 rounded bg-muted p-2">
                <span className="font-mono text-sm">
                  Anchor text: &quot;{suggestion.anchorText}&quot;
                </span>
              </div>

              {/* Metrics */}
              <div className="mb-3 flex gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Relevance: </span>
                  <span className={`font-semibold ${getStatusColor(suggestion.relevanceScore)}`}>
                    {suggestion.relevanceScore}/100
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground">Similarity: </span>
                  <span className="font-semibold">
                    {Math.round(suggestion.semanticSimilarity * 100)}%
                  </span>
                </div>

                {suggestion.bidirectional && (
                  <div className="text-blue-600">
                    <span>⇄ Bidirectional</span>
                  </div>
                )}
              </div>

              {/* Placement */}
              <div className="mb-2 text-sm">
                <div className="text-muted-foreground">
                  Placement: Paragraph {suggestion.placement.paragraphIndex + 1},
                  Sentence {suggestion.placement.sentenceIndex + 1}
                </div>
                {suggestion.placement.context && (
                  <div className="mt-1 italic text-muted-foreground">
                    &quot;...{suggestion.placement.context}...&quot;
                  </div>
                )}
              </div>

              {/* Reasoning */}
              <div className="rounded border-l-4 border-primary bg-muted/50 p-2 text-sm">
                <span className="font-medium">Why this link? </span>
                {suggestion.reasoning}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No suggestions */}
      {analysis && analysis.suggestions.length === 0 && (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">
            No internal link suggestions found. This could mean:
          </p>
          <ul className="mt-2 text-sm text-muted-foreground">
            <li>• This is your first article</li>
            <li>• No related content exists yet</li>
            <li>• The minimum relevance threshold wasn't met</li>
          </ul>
        </div>
      )}

      {/* Existing Links */}
      {analysis && analysis.existingLinks.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Existing Internal Links ({analysis.existingLinks.length})</h4>

          <div className="space-y-2">
            {analysis.existingLinks.map((link, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded border p-2 text-sm"
              >
                <span className="font-mono">&quot;{link.anchorText}&quot;</span>
                <span className="text-muted-foreground">→ {link.targetId}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isGenerating && (
        <div className="flex items-center justify-center py-12">
          <div className="space-y-3 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
            <p className="text-sm text-muted-foreground">
              Analyzing article and generating suggestions...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Example usage in Step 6 component
export function Step6Example() {
  const [articleContent, setArticleContent] = useState('<h1>My Article</h1><p>Content...</p>');

  const handleLinkApplied = (suggestion: InternalLinkSuggestion) => {
    // Parse the article content and insert the link
    // This is a simplified example - you'd need proper HTML parsing
    const { placement, anchorText, targetArticle } = suggestion;

    // Create the link HTML
    const linkHtml = `<a href="${targetArticle.url}">${anchorText}</a>`;

    // Insert the link at the specified position
    // (You would implement proper HTML manipulation here)
    console.log('Inserting link:', linkHtml, 'at', placement);

    // Update article content
    setArticleContent((prev) => {
      // Your insertion logic here
      return prev; // Placeholder
    });
  };

  return (
    <div className="container mx-auto py-8">
      <InternalLinkingPanel
        articleId="draft-123"
        articleContent={articleContent}
        articleTitle="Complete Guide to SEO"
        focusKeyword="SEO optimization"
        metaDescription="Learn how to optimize your website"
        onLinkApplied={handleLinkApplied}
      />
    </div>
  );
}

// Helper function to insert link into HTML content
export function insertLinkIntoContent(
  htmlContent: string,
  suggestion: InternalLinkSuggestion
): string {
  // Parse HTML into paragraphs
  const paragraphs = htmlContent.split(/<\/?p>/gi).filter(Boolean);

  // Get target paragraph
  const targetParagraph = paragraphs[suggestion.placement.paragraphIndex];
  if (!targetParagraph) {
    console.warn('Target paragraph not found');
    return htmlContent;
  }

  // Split paragraph into sentences
  const sentences = targetParagraph.split(/(?<=[.!?])\s+/);
  const targetSentence = sentences[suggestion.placement.sentenceIndex];

  if (!targetSentence) {
    console.warn('Target sentence not found');
    return htmlContent;
  }

  // Create link HTML
  const linkHtml = `<a href="${suggestion.targetArticle.url}">${suggestion.anchorText}</a>`;

  // Insert link at position
  const updatedSentence =
    targetSentence.slice(0, suggestion.placement.position) +
    linkHtml +
    targetSentence.slice(suggestion.placement.position);

  // Update the sentence in the array
  sentences[suggestion.placement.sentenceIndex] = updatedSentence;

  // Rejoin sentences
  const updatedParagraph = sentences.join(' ');

  // Update paragraph in array
  paragraphs[suggestion.placement.paragraphIndex] = updatedParagraph;

  // Rejoin paragraphs with <p> tags
  return paragraphs.map((p) => `<p>${p}</p>`).join('');
}
