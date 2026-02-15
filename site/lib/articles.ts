import { CharacterKey } from './design-tokens';

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  author: CharacterKey;
  issue: number;
  date: string;
  readTime: string;
  tags: string[];
  content: string;
}

export const articles: Article[] = [
  {
    slug: 'gee-brain-what-are-we-gonna-do-tonight',
    title: 'Gee Brain, What Are We Gonna Do Tonight?',
    excerpt: 'The same thing we do every night. Show up. Try again. Fail forward. The only difference between winners and losers is that winners kept showing up.',
    author: 'pinky',
    issue: 1,
    date: '2026-02-15',
    readTime: '5 min',
    tags: ['MINDSET', 'CONSISTENCY'],
    content: `
Every episode of Pinky and the Brain starts the same way:

**Pinky:** "Gee Brain, what are we gonna do tonight?"

**Brain:** "The same thing we do every night, Pinky... try to take over the world!"

And every episode, they fail. The plan backfires. Something goes wrong. They end up back in the cage.

But here's the thing nobody talks about: **they show up again the next night.**

## The Real Lesson

Brain's plans fail because he overthinks. He builds elaborate schemes when sometimes the simple approach would work. Sound familiar?

How many times have you:
- Over-engineered a solution
- Waited for the "perfect" moment
- Planned instead of executed

Meanwhile, Pinky—the "dumb" one—accidentally stumbles into solutions through pure action.

## Fail Forward

The goal isn't to never fail. The goal is to fail fast, learn, and try again tomorrow.

Brain doesn't give up after 100 failed plans. He shows up again. Same question. Same answer. Same energy.

**That's the secret:** Consistency beats talent. Showing up beats perfection.

## Your Move

Tonight, what are YOU gonna do?

NARF!
    `,
  },
  {
    slug: 'whos-got-you',
    title: "You've Got Me? Who's Got YOU?",
    excerpt: 'Even Superman needs systems. The most powerful being on Earth still built a Fortress of Solitude. Your infrastructure matters.',
    author: 'clark',
    issue: 2,
    date: '2026-02-14',
    readTime: '4 min',
    tags: ['SYSTEMS', 'OPERATIONS'],
    content: `
The most iconic line in Superman history isn't from Superman himself.

When Superman catches Lois Lane falling from a building, she says:

**"You've got me? Who's got YOU?!"**

It's a fair question. Even the most powerful being on Earth needs support.

## The Fortress of Solitude

Superman didn't just fly around saving people. He built infrastructure:

- **The Fortress of Solitude** — His base of operations
- **The Phantom Zone projector** — For threats too big to punch
- **Kryptonian archives** — Knowledge systems

He built SYSTEMS that supported his mission.

## Your Infrastructure

You can be the most talented person in the room. But without systems:
- You burn out
- You drop balls
- You can't scale

What's your Fortress of Solitude?

- Where do you recharge?
- Where do you store your knowledge?
- What systems run while you sleep?

## Build Before You Need It

Superman built his Fortress when things were calm. Not during a crisis.

Build your systems now:
- Automate the repetitive
- Document the important
- Create backups for everything

When the crisis comes—and it will—you'll be ready.

Who's got you?
    `,
  },
  {
    slug: 'make-it-look-good',
    title: 'If It Doesn\'t Look Good, It Doesn\'t Exist',
    excerpt: 'Design isn\'t decoration. In a world of infinite options, presentation is the filter. Ugly doesn\'t get clicked.',
    author: 'reina',
    issue: 3,
    date: '2026-02-13',
    readTime: '3 min',
    tags: ['DESIGN', 'BRANDING'],
    content: `
Here's a hard truth: **Your product could be amazing. Nobody cares if it looks like shit.**

In a world of infinite options, design is the first filter. Before anyone reads your copy, uses your product, or hears your pitch—they SEE it.

## The 3-Second Rule

You have 3 seconds to make an impression online. In those 3 seconds, people decide:
- Is this legit or spam?
- Is this for me or not?
- Do I stay or bounce?

Design answers all three questions instantly.

## Design Is Trust

Good design signals:
- Attention to detail
- Professional operation
- Someone who gives a damn

Bad design signals:
- Rushed
- Amateur
- "If they can't get this right..."

## The Minimum Bar

You don't need to be a designer. You need to meet the minimum bar:
- Consistent colors (pick 2-3, stick to them)
- Readable typography (if they squint, you lose)
- White space (crowded = confusing)
- Quality images (no pixelated garbage)

## Invest Early

Design isn't the last step. It's not "make it pretty after we build it."

Design is the foundation. Start ugly? You'll ship ugly.

Make it look good. Or it doesn't exist.
    `,
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
