# Step 3: AI Framework Generation

## Overview
Step 3 generates an SEO-optimized article framework using Claude Sonnet 4. The framework includes metadata, outline structure, SEO checklists, and writing guidelines tailored to achieve Rank Math 100/100 scores.

## File Location
`/app/(admin)/admin/seo/articles/new/step-3-framework/page.tsx`

## Dependencies
- **Step 1 Data**: Article idea text
- **Step 2 Data**: Research results, selected keywords, selected links
- **API Route**: `/api/seo/generate-framework`

## User Flow

### 1. Prerequisites Check
- Verifies Step 1 and Step 2 are complete
- Redirects to Step 1 if prerequisites missing
- Loads existing framework if available

### 2. Framework Generation
**Trigger**: User clicks "Generate Framework" button

**API Request**:
```typescript
POST /api/seo/generate-framework
{
  idea: string,
  research: Step2Data,
  selectedKeywords: string[],
  selectedLinks: Link[],
  mainKeyword: string
}
```

**Response Structure**:
```typescript
{
  success: boolean,
  framework: {
    metadata: {
      title: string,           // H1 title
      slug: string,            // URL-friendly slug
      metaDescription: string, // 160 char meta
      focusKeyword: string,    // Primary SEO keyword
      wordCountTarget: number, // Target word count
      readingLevel: string     // Target reading level
    },
    outline: Section[],        // Article structure
    seoChecklist: object,      // Rank Math optimizations
    writingGuidelines: {
      tone: string,
      perspective: string,
      voiceCharacteristics: string[],
      antiAITactics: string[]
    }
  }
}
```

### 3. Framework Display

#### Metadata Card
- **Title (H1)**: Editable input with character count
- **URL Slug**: Editable input
- **Meta Description**: Editable textarea (160 char limit)
- **Focus Keyword**: Display only
- **Word Count Target**: Display only
- **Reading Level**: Display only

#### Article Outline
Expandable/collapsible sections showing:

**For each section**:
- Section type (H1, H2, Introduction, Conclusion)
- Section heading text
- Target word count
- Writing instructions (when available)
- Must-include elements (when available)
- Subsections (H3 level) with:
  - Heading text
  - Word count
  - Content elements to include
  - Link placements (with anchor text, relation, URL)
  - Specific instructions

**Interaction**:
- Click section header to expand/collapse
- First section expanded by default
- Visual indicators: FolderOpen (expanded) / Folder (collapsed)

#### SEO Checklist Card
Displays Rank Math optimization requirements:
- Title optimization
- Meta description optimization
- Keyword density targets
- Internal linking requirements
- External linking requirements
- Image optimization needs
- Schema markup requirements

#### Writing Guidelines Card
Shows personality and style requirements:
- Tone & perspective
- Voice characteristics
- Anti-AI detection tactics
- Humanization strategies

### 4. Data Persistence
Framework is saved to localStorage via `seoStorage.saveArticleData()`:
```typescript
{
  step3: {
    ...framework,
    timestamp: ISO string
  },
  currentStep: 3
}
```

### 5. Navigation
- **Back**: Returns to Step 2 (Research & Planning)
- **Save Framework**: Manual save trigger
- **Continue to Writing**: Proceeds to Step 4 (disabled until framework generated)

## UI Components

### Progress Bar
- Shows "Step 3 of 8"
- Animated gradient progress to 37.5%
- Pulsing glow effects

### Cards
All cards feature:
- Gradient backgrounds
- Hover effects with glow
- Grid dot pattern overlay
- Corner accents on hover
- Smooth transitions

### Animations
- **Loading State**: Rotating loader with pulsing dots
- **Section Reveal**: Staggered fade-in on render
- **Hover Effects**: Scale and glow transitions
- **Button Shine**: Animated gradient sweep

## Error Handling

### Missing Prerequisites
```typescript
if (!step1 || !step2) {
    alert("Please complete Steps 1 and 2 first.");
    router.push("/admin/seo/articles/new/step-1-idea");
}
```

### API Failures
```typescript
try {
    // API call
} catch (error) {
    alert(`Failed to generate framework: ${error.message}`);
}
```

## State Management

```typescript
const [isGenerating, setIsGenerating] = useState(false);
const [frameworkGenerated, setFrameworkGenerated] = useState(false);
const [framework, setFramework] = useState<any>(null);
const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));
```

## Recent Fixes

### Build Error Fix (2026-01-14)
**Issue**: Parsing error - "Unterminated regexp literal" at line 474

**Root Cause**: Missing closing `)}` for conditional rendering block before `</motion.div>` tag

**Solution**: Added `)}` on line 474 to properly close the conditional rendering that starts on line 417

```tsx
// Before (incorrect)
</div>
</motion.div>

// After (correct)
</div>
)}
</motion.div>
```

## Next  Step
After framework generation and approval, user proceeds to **Step 4: Article Writing**
