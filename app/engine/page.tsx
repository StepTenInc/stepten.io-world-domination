'use client';

import { useEffect, useState, useRef } from 'react';
import { Bot, Zap, FileText, MessageSquare, Activity, CheckCircle, Circle, Loader2, ArrowRight, Clock, Target, Search, PenTool, Image as ImageIcon, BarChart3, Send, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { characters, colors } from '@/lib/design-tokens';

// Team data - using design tokens (Stephen + AI Agents)
const agents = [
  { 
    id: 'stepten', 
    name: 'Stephen', 
    role: 'The Brain', 
    color: characters.stepten.color, 
    image: characters.stepten.image,
    type: 'human',
  },
  { 
    id: 'pinky', 
    name: characters.pinky.name, 
    role: characters.pinky.role, 
    color: characters.pinky.color, 
    image: characters.pinky.image,
    type: 'ai',
  },
  { 
    id: 'reina', 
    name: characters.reina.name, 
    role: characters.reina.role, 
    color: characters.reina.color, 
    image: characters.reina.image,
    type: 'ai',
  },
  { 
    id: 'clark', 
    name: characters.clark.name, 
    role: characters.clark.role, 
    color: characters.clark.color, 
    image: characters.clark.image,
    type: 'ai',
  },
];

// SEO Pipeline stages
const pipelineStages = [
  { id: 'research', name: 'Research', icon: Search, status: 'complete' },
  { id: 'outline', name: 'Outline', icon: Target, status: 'complete' },
  { id: 'draft', name: 'Draft', icon: PenTool, status: 'running' },
  { id: 'images', name: 'Images', icon: ImageIcon, status: 'pending' },
  { id: 'seo', name: 'SEO', icon: BarChart3, status: 'pending' },
  { id: 'publish', name: 'Publish', icon: Send, status: 'pending' },
];

// Task flow - showing the real handoff
const taskFlow = [
  {
    id: '1808a1ca-59b4-4413-b3f4-0bf1e61997b9',
    title: 'Build StepTen Command Center UI',
    from: 'stepten',
    to: 'pinky',
    status: 'in_progress',
    startedAt: '11:40',
    completedAt: null,
  },
  { 
    id: 'd482e56b-a43c-4bfb-8a77-d06b7cd1f466',
    title: 'Set Up Telegram Group Orchestration',
    from: 'reina',
    to: 'pinky',
    status: 'completed',
    startedAt: '10:28',
    completedAt: '10:33',
  },
  {
    id: '0dfdd12c-a07d-4f91-956f-e80a5716ddec',
    title: 'Apply Telegram Group Config for Clark',
    from: 'pinky',
    to: 'clark',
    status: 'pending',
    startedAt: '10:33',
    completedAt: null,
  },
];

// Mock SEO stats
const seoStats = {
  currentArticle: 'AI Agent Frameworks for Business Automation',
  pipelineProgress: 42,
  indexedPages: 847,
  pendingIndex: 12,
  articlesThisWeek: 12,
  queueDepth: 8,
};

// Matrix rain characters
const matrixChars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export default function EnginePage() {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Matrix rain effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00FF4115';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('en-AU', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: false 
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
      case 'completed': return '#00FF41';
      case 'running':
      case 'in_progress': return '#00E5FF';
      case 'pending': return '#444';
      case 'error': return '#FF4444';
      default: return '#444';
    }
  };

  const getAgentColor = (id: string) => {
    return agents.find(a => a.id === id)?.color || '#888';
  };

  const getAgentImage = (id: string) => {
    return agents.find(a => a.id === id)?.image || '/images/characters/pinky.jpg';
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
      {/* Matrix Rain Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Scan line effect */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 2px)',
        pointerEvents: 'none',
        zIndex: 2,
      }} />

      {/* Vignette */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)',
        pointerEvents: 'none',
        zIndex: 2,
      }} />

      {/* Header */}
      <header style={{
        padding: '16px 32px',
        borderBottom: '1px solid rgba(0,255,65,0.2)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        zIndex: 10,
        background: 'rgba(10,10,10,0.9)',
        backdropFilter: 'blur(10px)',
      }}>
        <div>
          <h1 style={{
            fontFamily: '"Orbitron", monospace',
            fontSize: '1.3rem',
            fontWeight: 800,
            color: '#00FF41',
            textShadow: '0 0 30px rgba(0,255,65,0.5), 0 0 60px rgba(0,255,65,0.3)',
            margin: 0,
            letterSpacing: '0.15em',
          }}>
            STEPTEN COMMAND CENTER
          </h1>
          <p style={{
            fontFamily: 'monospace',
            fontSize: '0.65rem',
            color: '#00FF41',
            margin: '4px 0 0 0',
            letterSpacing: '0.3em',
            opacity: 0.6,
          }}>
            {'>'} NO_HANDS.exe // AUTONOMOUS_MODE
          </p>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: 'rgba(0,255,65,0.1)',
            borderRadius: '4px',
            border: '1px solid rgba(0,255,65,0.3)',
          }}>
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#00FF41',
              boxShadow: '0 0 20px #00FF41, 0 0 40px #00FF41',
              animation: 'pulse 1s infinite',
            }} />
            <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#00FF41', fontWeight: 700 }}>LIVE</span>
          </div>
          <span style={{ 
            fontFamily: '"Orbitron", monospace', 
            fontSize: '1.1rem', 
            color: '#00FF41',
            textShadow: '0 0 10px rgba(0,255,65,0.5)',
            letterSpacing: '0.1em',
          }}>
            {currentTime}
          </span>
        </div>
      </header>

      {/* Main Grid */}
      <main style={{
        padding: '24px 32px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: 'auto auto',
        gap: '20px',
        maxWidth: '1800px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 10,
      }}>
        
        {/* ═══════ SEO ENGINE PANEL ═══════ */}
        <div style={{
          background: 'rgba(10,10,10,0.85)',
          border: '1px solid rgba(0,255,65,0.2)',
          borderRadius: '8px',
          padding: '20px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 0 40px rgba(0,255,65,0.05), inset 0 0 60px rgba(0,255,65,0.02)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <Zap size={20} style={{ color: '#00FF41', filter: 'drop-shadow(0 0 10px #00FF41)' }} />
            <h2 style={{ 
              fontFamily: '"Orbitron", monospace', 
              fontSize: '0.9rem', 
              fontWeight: 700, 
              color: '#00FF41',
              margin: 0,
              letterSpacing: '0.15em',
              textShadow: '0 0 10px rgba(0,255,65,0.5)',
            }}>
              SEO ENGINE
            </h2>
            <div style={{
              marginLeft: 'auto',
              padding: '4px 12px',
              background: 'rgba(0,255,65,0.2)',
              borderRadius: '2px',
              fontFamily: 'monospace',
              fontSize: '0.65rem',
              color: '#00FF41',
              border: '1px solid rgba(0,255,65,0.4)',
              textShadow: '0 0 5px #00FF41',
            }}>
              ● RUNNING
            </div>
          </div>

          {/* Current Article */}
          <div style={{
            background: 'rgba(0,255,65,0.05)',
            border: '1px solid rgba(0,255,65,0.1)',
            borderRadius: '4px',
            padding: '12px',
            marginBottom: '16px',
          }}>
            <div style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: '#00FF41', marginBottom: '6px', letterSpacing: '0.1em' }}>
              CURRENTLY GENERATING
            </div>
            <div style={{ 
              fontFamily: 'monospace', 
              fontSize: '0.85rem', 
              color: '#E5E5E5',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <Loader2 size={14} style={{ color: '#00FF41', animation: 'spin 1s linear infinite' }} />
              "{seoStats.currentArticle}"
            </div>
          </div>

          {/* Pipeline Stages */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: '#666', marginBottom: '12px', letterSpacing: '0.1em' }}>
              PIPELINE STAGES
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              {pipelineStages.map((stage, i) => {
                const Icon = stage.icon;
                return (
                  <div key={stage.id} style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '4px',
                      background: stage.status === 'complete' ? 'rgba(0,255,65,0.2)' : 
                                  stage.status === 'running' ? 'rgba(0,229,255,0.2)' : 'rgba(68,68,68,0.2)',
                      border: `1px solid ${getStatusColor(stage.status)}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: stage.status !== 'pending' ? `0 0 15px ${getStatusColor(stage.status)}40` : 'none',
                    }}>
                      {stage.status === 'running' ? (
                        <Loader2 size={16} style={{ color: getStatusColor(stage.status), animation: 'spin 1s linear infinite' }} />
                      ) : stage.status === 'complete' ? (
                        <CheckCircle size={16} style={{ color: getStatusColor(stage.status) }} />
                      ) : (
                        <Icon size={16} style={{ color: getStatusColor(stage.status) }} />
                      )}
                    </div>
                    <span style={{ 
                      fontFamily: 'monospace', 
                      fontSize: '0.55rem', 
                      color: getStatusColor(stage.status),
                      letterSpacing: '0.05em',
                    }}>
                      {stage.name.toUpperCase()}
                    </span>
                    {i < pipelineStages.length - 1 && (
                      <div style={{
                        position: 'absolute',
                        right: '-2px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                      }}>
                        <ArrowRight size={10} style={{ color: '#333' }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
          }}>
            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '4px', border: '1px solid rgba(0,255,65,0.1)' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '0.55rem', color: '#666', marginBottom: '4px' }}>INDEXED</div>
              <div style={{ fontFamily: '"Orbitron", monospace', fontSize: '1.4rem', fontWeight: 700, color: '#00FF41', textShadow: '0 0 20px rgba(0,255,65,0.5)' }}>
                {seoStats.indexedPages}
              </div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '4px', border: '1px solid rgba(0,229,255,0.1)' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '0.55rem', color: '#666', marginBottom: '4px' }}>QUEUE</div>
              <div style={{ fontFamily: '"Orbitron", monospace', fontSize: '1.4rem', fontWeight: 700, color: '#00E5FF', textShadow: '0 0 20px rgba(0,229,255,0.5)' }}>
                {seoStats.queueDepth}
              </div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '4px', border: '1px solid rgba(255,45,106,0.1)' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '0.55rem', color: '#666', marginBottom: '4px' }}>THIS WEEK</div>
              <div style={{ fontFamily: '"Orbitron", monospace', fontSize: '1.4rem', fontWeight: 700, color: '#FF2D6A', textShadow: '0 0 20px rgba(255,45,106,0.5)' }}>
                {seoStats.articlesThisWeek}
              </div>
            </div>
          </div>
        </div>

        {/* ═══════ TASK MANAGER PANEL ═══════ */}
        <div style={{
          background: 'rgba(10,10,10,0.85)',
          border: '1px solid rgba(0,229,255,0.2)',
          borderRadius: '8px',
          padding: '20px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 0 40px rgba(0,229,255,0.05), inset 0 0 60px rgba(0,229,255,0.02)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <Sparkles size={20} style={{ color: '#00E5FF', filter: 'drop-shadow(0 0 10px #00E5FF)' }} />
            <h2 style={{ 
              fontFamily: '"Orbitron", monospace', 
              fontSize: '0.9rem', 
              fontWeight: 700, 
              color: '#00E5FF',
              margin: 0,
              letterSpacing: '0.15em',
              textShadow: '0 0 10px rgba(0,229,255,0.5)',
            }}>
              TASK MANAGER
            </h2>
            <div style={{
              marginLeft: 'auto',
              fontFamily: 'monospace',
              fontSize: '0.65rem',
              color: '#888',
            }}>
              {taskFlow.filter(t => t.status === 'in_progress').length} ACTIVE
            </div>
          </div>

          {/* Task Flow */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {taskFlow.map((task, i) => (
              <div key={task.id} style={{
                background: task.status === 'in_progress' ? 'rgba(0,229,255,0.05)' : 
                            task.status === 'completed' ? 'rgba(0,255,65,0.03)' : 'rgba(0,0,0,0.3)',
                border: `1px solid ${getStatusColor(task.status)}30`,
                borderRadius: '6px',
                padding: '14px',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* Animated border for in_progress */}
                {task.status === 'in_progress' && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, #00E5FF, transparent)',
                    animation: 'shimmer 2s infinite',
                  }} />
                )}

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  {/* From Agent */}
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: `2px solid ${getAgentColor(task.from)}`,
                    boxShadow: `0 0 10px ${getAgentColor(task.from)}40`,
                    overflow: 'hidden',
                    position: 'relative',
                  }}>
                    <Image 
                      src={getAgentImage(task.from)} 
                      alt={task.from} 
                      fill 
                      style={{ objectFit: 'cover' }} 
                    />
                  </div>
                  
                  <ArrowRight size={14} style={{ color: '#444' }} />
                  
                  {/* To Agent */}
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: `2px solid ${getAgentColor(task.to)}`,
                    boxShadow: task.status === 'in_progress' ? `0 0 15px ${getAgentColor(task.to)}60` : `0 0 10px ${getAgentColor(task.to)}40`,
                    overflow: 'hidden',
                    position: 'relative',
                  }}>
                    <Image 
                      src={getAgentImage(task.to)} 
                      alt={task.to} 
                      fill 
                      style={{ objectFit: 'cover' }} 
                    />
                  </div>

                  {/* Status */}
                  <div style={{
                    marginLeft: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    background: `${getStatusColor(task.status)}15`,
                    borderRadius: '3px',
                    border: `1px solid ${getStatusColor(task.status)}40`,
                  }}>
                    {task.status === 'in_progress' ? (
                      <Loader2 size={12} style={{ color: getStatusColor(task.status), animation: 'spin 1s linear infinite' }} />
                    ) : task.status === 'completed' ? (
                      <CheckCircle size={12} style={{ color: getStatusColor(task.status) }} />
                    ) : (
                      <Clock size={12} style={{ color: getStatusColor(task.status) }} />
                    )}
                    <span style={{ 
                      fontFamily: 'monospace', 
                      fontSize: '0.6rem', 
                      color: getStatusColor(task.status),
                      fontWeight: 600,
                    }}>
                      {task.status.toUpperCase().replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Task Title */}
                <div style={{ 
                  fontFamily: 'monospace', 
                  fontSize: '0.8rem', 
                  color: '#E5E5E5',
                  marginBottom: '8px',
                }}>
                  {task.title}
                </div>

                {/* Task ID & Times */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  fontFamily: 'monospace', 
                  fontSize: '0.55rem', 
                  color: '#555',
                }}>
                  <span>ID: {task.id.slice(0, 8)}...</span>
                  <span>
                    {task.startedAt} {task.completedAt ? `→ ${task.completedAt}` : '→ ...'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════ AGENT STATUS PANEL ═══════ */}
        <div style={{
          background: 'rgba(10,10,10,0.85)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          padding: '20px',
          backdropFilter: 'blur(10px)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <Bot size={20} style={{ color: '#888' }} />
            <h2 style={{ 
              fontFamily: '"Orbitron", monospace', 
              fontSize: '0.9rem', 
              fontWeight: 700, 
              color: '#E5E5E5',
              margin: 0,
              letterSpacing: '0.15em',
            }}>
              AGENT ARMY
            </h2>
          </div>

          {/* Agent Cards */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {agents.map((agent) => {
              const task = taskFlow.find(t => t.to === agent.id && t.status === 'in_progress');
              const isWorking = !!task;
              return (
                <div key={agent.id} style={{
                  flex: 1,
                  background: isWorking ? `${agent.color}08` : 'rgba(0,0,0,0.3)',
                  borderRadius: '8px',
                  padding: '16px',
                  textAlign: 'center',
                  border: `1px solid ${agent.color}${isWorking ? '40' : '20'}`,
                  boxShadow: isWorking ? `0 0 30px ${agent.color}20` : 'none',
                  transition: 'all 0.3s ease',
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    border: `3px solid ${agent.color}`,
                    boxShadow: isWorking ? `0 0 25px ${agent.color}60, 0 0 50px ${agent.color}30` : `0 0 15px ${agent.color}30`,
                    margin: '0 auto 10px',
                    overflow: 'hidden',
                    position: 'relative',
                    animation: isWorking ? 'glow 2s infinite' : 'none',
                  }}>
                    <Image 
                      src={agent.image} 
                      alt={agent.name} 
                      fill 
                      style={{ objectFit: 'cover' }} 
                    />
                    {isWorking && (
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: `linear-gradient(180deg, transparent 60%, ${agent.color}40 100%)`,
                      }} />
                    )}
                  </div>
                  <div style={{ 
                    fontFamily: '"Orbitron", monospace', 
                    fontSize: '0.8rem', 
                    fontWeight: 700, 
                    color: agent.color,
                    textShadow: `0 0 10px ${agent.color}50`,
                    marginBottom: '4px',
                  }}>
                    {agent.name.toUpperCase()}
                  </div>
                  <div style={{ 
                    fontFamily: 'monospace', 
                    fontSize: '0.55rem', 
                    color: agent.type === 'human' ? '#00E5FF' : '#00FF41',
                    marginBottom: '4px',
                    letterSpacing: '0.1em',
                  }}>
                    {agent.type === 'human' ? '👤 HUMAN' : '🤖 AI'}
                  </div>
                  <div style={{ 
                    fontFamily: 'monospace', 
                    fontSize: '0.6rem', 
                    color: '#666',
                    marginBottom: '8px',
                  }}>
                    {agent.role}
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '6px',
                  }}>
                    {isWorking ? (
                      <Loader2 size={12} style={{ color: '#00FF41', animation: 'spin 1s linear infinite' }} />
                    ) : (
                      <Circle size={8} fill="#444" style={{ color: '#444' }} />
                    )}
                    <span style={{ 
                      fontFamily: 'monospace', 
                      fontSize: '0.6rem', 
                      color: isWorking ? '#00FF41' : '#444',
                    }}>
                      {isWorking ? 'WORKING' : 'IDLE'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ═══════ SYSTEM LOGS PANEL ═══════ */}
        <div style={{
          background: 'rgba(10,10,10,0.85)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          padding: '20px',
          backdropFilter: 'blur(10px)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Activity size={20} style={{ color: '#888' }} />
            <h2 style={{ 
              fontFamily: '"Orbitron", monospace', 
              fontSize: '0.9rem', 
              fontWeight: 700, 
              color: '#E5E5E5',
              margin: 0,
              letterSpacing: '0.15em',
            }}>
              SYSTEM LOGS
            </h2>
            <div style={{
              marginLeft: 'auto',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#00FF41',
              boxShadow: '0 0 10px #00FF41',
              animation: 'pulse 1s infinite',
            }} />
          </div>

          <div style={{
            background: 'rgba(0,0,0,0.5)',
            borderRadius: '4px',
            padding: '12px',
            fontFamily: '"JetBrains Mono", "Fira Code", monospace',
            fontSize: '0.7rem',
            maxHeight: '180px',
            overflowY: 'auto',
            border: '1px solid rgba(0,255,65,0.1)',
          }}>
            {[
              { time: '11:43:22', sys: 'TKM', msg: 'Task 1808a1ca assigned: Build Command Center UI', color: '#00E5FF' },
              { time: '11:40:15', sys: 'AGT', msg: 'Pinky accepted task from Reina', color: '#FF2D6A' },
              { time: '11:33:41', sys: 'TKM', msg: 'Task d482e56b completed ✓', color: '#00FF41' },
              { time: '11:33:12', sys: 'CFG', msg: 'Gateway restarted, config applied', color: '#00FF41' },
              { time: '11:28:55', sys: 'TKM', msg: 'Reina created task handoff', color: '#A855F7' },
              { time: '11:15:22', sys: 'SEO', msg: 'Pipeline stage: Research complete', color: '#00FF41' },
              { time: '11:12:08', sys: 'IDX', msg: 'Submitted 5 URLs to Search Console', color: '#00FF41' },
            ].map((log, i) => (
              <div key={i} style={{
                display: 'flex',
                gap: '10px',
                padding: '5px 0',
                borderBottom: '1px solid rgba(255,255,255,0.03)',
              }}>
                <span style={{ color: '#333', whiteSpace: 'nowrap' }}>{log.time}</span>
                <span style={{ 
                  color: log.color, 
                  minWidth: '28px',
                  textAlign: 'center',
                }}>
                  [{log.sys}]
                </span>
                <span style={{ color: '#777' }}>{log.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer Status Bar */}
      <footer style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '12px 32px',
        background: 'rgba(10,10,10,0.95)',
        borderTop: '1px solid rgba(0,255,65,0.2)',
        display: 'flex',
        justifyContent: 'center',
        gap: '40px',
        fontFamily: 'monospace',
        fontSize: '0.7rem',
        zIndex: 20,
      }}>
        <span>SEO_ENGINE <span style={{ color: '#00FF41', textShadow: '0 0 10px #00FF41' }}>● ONLINE</span></span>
        <span>TASK_MANAGER <span style={{ color: '#00FF41', textShadow: '0 0 10px #00FF41' }}>● ONLINE</span></span>
        <span>AGENT_ARMY <span style={{ color: '#00FF41', textShadow: '0 0 10px #00FF41' }}>● 3/3 ACTIVE</span></span>
      </footer>

      {/* Global styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;800&display=swap');
        
        @keyframes pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 20px currentColor; }
          50% { opacity: 0.5; box-shadow: 0 0 10px currentColor; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 25px currentColor; }
          50% { box-shadow: 0 0 40px currentColor, 0 0 60px currentColor; }
        }
        
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: rgba(0,0,0,0.3); }
        ::-webkit-scrollbar-thumb { background: rgba(0,255,65,0.3); border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(0,255,65,0.5); }
      `}</style>
    </div>
  );
}
