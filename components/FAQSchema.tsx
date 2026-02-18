// Server-compatible FAQ extraction

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  items: FAQItem[];
}

export function FAQSchema({ items }: FAQSchemaProps) {
  if (items.length === 0) return null;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  );
}

// Helper to extract FAQ items from article content
export function extractFAQFromContent(content: string): FAQItem[] {
  const faqs: FAQItem[] = [];
  
  // Pattern 1: **Q: question** / **A: answer**
  const qaPairs = content.matchAll(/\*\*Q:\s*([^*]+)\*\*\s*\n+([^*]+?)(?=\*\*Q:|## |$)/gi);
  for (const match of qaPairs) {
    faqs.push({
      question: match[1].trim(),
      answer: match[2].trim().replace(/\n+/g, ' '),
    });
  }

  // Pattern 2: ### Question text? / Answer paragraph
  const h3Questions = content.matchAll(/###\s*([^?\n]+\?)\s*\n+([^#]+?)(?=###|## |$)/g);
  for (const match of h3Questions) {
    const answer = match[2].trim().replace(/\n+/g, ' ').slice(0, 500); // Limit answer length
    if (answer.length > 20) { // Only include if answer is substantial
      faqs.push({
        question: match[1].trim(),
        answer: answer,
      });
    }
  }

  // Pattern 3: ## FAQ section with Q/A pairs
  const faqSection = content.match(/## FAQ\n+([\s\S]+?)(?=## |$)/i);
  if (faqSection) {
    const faqContent = faqSection[1];
    
    // Look for Q: / A: or **Q** / answer patterns
    const faqPairs = faqContent.matchAll(/\*\*(?:Q:\s*)?([^*?]+\??)\*\*\s*\n+([^*]+?)(?=\*\*|$)/gi);
    for (const match of faqPairs) {
      faqs.push({
        question: match[1].trim(),
        answer: match[2].trim().replace(/\n+/g, ' ').slice(0, 500),
      });
    }
  }

  return faqs;
}
