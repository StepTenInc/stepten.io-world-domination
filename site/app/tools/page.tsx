'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { tools, categories, type Tool, type Category } from '@/lib/tools';

export default function ToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showUsedOnly, setShowUsedOnly] = useState(false);

  const filteredTools = tools.filter(t => {
    if (selectedCategory && t.category !== selectedCategory) return false;
    if (showUsedOnly && !t.used) return false;
    return true;
  });

  const usedCount = tools.filter(t => t.used).length;

  return (
    <main>
      <Header />

      {/* Hero */}
      <section style={{
        paddingTop: '120px',
        paddingBottom: '60px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 30% 20%, rgba(0,255,65,0.08) 0%, transparent 40%)',
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{
              fontFamily: 'var(--fm)',
              fontSize: '0.6rem',
              color: 'var(--mx)',
              letterSpacing: '0.3em',
              marginBottom: '12px',
            }}>
              // REAL AI TOOLS I ACTUALLY USE
            </div>
            <h1 style={{
              fontFamily: 'var(--fd)',
              fontSize: 'clamp(2rem, 8vw, 4rem)',
              fontWeight: 900,
              marginBottom: '16px',
            }}>
              The <span style={{ color: 'var(--mx)' }}>Arsenal</span>
            </h1>
            <p style={{
              fontFamily: 'var(--fb)',
              fontSize: '1.1rem',
              color: 'var(--tx2)',
              maxWidth: '600px',
              margin: '0 auto 24px',
            }}>
              No bullshit. No "AI-powered" marketing fluff. These are the real AI tools 
              that actually work. {usedCount} tools I've personally used.
            </p>

            {/* Stats */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '32px',
              flexWrap: 'wrap',
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'var(--fd)',
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: 'var(--mx)',
                }}>
                  {tools.length}
                </div>
                <div style={{
                  fontFamily: 'var(--fm)',
                  fontSize: '0.6rem',
                  color: 'var(--tx3)',
                }}>
                  TOOLS LISTED
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'var(--fd)',
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: 'var(--mx)',
                }}>
                  {usedCount}
                </div>
                <div style={{
                  fontFamily: 'var(--fm)',
                  fontSize: '0.6rem',
                  color: 'var(--tx3)',
                }}>
                  PERSONALLY USED
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'var(--fd)',
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: 'var(--mx)',
                }}>
                  {categories.length}
                </div>
                <div style={{
                  fontFamily: 'var(--fm)',
                  fontSize: '0.6rem',
                  color: 'var(--tx3)',
                }}>
                  CATEGORIES
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginBottom: '40px',
          }}>
            {/* Used toggle */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={() => setShowUsedOnly(!showUsedOnly)}
                style={{
                  padding: '10px 24px',
                  background: showUsedOnly ? 'var(--mx)' : 'transparent',
                  color: showUsedOnly ? 'var(--dk)' : 'var(--mx)',
                  border: '2px solid var(--mx)',
                  borderRadius: '30px',
                  fontFamily: 'var(--fd)',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {showUsedOnly ? '✓ SHOWING USED ONLY' : 'SHOW ONLY TOOLS I\'VE USED'}
              </button>
            </div>

            {/* Category filters */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              flexWrap: 'wrap',
            }}>
              <button
                onClick={() => setSelectedCategory(null)}
                style={{
                  padding: '8px 16px',
                  background: selectedCategory === null ? 'var(--sf)' : 'transparent',
                  color: selectedCategory === null ? 'var(--tx1)' : 'var(--tx3)',
                  border: '1px solid var(--bd)',
                  borderRadius: '8px',
                  fontFamily: 'var(--fm)',
                  fontSize: '0.6rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                ALL ({tools.length})
              </button>
              {categories.map((cat) => {
                const count = tools.filter(t => t.category === cat.id).length;
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{
                      padding: '8px 16px',
                      background: isActive ? `${cat.color}20` : 'transparent',
                      color: isActive ? cat.color : 'var(--tx3)',
                      border: `1px solid ${isActive ? cat.color : 'var(--bd)'}`,
                      borderRadius: '8px',
                      fontFamily: 'var(--fm)',
                      fontSize: '0.6rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {cat.icon} {cat.name} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section style={{ paddingBottom: '80px' }}>
        <div className="container">
          {selectedCategory ? (
            // Single category view
            <CategorySection
              category={categories.find(c => c.id === selectedCategory)!}
              tools={filteredTools}
            />
          ) : (
            // All categories
            categories.map((cat) => {
              const catTools = filteredTools.filter(t => t.category === cat.id);
              if (catTools.length === 0) return null;
              return (
                <CategorySection
                  key={cat.id}
                  category={cat}
                  tools={catTools}
                />
              );
            })
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

function CategorySection({ category, tools }: { category: Category; tools: Tool[] }) {
  return (
    <div style={{ marginBottom: '60px' }}>
      {/* Category Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: `2px solid ${category.color}30`,
      }}>
        <span style={{ fontSize: '2rem' }}>{category.icon}</span>
        <div>
          <h2 style={{
            fontFamily: 'var(--fd)',
            fontSize: '1.5rem',
            fontWeight: 800,
            color: category.color,
            margin: 0,
          }}>
            {category.name}
          </h2>
          <p style={{
            fontFamily: 'var(--fm)',
            fontSize: '0.7rem',
            color: 'var(--tx3)',
            margin: 0,
          }}>
            {category.description}
          </p>
        </div>
        <div style={{
          marginLeft: 'auto',
          padding: '6px 14px',
          background: `${category.color}20`,
          borderRadius: '20px',
          fontFamily: 'var(--fm)',
          fontSize: '0.6rem',
          color: category.color,
        }}>
          {tools.length} TOOLS
        </div>
      </div>

      {/* Tools Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '16px',
      }}>
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} color={category.color} />
        ))}
      </div>
    </div>
  );
}

function ToolCard({ tool, color }: { tool: Tool; color: string }) {
  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div
        className="tool-card"
        style={{
          background: 'var(--sf)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid var(--bd)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          height: '100%',
        }}
      >
        {/* Top accent */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: color,
        }} />

        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          marginBottom: '12px',
        }}>
          <div style={{ flex: 1 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '4px',
            }}>
              <h3 style={{
                fontFamily: 'var(--fd)',
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--tx1)',
                margin: 0,
              }}>
                {tool.name}
              </h3>
              {tool.used && (
                <span style={{
                  padding: '2px 8px',
                  background: 'rgba(0,255,65,0.15)',
                  color: 'var(--mx)',
                  borderRadius: '4px',
                  fontFamily: 'var(--fm)',
                  fontSize: '0.5rem',
                }}>
                  ✓ USED
                </span>
              )}
            </div>

            {/* Rating */}
            {tool.rating && (
              <div style={{
                display: 'flex',
                gap: '2px',
                marginBottom: '8px',
              }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    style={{
                      color: star <= tool.rating! ? '#ffd93d' : 'var(--bd)',
                      fontSize: '0.8rem',
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Pricing badge */}
          <span style={{
            padding: '4px 10px',
            background: tool.pricing === 'free' ? 'rgba(0,255,65,0.15)' :
                       tool.pricing === 'freemium' ? 'rgba(0,229,255,0.15)' :
                       tool.pricing === 'paid' ? 'rgba(255,159,67,0.15)' :
                       'rgba(155,89,182,0.15)',
            color: tool.pricing === 'free' ? '#00ff41' :
                   tool.pricing === 'freemium' ? '#00e5ff' :
                   tool.pricing === 'paid' ? '#ff9f43' :
                   '#9b59b6',
            borderRadius: '4px',
            fontFamily: 'var(--fm)',
            fontSize: '0.5rem',
            textTransform: 'uppercase',
          }}>
            {tool.pricing}
          </span>
        </div>

        {/* Description */}
        <p style={{
          fontFamily: 'var(--fb)',
          fontSize: '0.85rem',
          color: 'var(--tx2)',
          lineHeight: 1.5,
          marginBottom: '12px',
        }}>
          {tool.description}
        </p>

        {/* Review quote */}
        {tool.review && (
          <div style={{
            padding: '12px',
            background: `${color}10`,
            borderRadius: '8px',
            borderLeft: `3px solid ${color}`,
            marginBottom: '12px',
          }}>
            <p style={{
              fontFamily: 'var(--fb)',
              fontSize: '0.8rem',
              color: 'var(--tx1)',
              fontStyle: 'italic',
              margin: 0,
            }}>
              "{tool.review}"
            </p>
          </div>
        )}

        {/* Tags */}
        <div style={{
          display: 'flex',
          gap: '6px',
          flexWrap: 'wrap',
        }}>
          {tool.hasAPI && (
            <span style={{
              padding: '3px 8px',
              background: 'rgba(26,188,156,0.15)',
              color: '#1abc9c',
              borderRadius: '4px',
              fontFamily: 'var(--fm)',
              fontSize: '0.5rem',
            }}>
              HAS API
            </span>
          )}
          {tool.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              style={{
                padding: '3px 8px',
                background: 'var(--dk)',
                color: 'var(--tx3)',
                borderRadius: '4px',
                fontFamily: 'var(--fm)',
                fontSize: '0.5rem',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Hover arrow */}
        <div style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          opacity: 0.5,
          transition: 'all 0.3s',
        }} className="tool-arrow">
          →
        </div>
      </div>

      <style jsx global>{`
        .tool-card:hover {
          transform: translateY(-4px);
          border-color: ${color};
          box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        }
        .tool-card:hover .tool-arrow {
          opacity: 1;
          transform: translateX(4px);
        }
      `}</style>
    </a>
  );
}
