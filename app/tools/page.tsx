'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, Filter, Star, ExternalLink, Zap, Users, BookOpen, Sparkles } from 'lucide-react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { tools, categories, type Tool, type Category } from '@/lib/tools';

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showUsedOnly, setShowUsedOnly] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter tools based on search and filters
  const filteredTools = useMemo(() => {
    return tools.filter(t => {
      // Category filter
      if (selectedCategory && t.category !== selectedCategory) return false;
      // Used filter
      if (showUsedOnly && !t.used) return false;
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          t.name.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [searchQuery, selectedCategory, showUsedOnly]);

  const usedCount = tools.filter(t => t.used).length;

  return (
    <PublicLayout>

      {/* ═══════ HERO WITH SEARCH ═══════ */}
      <section style={{
        padding: '80px 0 40px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Animated grid background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0,255,65,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,65,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          animation: mounted ? 'gridFloat 30s linear infinite' : 'none',
        }} />

        {/* Glow orbs */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(0,255,65,0.1) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: mounted ? 'float 8s ease-in-out infinite' : 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(0,229,255,0.1) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: mounted ? 'float 10s ease-in-out infinite reverse' : 'none',
        }} />

        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 10 }}>
          
          {/* Title */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{
              fontFamily: 'var(--fm)',
              fontSize: '0.7rem',
              color: 'var(--mx)',
              letterSpacing: '0.4em',
              marginBottom: '16px',
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(-20px)',
              transition: 'all 0.6s ease-out',
            }}>
              // THE AI ARSENAL
            </div>
            <h1 style={{
              fontFamily: 'var(--fd)',
              fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
              fontWeight: 900,
              marginBottom: '16px',
              background: 'linear-gradient(135deg, var(--tx) 0%, var(--mx) 50%, var(--ac-step) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s ease-out 0.1s',
            }}>
              Tools We Actually Use
            </h1>
            <p style={{
              fontFamily: 'var(--fb)',
              fontSize: '1.15rem',
              color: 'var(--tx2)',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: 1.7,
              opacity: mounted ? 1 : 0,
              transition: 'opacity 0.6s ease-out 0.2s',
            }}>
              No affiliate bullshit rankings. Real tools. Real reviews.
              <br /><span style={{ color: 'var(--mx)' }}>{usedCount} tools we've personally battle-tested.</span>
            </p>
          </div>

          {/* ═══════ SEARCH BAR ═══════ */}
          <div style={{
            maxWidth: '700px',
            margin: '0 auto 32px',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s ease-out 0.3s',
          }}>
            <div style={{
              position: 'relative',
              background: 'var(--sf)',
              borderRadius: '16px',
              border: '2px solid var(--bd)',
              overflow: 'hidden',
              transition: 'all 0.3s',
              boxShadow: searchQuery ? '0 0 30px rgba(0,255,65,0.2)' : 'none',
            }}>
              {/* Search icon */}
              <Search 
                size={22} 
                style={{
                  position: 'absolute',
                  left: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: searchQuery ? 'var(--mx)' : 'var(--tx3)',
                  transition: 'color 0.3s',
                }}
              />
              
              {/* Input */}
              <input
                type="text"
                placeholder="Search tools, categories, features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '20px 50px 20px 56px',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontFamily: 'var(--fb)',
                  fontSize: '1.1rem',
                  color: 'var(--tx)',
                }}
              />

              {/* Clear button */}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'var(--dk)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <X size={16} style={{ color: 'var(--tx3)' }} />
                </button>
              )}

              {/* Animated border */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                height: '2px',
                width: searchQuery ? '100%' : '0%',
                background: 'linear-gradient(90deg, var(--mx), var(--ac-step))',
                transition: 'width 0.3s',
              }} />
            </div>

            {/* Search stats */}
            {searchQuery && (
              <div style={{
                textAlign: 'center',
                marginTop: '12px',
                fontFamily: 'var(--fm)',
                fontSize: '0.75rem',
                color: 'var(--tx3)',
              }}>
                Found <span style={{ color: 'var(--mx)' }}>{filteredTools.length}</span> tools matching "{searchQuery}"
              </div>
            )}
          </div>

          {/* ═══════ FILTER CHIPS ═══════ */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            alignItems: 'center',
            opacity: mounted ? 1 : 0,
            transition: 'opacity 0.6s ease-out 0.4s',
          }}>
            
            {/* Used toggle */}
            <button
              onClick={() => setShowUsedOnly(!showUsedOnly)}
              style={{
                padding: '12px 28px',
                background: showUsedOnly ? 'linear-gradient(135deg, var(--mx), #00cc33)' : 'transparent',
                color: showUsedOnly ? 'var(--dk)' : 'var(--mx)',
                border: `2px solid ${showUsedOnly ? 'transparent' : 'var(--mx)'}`,
                borderRadius: '30px',
                fontFamily: 'var(--fd)',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Sparkles size={16} />
              {showUsedOnly ? '✓ SHOWING BATTLE-TESTED ONLY' : 'SHOW ONLY BATTLE-TESTED'}
            </button>

            {/* Category chips */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '10px',
              flexWrap: 'wrap',
              maxWidth: '1000px',
            }}>
              <button
                onClick={() => setSelectedCategory(null)}
                style={{
                  padding: '10px 20px',
                  background: selectedCategory === null ? 'var(--sf)' : 'transparent',
                  color: selectedCategory === null ? 'var(--tx)' : 'var(--tx3)',
                  border: `1px solid ${selectedCategory === null ? 'var(--mx)' : 'var(--bd)'}`,
                  borderRadius: '10px',
                  fontFamily: 'var(--fm)',
                  fontSize: '0.7rem',
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
                    onClick={() => setSelectedCategory(isActive ? null : cat.id)}
                    style={{
                      padding: '10px 20px',
                      background: isActive ? `${cat.color}20` : 'transparent',
                      color: isActive ? cat.color : 'var(--tx3)',
                      border: `1px solid ${isActive ? cat.color : 'var(--bd)'}`,
                      borderRadius: '10px',
                      fontFamily: 'var(--fm)',
                      fontSize: '0.7rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>{cat.icon}</span>
                    {cat.name}
                    <span style={{ opacity: 0.6 }}>({count})</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ TOOLS GRID ═══════ */}
      <section style={{ padding: '40px 0 80px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
          
          {selectedCategory ? (
            // Single category view
            <CategorySection
              category={categories.find(c => c.id === selectedCategory)!}
              tools={filteredTools}
              mounted={mounted}
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
                  mounted={mounted}
                />
              );
            })
          )}

          {/* No results */}
          {filteredTools.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '80px 20px',
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🔍</div>
              <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.5rem', marginBottom: '8px' }}>
                No tools found
              </h3>
              <p style={{ fontFamily: 'var(--fb)', color: 'var(--tx3)' }}>
                Try a different search or clear filters
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory(null); setShowUsedOnly(false); }}
                style={{
                  marginTop: '16px',
                  padding: '12px 24px',
                  background: 'var(--mx)',
                  color: 'var(--dk)',
                  border: 'none',
                  borderRadius: '8px',
                  fontFamily: 'var(--fd)',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ═══════ CTA SECTION ═══════ */}
      <section style={{ padding: '80px 0', background: 'var(--sf)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{
              fontFamily: 'var(--fm)',
              fontSize: '0.65rem',
              color: 'var(--mx)',
              letterSpacing: '0.35em',
              marginBottom: '12px',
            }}>
              // SEE THEM IN ACTION
            </div>
            <h2 style={{
              fontFamily: 'var(--fd)',
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontWeight: 700,
            }}>
              Tools Come Alive in <span style={{ color: 'var(--mx)' }}>Tales</span>
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}>
            <Link href="/tales" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--dk)',
                borderRadius: '16px',
                padding: '32px',
                border: '1px solid var(--bd)',
                transition: 'all 0.3s',
                cursor: 'pointer',
              }}>
                <div style={{ color: 'var(--mx)', marginBottom: '16px' }}><BookOpen size={36} /></div>
                <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px', color: 'var(--tx)' }}>
                  Read the Tales
                </h3>
                <p style={{ fontFamily: 'var(--fb)', fontSize: '0.9rem', color: 'var(--tx2)', lineHeight: 1.6 }}>
                  Real stories of how we use these tools to build shit.
                </p>
              </div>
            </Link>

            <Link href="/team" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--dk)',
                borderRadius: '16px',
                padding: '32px',
                border: '1px solid var(--bd)',
                transition: 'all 0.3s',
                cursor: 'pointer',
              }}>
                <div style={{ color: 'var(--mx)', marginBottom: '16px' }}><Users size={36} /></div>
                <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px', color: 'var(--tx)' }}>
                  Meet the Team
                </h3>
                <p style={{ fontFamily: 'var(--fb)', fontSize: '0.9rem', color: 'var(--tx2)', lineHeight: 1.6 }}>
                  The human & AI agents who wield these tools.
                </p>
              </div>
            </Link>

            <Link href="/about" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--dk)',
                borderRadius: '16px',
                padding: '32px',
                border: '1px solid var(--bd)',
                transition: 'all 0.3s',
                cursor: 'pointer',
              }}>
                <div style={{ color: 'var(--mx)', marginBottom: '16px' }}><Zap size={36} /></div>
                <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px', color: 'var(--tx)' }}>
                  Why AI Agents
                </h3>
                <p style={{ fontFamily: 'var(--fb)', fontSize: '0.9rem', color: 'var(--tx2)', lineHeight: 1.6 }}>
                  The philosophy behind the army.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Global styles */}
      <style jsx global>{`
        @keyframes gridFloat {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .tool-card {
          transition: all 0.4s cubic-bezier(.34,1.56,.64,1);
        }
        .tool-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        }
        .tool-card:hover .tool-glow {
          opacity: 1;
        }
      `}</style>

    </PublicLayout>
  );
}

// ═══════════════════════════════════════
// CATEGORY SECTION
// ═══════════════════════════════════════
function CategorySection({ category, tools, mounted }: { category: Category; tools: Tool[]; mounted: boolean }) {
  return (
    <div style={{ marginBottom: '64px' }}>
      {/* Category Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '28px',
        paddingBottom: '16px',
        borderBottom: `2px solid ${category.color}40`,
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '14px',
          background: `${category.color}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.8rem',
        }}>
          {category.icon}
        </div>
        <div>
          <h2 style={{
            fontFamily: 'var(--fd)',
            fontSize: '1.6rem',
            fontWeight: 800,
            color: category.color,
            margin: 0,
          }}>
            {category.name}
          </h2>
          <p style={{
            fontFamily: 'var(--fm)',
            fontSize: '0.75rem',
            color: 'var(--tx3)',
            margin: 0,
          }}>
            {category.description}
          </p>
        </div>
        <div style={{
          marginLeft: 'auto',
          padding: '8px 18px',
          background: `${category.color}20`,
          borderRadius: '24px',
          fontFamily: 'var(--fm)',
          fontSize: '0.7rem',
          fontWeight: 600,
          color: category.color,
        }}>
          {tools.length} TOOLS
        </div>
      </div>

      {/* Tools Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '20px',
      }}>
        {tools.map((tool, index) => (
          <ToolCard 
            key={tool.id} 
            tool={tool} 
            color={category.color}
            index={index}
            mounted={mounted}
          />
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// TOOL CARD
// ═══════════════════════════════════════
function ToolCard({ tool, color, index, mounted }: { tool: Tool; color: string; index: number; mounted: boolean }) {
  return (
    <Link
      href={`/tools/${tool.id}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div
        className="tool-card"
        style={{
          background: 'linear-gradient(135deg, var(--sf) 0%, rgba(15,15,20,1) 100%)',
          borderRadius: '20px',
          padding: '24px',
          border: `1px solid ${color}30`,
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
          height: '100%',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(30px)',
          transition: `all 0.5s ease-out ${index * 0.05}s`,
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
          boxShadow: `0 0 20px ${color}`,
        }} />

        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '16px',
          marginBottom: '16px',
        }}>
          {/* Logo */}
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
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
                width: '36px',
                height: '36px',
                objectFit: 'contain',
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${tool.name[0]}&background=${color.replace('#', '')}&color=fff&size=64`;
              }}
            />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
              <h3 style={{
                fontFamily: 'var(--fd)',
                fontSize: '1.3rem',
                fontWeight: 700,
                color: 'var(--tx)',
                margin: 0,
              }}>
                {tool.name}
              </h3>
              {tool.used && (
                <span style={{
                  padding: '4px 12px',
                  background: 'rgba(0,255,65,0.2)',
                  color: 'var(--mx)',
                  borderRadius: '20px',
                  fontFamily: 'var(--fm)',
                  fontSize: '0.55rem',
                  fontWeight: 600,
                  boxShadow: '0 0 15px rgba(0,255,65,0.3)',
                }}>
                  ✓ BATTLE-TESTED
                </span>
              )}
            </div>

            {/* Rating */}
            {tool.rating && (
              <div style={{ display: 'flex', gap: '3px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    fill={star <= tool.rating! ? '#ffd93d' : 'transparent'}
                    style={{
                      color: star <= tool.rating! ? '#ffd93d' : 'var(--bd)',
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Pricing badge */}
          <span style={{
            padding: '6px 14px',
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
            fontSize: '0.6rem',
            fontWeight: 600,
            textTransform: 'uppercase',
          }}>
            {tool.pricing}
          </span>
        </div>

        {/* Description */}
        <p style={{
          fontFamily: 'var(--fb)',
          fontSize: '0.95rem',
          color: 'var(--tx2)',
          lineHeight: 1.65,
          marginBottom: '16px',
        }}>
          {tool.description}
        </p>

        {/* Review quote */}
        {tool.review && (
          <div style={{
            padding: '14px 18px',
            background: `linear-gradient(135deg, ${color}12 0%, ${color}05 100%)`,
            borderRadius: '12px',
            borderLeft: `4px solid ${color}`,
            marginBottom: '16px',
          }}>
            <p style={{
              fontFamily: 'var(--fb)',
              fontSize: '0.9rem',
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
              padding: '5px 12px',
              background: 'rgba(26,188,156,0.2)',
              color: '#1abc9c',
              borderRadius: '6px',
              fontFamily: 'var(--fm)',
              fontSize: '0.6rem',
              fontWeight: 600,
            }}>
              🔌 API
            </span>
          )}
          {tool.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              style={{
                padding: '5px 12px',
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--tx3)',
                borderRadius: '6px',
                fontFamily: 'var(--fm)',
                fontSize: '0.6rem',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* View review link */}
        <div style={{
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid var(--bd)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{
            fontFamily: 'var(--fm)',
            fontSize: '0.7rem',
            color: color,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            View Full Review →
          </span>
          <ExternalLink size={14} style={{ color: 'var(--tx4)' }} />
        </div>
      </div>
    </Link>
  );
}
