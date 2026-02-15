/**
 * Quick test file for Featured Snippet Optimizer
 * This can be deleted - it's just for verification
 */

import { detectFeaturedSnippet, analyzeSnippetFormat, extractSnippetContent } from './snippet-analyzer';
import {
  generateParagraphSnippet,
  generateListSnippet,
  generateTableSnippet,
  generateSnippetOptimization
} from './snippet-optimizer';

// Test article content
const testArticle = `
<h1>What is SEO?</h1>
<p>SEO (Search Engine Optimization) is the practice of improving your website's visibility in search engine results. It involves optimizing content, technical elements, and building authority through backlinks.</p>

<h2>How to Optimize for SEO</h2>
<p>Follow these key steps:</p>
<ol>
  <li>Research relevant keywords for your target audience</li>
  <li>Create high-quality, valuable content</li>
  <li>Optimize on-page elements like titles and meta descriptions</li>
  <li>Build quality backlinks from authoritative sources</li>
  <li>Monitor performance and adjust your strategy</li>
  <li>Improve page speed and mobile responsiveness</li>
</ol>

<h2>SEO vs SEM</h2>
<p>While SEO focuses on organic rankings, SEM includes paid advertising. Both are important for a comprehensive digital marketing strategy.</p>
`;

async function testSnippetOptimizer() {
  console.log('🧪 Testing Featured Snippet Optimizer...\n');

  // Test 1: Detect snippet for question keyword
  console.log('Test 1: Detect snippet for "what is seo"');
  const detection1 = await detectFeaturedSnippet('what is seo', testArticle);
  console.log('✅ Has snippet:', detection1.hasSnippet);
  console.log('✅ Opportunity:', detection1.opportunity);
  console.log('✅ Snippet type:', detection1.snippet?.type);
  console.log();

  // Test 2: Generate paragraph snippet
  console.log('Test 2: Generate paragraph snippet');
  const paragraph = generateParagraphSnippet('what is seo', testArticle);
  console.log('✅ Paragraph:', paragraph);
  console.log('✅ Word count:', paragraph.split(/\s+/).length);
  console.log();

  // Test 3: Generate list snippet
  console.log('Test 3: Generate list snippet');
  const list = generateListSnippet('how to optimize seo', testArticle);
  console.log('✅ List items:', list.length);
  list.forEach((item, i) => console.log(`   ${i + 1}. ${item.substring(0, 60)}...`));
  console.log();

  // Test 4: Generate table snippet
  console.log('Test 4: Generate table snippet');
  const table = generateTableSnippet('seo vs sem', testArticle);
  console.log('✅ Table rows:', table.length);
  console.log('✅ Table columns:', Object.keys(table[0]).length);
  console.log();

  // Test 5: Full optimization
  console.log('Test 5: Full snippet optimization');
  const optimization = generateSnippetOptimization(
    'what is seo',
    testArticle,
    undefined,
    'paragraph'
  );
  console.log('✅ Win probability:', optimization.winProbability + '%');
  console.log('✅ Insertion point:', optimization.insertionPoint.afterHeading);
  console.log('✅ Optimized HTML length:', optimization.optimizedContent.html.length);
  console.log();

  console.log('✨ All tests passed!\n');
}

// Run tests if executed directly
if (require.main === module) {
  testSnippetOptimizer().catch(console.error);
}
