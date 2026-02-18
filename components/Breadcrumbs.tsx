import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  authorColor?: string;
  className?: string;
}

export function Breadcrumbs({ items, authorColor = '#00d4ff', className = '' }: BreadcrumbsProps) {
  // Generate JSON-LD schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href && { item: `https://stepten.io${item.href}` }),
    })),
  };

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Visual Breadcrumbs */}
      <nav 
        aria-label="Breadcrumb" 
        className={`${className}`}
      >
        <ol className="flex items-center flex-wrap gap-1 text-sm">
          {/* Home */}
          <li className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors"
            >
              <Home size={14} />
              <span className="sr-only">Home</span>
            </Link>
          </li>

          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            
            return (
              <li key={index} className="flex items-center">
                <ChevronRight 
                  size={14} 
                  className="mx-2 text-white/20" 
                />
                {isLast || !item.href ? (
                  <span 
                    className="font-medium truncate max-w-[200px] md:max-w-[300px]"
                    style={{ color: isLast ? authorColor : 'rgba(255,255,255,0.7)' }}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link 
                    href={item.href}
                    className="text-white/50 hover:text-white/80 transition-colors truncate max-w-[150px]"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

// Helper to generate breadcrumbs for tales
export function getTaleBreadcrumbs(tale: { title: string; slug: string; category?: string; silo?: string }): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    { label: 'Tales', href: '/tales' },
  ];

  // Add silo/category if available
  if (tale.silo) {
    const siloLabels: Record<string, string> = {
      'ai-agents': 'AI Agents',
      'ai-coding': 'AI Coding',
      'ai-memory': 'AI Memory',
      'startup': 'Startup',
    };
    items.push({ 
      label: siloLabels[tale.silo] || tale.silo, 
      href: `/tales?silo=${tale.silo}` 
    });
  }

  // Current page (no href = current)
  items.push({ label: tale.title });

  return items;
}

// Helper for team pages
export function getTeamBreadcrumbs(member: { name: string; slug: string }): BreadcrumbItem[] {
  return [
    { label: 'Team', href: '/team' },
    { label: member.name },
  ];
}

// Helper for tools pages
export function getToolBreadcrumbs(tool: { name: string; slug: string }): BreadcrumbItem[] {
  return [
    { label: 'Tools', href: '/tools' },
    { label: tool.name },
  ];
}
