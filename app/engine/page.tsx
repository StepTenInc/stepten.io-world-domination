'use client';

import { useEffect, useState } from 'react';
import { Bot, Zap, FileText, MessageSquare, Activity, Clock, TrendingUp, CheckCircle, Circle, Loader2 } from 'lucide-react';

// Agent data
const agents = [
  { id: 'pinky', name: 'Pinky', role: 'Research & Comms', color: '#FF2D6A', avatar: '/characters/pinky.png' },
  { id: 'reina', name: 'Reina', role: 'UX & Frontend', color: '#A855F7', avatar: '/characters/reina.png' },
  { id: 'clark', name: 'Clark', role: 'Backend & Data', color: '#F97316', avatar: '/characters/clark.png' },
];

// Mock data - will be replaced with real Supabase queries
const mockSeoStats = {
  pipelineStatus: 'running',
  pipelineProgress: 67,
  currentArticle: 'AI Agent Frameworks for Business',
  indexedPages: 847,
  pendingIndex: 12,
  articlesThisWeek: 12,
  trafficThisWeek: 2847,
  trafficChange: 34,
  queueDepth: 8,
};

const mockAgentStatus = [
  { id: 'pinky', status: 'busy', currentTask: 'Building Command Center UI', tasksToday: 7 },
  { id: 'reina', status: 'idle', currentTask: null, tasksToday: 4 },
  { id: 'clark', status: 'busy', currentTask: 'Database migration', tasksToday: 6 },
];

const mockActivityFeed = [
  { time: '11:40', agent: 'pinky', action: 'Started task: Command Center UI', color: '#FF2D6A' },
  { time: '10:33', agent: 'pinky', action: 'Assigned task to Clark', color: '#FF2D6A' },
  { time: '10:31', agent: 'pinky', action: 'Config applied, gateway restarted', color: '#FF2D6A' },
  { time: '10:28', agent: 'reina', action: 'Created task handoff', color: '#A855F7' },
  { time: '10:15', agent: 'clark', action: 'DB migration completed ✓', color: '#F97316' },
];

const mockComms = [
  { time: '11:40', sender: 'Stephen', message: "let's make sure you log your own tasks", color: '#00E5FF' },
  { time: '11:39', sender: 'Stephen', message: 'what would be a sick design?', color: '#00E5FF' },
  { time: '10:33', sender: 'Pinky', message: '@ClarkOSSingh — Task handoff from Pinky 🐀', color: '#FF2D6A' },
  { time: '10:28', sender: 'Reina', message: '@teampinky_bot — Task handoff from Reina 👑', color: '#A855F7' },
];

const mockLogs = [
  { time: '11:40:15', system: 'AGT', message: 'Pinky started task 1808a1ca', color: '#FF2D6A' },
  { time: '11:38:42', system: 'SEO', message: 'Generated: "How to Build AI Agents" (2,847w)', color: '#00FF41' },
  { time: '11:38:01', system: 'IDX', message: 'Submitted 5 URLs to Google Search Console', color: '#00FF41' },
  { time: '11:35:22', system: 'AGT', message: 'Pinky completed task d482e56b', color: '#FF2D6A' },
  { time: '11:32:15', system: 'SEO', message: 'Research cached: "AI consulting trends 2026"', color: '#00FF41' },
];

export default function EnginePage() {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('en-AU', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'busy': return '#00FF41';
      case 'idle': return '#888888';
      case 'error': return '#FF4444';
      default: return '#888888';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      color: '#E5E5E5',
      fontFamily: 'Inter, system-ui, sans-serif',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated grid background */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(0,255,65,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,255,65,0.02) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        animation: mounted ? 'gridMove 30s linear infinite' : 'none',
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <header style={{
        padding: '20px 32px',
        borderBottom: '1px solid rgba(0,255,65,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        zIndex: 10,
      }}>
        <div>
          <h1 style={{
            fontFamily: 'var(--fd, "Orbitron", monospace)',
            fontSize: '1.5rem',
            fontWeight: 800,
            color: '#00FF41',
            textShadow: '0 0 20px rgba(0,255,65,0.3)',
            margin: 0,
            letterSpacing: '0.05em',
          }}>
            STEPTEN COMMAND CENTER
          </h1>
          <p style={{
            fontFamily: 'monospace',
            fontSize: '0.7rem',
            color: '#444',
            margin: '4px 0 0 0',
            letterSpacing: '0.2em',
          }}>
            // NO HANDS. JUST RESULTS.
          </p>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: 'rgba(0,255,65,0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(0,255,65,0.2)',
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#00FF41',
              boxShadow: '0 0 10px #00FF41',
              animation: 'pulse 2s infinite',
            }} />
            <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#00FF41' }}>LIVE</span>
          </div>
          <span style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: '#888' }}>{currentTime}</span>
        </div>
      </header>

      {/* Main Grid */}
      <main style={{
        padding: '24px 32px',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gridTemplateRows: 'auto auto',
        gap: '24px',
        maxWidth: '1600px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 10,
      }}>
        
        {/* SEO Engine Panel */}
        <div style={{
          background: 'rgba(17,17,17,0.8)',
          border: '1px solid rgba(0,255,65,0.1)',
          borderRadius: '16px',
          padding: '24px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 0 30px rgba(0,255,65,0.03)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <Zap size={24} style={{ color: '#00FF41' }} />
            <h2 style={{ 
              fontFamily: 'var(--fd, monospace)', 
              fontSize: '1.1rem', 
              fontWeight: 700, 
              color: '#00FF41',
              margin: 0,
              letterSpacing: '0.1em',
            }}>
              SEO ENGINE
            </h2>
            <div style={{
              marginLeft: 'auto',
              padding: '4px 12px',
              background: 'rgba(0,255,65,0.15)',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '0.7rem',
              color: '#00FF41',
            }}>
              ON
            </div>
          </div>

          {/* Pipeline Progress */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#888' }}>CONTENT PIPELINE</span>
              <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#00FF41' }}>{mockSeoStats.pipelineProgress}%</span>
            </div>
            <div style={{
              height: '8px',
              background: 'rgba(0,255,65,0.1)',
              borderRadius: '4px',
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${mockSeoStats.pipelineProgress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #00FF41, #00E5FF)',
                boxShadow: '0 0 15px rgba(0,255,65,0.5)',
                transition: 'width 0.5s ease',
              }} />
            </div>
            <p style={{ 
              fontFamily: 'monospace', 
              fontSize: '0.75rem', 
              color: '#666', 
              margin: '8px 0 0 0',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              "{mockSeoStats.currentArticle}"
            </p>
          </div>

          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
            marginBottom: '20px',
          }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: '#666', marginBottom: '4px' }}>INDEXED</div>
              <div style={{ fontFamily: 'var(--fd, monospace)', fontSize: '1.5rem', fontWeight: 700, color: '#00FF41' }}>
                {mockSeoStats.indexedPages}
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: '#888' }}>
                +{mockSeoStats.pendingIndex} pending
              </div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: '#666', marginBottom: '4px' }}>QUEUE</div>
              <div style={{ fontFamily: 'var(--fd, monospace)', fontSize: '1.5rem', fontWeight: 700, color: '#00E5FF' }}>
                {mockSeoStats.queueDepth}
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: '#888' }}>
                briefs waiting
              </div>
            </div>
          </div>

          {/* This Week */}
          <div style={{
            background: 'rgba(0,0,0,0.3)',
            padding: '16px',
            borderRadius: '8px',
          }}>
            <div style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: '#666', marginBottom: '12px' }}>THIS WEEK</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={16} style={{ color: '#00FF41' }} />
                <span style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{mockSeoStats.articlesThisWeek} articles</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={16} style={{ color: '#00FF41' }} />
                <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#00FF41' }}>
                  +{mockSeoStats.trafficChange}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Agent Army Panel */}
        <div style={{
          background: 'rgba(17,17,17,0.8)',
          border: '1px solid rgba(0,229,255,0.1)',
          borderRadius: '16px',
          padding: '24px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 0 30px rgba(0,229,255,0.03)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <Bot size={24} style={{ color: '#00E5FF' }} />
            <h2 style={{ 
              fontFamily: 'var(--fd, monospace)', 
              fontSize: '1.1rem', 
              fontWeight: 700, 
              color: '#00E5FF',
              margin: 0,
              letterSpacing: '0.1em',
            }}>
              AGENT ARMY
            </h2>
            <div style={{
              marginLeft: 'auto',
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              color: '#888',
            }}>
              3 ACTIVE
            </div>
          </div>

          {/* Agent Cards */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            {agents.map((agent) => {
              const status = mockAgentStatus.find(s => s.id === agent.id);
              return (
                <div key={agent.id} style={{
                  flex: 1,
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: '12px',
                  padding: '16px',
                  textAlign: 'center',
                  border: `1px solid ${agent.color}20`,
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: `${agent.color}20`,
                    border: `2px solid ${agent.color}`,
                    boxShadow: `0 0 15px ${agent.color}40`,
                    margin: '0 auto 8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                  }}>
                    {agent.id === 'pinky' ? '🐀' : agent.id === 'reina' ? '👑' : '⚙️'}
                  </div>
                  <div style={{ fontFamily: 'var(--fd, monospace)', fontSize: '0.85rem', fontWeight: 700, color: agent.color }}>
                    {agent.name.toUpperCase()}
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '6px', 
                    marginTop: '8px',
                  }}>
                    {status?.status === 'busy' ? (
                      <Loader2 size={12} style={{ color: getStatusColor(status.status), animation: 'spin 1s linear infinite' }} />
                    ) : (
                      <Circle size={8} fill={getStatusColor(status?.status || 'idle')} style={{ color: getStatusColor(status?.status || 'idle') }} />
                    )}
                    <span style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: getStatusColor(status?.status || 'idle') }}>
                      {status?.status?.toUpperCase() || 'IDLE'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Activity Feed */}
          <div style={{
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '8px',
            padding: '12px',
            maxHeight: '200px',
            overflowY: 'auto',
          }}>
            <div style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: '#666', marginBottom: '12px' }}>ACTIVITY FEED</div>
            {mockActivityFeed.map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                gap: '12px',
                padding: '8px 0',
                borderBottom: i < mockActivityFeed.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}>
                <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#444', whiteSpace: 'nowrap' }}>{item.time}</span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: item.color }}>{item.agent}</span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#888', flex: 1 }}>{item.action}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Army Comms Panel */}
        <div style={{
          background: 'rgba(17,17,17,0.8)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '16px',
          padding: '24px',
          backdropFilter: 'blur(10px)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <MessageSquare size={24} style={{ color: '#888' }} />
            <h2 style={{ 
              fontFamily: 'var(--fd, monospace)', 
              fontSize: '1.1rem', 
              fontWeight: 700, 
              color: '#E5E5E5',
              margin: 0,
              letterSpacing: '0.1em',
            }}>
              ARMY COMMS
            </h2>
            <div style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#00FF41',
                animation: 'pulse 2s infinite',
              }} />
              <span style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: '#666' }}>LIVE</span>
            </div>
          </div>

          <div style={{
            background: 'rgba(0,0,0,0.4)',
            borderRadius: '8px',
            padding: '16px',
            maxHeight: '250px',
            overflowY: 'auto',
          }}>
            {mockComms.map((msg, i) => (
              <div key={i} style={{
                marginBottom: '16px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontFamily: 'var(--fd, monospace)', fontSize: '0.8rem', fontWeight: 700, color: msg.color }}>
                    {msg.sender}
                  </span>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: '#444' }}>{msg.time}</span>
                </div>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#aaa', margin: 0, lineHeight: 1.5 }}>
                  {msg.message}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* System Logs Panel */}
        <div style={{
          background: 'rgba(17,17,17,0.8)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '16px',
          padding: '24px',
          backdropFilter: 'blur(10px)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <Activity size={24} style={{ color: '#888' }} />
            <h2 style={{ 
              fontFamily: 'var(--fd, monospace)', 
              fontSize: '1.1rem', 
              fontWeight: 700, 
              color: '#E5E5E5',
              margin: 0,
              letterSpacing: '0.1em',
            }}>
              SYSTEM LOGS
            </h2>
          </div>

          <div style={{
            background: 'rgba(0,0,0,0.5)',
            borderRadius: '8px',
            padding: '16px',
            fontFamily: '"JetBrains Mono", "Fira Code", monospace',
            fontSize: '0.75rem',
            maxHeight: '250px',
            overflowY: 'auto',
          }}>
            {mockLogs.map((log, i) => (
              <div key={i} style={{
                display: 'flex',
                gap: '12px',
                padding: '6px 0',
                borderBottom: '1px solid rgba(255,255,255,0.03)',
              }}>
                <span style={{ color: '#444', whiteSpace: 'nowrap' }}>{log.time}</span>
                <span style={{ 
                  color: log.color, 
                  minWidth: '32px',
                  padding: '0 4px',
                  background: `${log.color}15`,
                  borderRadius: '2px',
                  textAlign: 'center',
                }}>
                  {log.system}
                </span>
                <span style={{ color: '#888' }}>{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        padding: '16px 32px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        justifyContent: 'center',
        gap: '32px',
        fontFamily: 'monospace',
        fontSize: '0.7rem',
        color: '#444',
      }}>
        <span>SEO ENGINE: <span style={{ color: '#00FF41' }}>●</span></span>
        <span>AGENT ARMY: <span style={{ color: '#00FF41' }}>●</span></span>
        <span>ALL SYSTEMS: <span style={{ color: '#00FF41' }}>●</span></span>
      </footer>

      {/* Global styles */}
      <style jsx global>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.3);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(0,255,65,0.3);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(0,255,65,0.5);
        }
      `}</style>
    </div>
  );
}
