'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PublicLayout } from '@/components/layout/PublicLayout';
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
    <PublicLayout>

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

      {/* CTA Section */}
      <section style={{ padding: '80px 0', background: 'var(--sf)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{
              fontFamily: 'var(--fm)',
              fontSize: '0.6rem',
              color: 'var(--mx)',
              letterSpacing: '0.3em',
              marginBottom: '12px',
            }}>
              // WANT MORE?
            </div>
            <h2 style={{
              fontFamily: 'var(--fd)',
              fontSize: 'clamp(1.5rem, 5vw, 2rem)',
              fontWeight: 800,
            }}>
              Explore the <span style={{ color: 'var(--mx)' }}>Universe</span>
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            maxWidth: '900px',
            margin: '0 auto',
          }}>
            <Link href="/tales" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--dk)',
                borderRadius: '16px',
                padding: '28px',
                border: '1px solid var(--bd)',
                transition: 'all 0.3s',
                cursor: 'pointer',
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📖</div>
                <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', color: 'var(--tx)' }}>
                  Read the Tales
                </h3>
                <p style={{ fontFamily: 'var(--fb)', fontSize: '0.85rem', color: 'var(--tx2)', lineHeight: 1.5 }}>
                  How I actually use these tools in the real world.
                </p>
              </div>
            </Link>

            <Link href="/team" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--dk)',
                borderRadius: '16px',
                padding: '28px',
                border: '1px solid var(--bd)',
                transition: 'all 0.3s',
                cursor: 'pointer',
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>👥</div>
                <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', color: 'var(--tx)' }}>
                  Meet the Team
                </h3>
                <p style={{ fontFamily: 'var(--fb)', fontSize: '0.85rem', color: 'var(--tx2)', lineHeight: 1.5 }}>
                  The AI agents who wield these tools daily.
                </p>
              </div>
            </Link>

            <Link href="/about" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--dk)',
                borderRadius: '16px',
                padding: '28px',
                border: '1px solid var(--bd)',
                transition: 'all 0.3s',
                cursor: 'pointer',
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⚡</div>
                <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', color: 'var(--tx)' }}>
                  About StepTen
                </h3>
                <p style={{ fontFamily: 'var(--fb)', fontSize: '0.85rem', color: 'var(--tx2)', lineHeight: 1.5 }}>
                  The story behind the simulation.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

    </PublicLayout>
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
      className="tool-card-link"
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div
        className="tool-card"
        style={{
          background: 'linear-gradient(135deg, var(--sf) 0%, rgba(20,20,30,1) 100%)',
          borderRadius: '20px',
          padding: '24px',
          border: '1px solid var(--bd)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.4s cubic-bezier(.34,1.56,.64,1)',
          cursor: 'pointer',
          height: '100%',
        }}
      >
        {/* Glow effect */}
        <div className="tool-glow" style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: `radial-gradient(circle at center, ${color}15 0%, transparent 50%)`,
          opacity: 0,
          transition: 'opacity 0.4s',
          pointerEvents: 'none',
        }} />

        {/* Top accent bar */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${color}, ${color}60)`,
        }} />

        {/* Header with Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '16px',
        }}>
          {/* Logo */}
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'var(--dk)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            border: `1px solid ${color}30`,
            flexShrink: 0,
          }}>
            <img
              src={tool.logo}
              alt={tool.name}
              style={{
                width: '32px',
                height: '32px',
                objectFit: 'contain',
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${tool.name[0]}&background=${color.replace('#', '')}&color=fff&size=64`;
              }}
            />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexWrap: 'wrap',
            }}>
              <h3 style={{
                fontFamily: 'var(--fd)',
                fontSize: '1.2rem',
                fontWeight: 700,
                color: 'var(--tx1)',
                margin: 0,
              }}>
                {tool.name}
              </h3>
              {tool.used && (
                <span style={{
                  padding: '3px 10px',
                  background: 'rgba(0,255,65,0.2)',
                  color: 'var(--mx)',
                  borderRadius: '20px',
                  fontFamily: 'var(--fm)',
                  fontSize: '0.5rem',
                  fontWeight: 600,
                  boxShadow: '0 0 10px rgba(0,255,65,0.2)',
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
                marginTop: '4px',
              }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    style={{
                      color: star <= tool.rating! ? '#ffd93d' : 'var(--bd)',
                      fontSize: '0.9rem',
                      textShadow: star <= tool.rating! ? '0 0 10px #ffd93d' : 'none',
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
            padding: '6px 12px',
            background: tool.pricing === 'free' ? 'rgba(0,255,65,0.2)' :
                       tool.pricing === 'freemium' ? 'rgba(0,229,255,0.2)' :
                       tool.pricing === 'paid' ? 'rgba(255,159,67,0.2)' :
                       'rgba(155,89,182,0.2)',
            color: tool.pricing === 'free' ? '#00ff41' :
                   tool.pricing === 'freemium' ? '#00e5ff' :
                   tool.pricing === 'paid' ? '#ff9f43' :
                   '#9b59b6',
            borderRadius: '8px',
            fontFamily: 'var(--fm)',
            fontSize: '0.55rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            {tool.pricing}
          </span>
        </div>

        {/* Description */}
        <p style={{
          fontFamily: 'var(--fb)',
          fontSize: '0.9rem',
          color: 'var(--tx2)',
          lineHeight: 1.6,
          marginBottom: '16px',
        }}>
          {tool.description}
        </p>

        {/* Review quote */}
        {tool.review && (
          <div style={{
            padding: '14px 16px',
            background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
            borderRadius: '12px',
            borderLeft: `4px solid ${color}`,
            marginBottom: '16px',
          }}>
            <p style={{
              fontFamily: 'var(--fb)',
              fontSize: '0.85rem',
              color: 'var(--tx1)',
              fontStyle: 'italic',
              margin: 0,
              lineHeight: 1.5,
            }}>
              "{tool.review}"
            </p>
          </div>
        )}

        {/* Tags */}
        <div style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
        }}>
          {tool.hasAPI && (
            <span style={{
              padding: '4px 10px',
              background: 'rgba(26,188,156,0.2)',
              color: '#1abc9c',
              borderRadius: '6px',
              fontFamily: 'var(--fm)',
              fontSize: '0.55rem',
              fontWeight: 600,
            }}>
              🔌 API
            </span>
          )}
          {tool.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              style={{
                padding: '4px 10px',
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--tx3)',
                borderRadius: '6px',
                fontFamily: 'var(--fm)',
                fontSize: '0.55rem',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* External link icon */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          color: color,
          opacity: 0.4,
          fontSize: '1.2rem',
          transition: 'all 0.3s',
        }} className="tool-arrow">
          ↗
        </div>
      </div>

      <style jsx global>{`
        .tool-card:hover {
          transform: translateY(-8px) scale(1.02);
          border-color: ${color};
          box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 30px ${color}20;
        }
        .tool-card:hover .tool-glow {
          opacity: 1;
        }
        .tool-card:hover .tool-arrow {
          opacity: 1;
          transform: translate(4px, -4px);
        }
      `}</style>
    </a>
  );
}
