'use client';

import { useEffect, useState, useRef } from 'react';
import { Bot, Zap, FileText, Activity, CheckCircle, Circle, Loader2, ArrowRight, Clock, Target, Search, PenTool, Image as ImageIcon, BarChart3, Send, Sparkles, BookOpen, Link, ExternalLink, TrendingUp, AlertCircle, Crosshair, Terminal, RefreshCw } from 'lucide-react';

// Custom generated icons paths
const iconPaths: Record<string, string> = {
  overview: '/icons/icon-overview.png',
  tales: '/icons/icon-tales.png',
  tasks: '/icons/icon-tasks.png',
  agents: '/icons/icon-agents.png',
  logs: '/icons/icon-logs.png',
};
import Image from 'next/image';
import { characters } from '@/lib/design-tokens';
import { createClient } from '@supabase/supabase-js';

// Supabase clients
const armySupabase = createClient(
  'https://ebqourqkrxalatubbapw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVicW91cnFrcnhhbGF0dWJiYXB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyNjk5NTMsImV4cCI6MjA4Njg0NTk1M30.0Mi_ENZCDo4YDG6jiuPS1gJKuc-7Ok4bCJ7-cJcJTwg'
);

const steptenSupabase = createClient(
  'https://iavnhggphhrvbcidixiw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlhdm5oZ2dwaGhydmJjaWRpeGl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwMDUwMzgsImV4cCI6MjA4MzU4MTAzOH0.o6-WnuWzunOS637ihjfsVMyag9EHMscm5A0ywtJYu2I'
);

// Team data
const team = [
  { id: 'stepten', slug: 'stephen', name: 'Stephen', role: 'The Brain', color: characters.stepten.color, image: characters.stepten.image, type: 'human' },
  { id: 'pinky', slug: 'pinky', name: 'Pinky', role: 'Research & Comms', color: characters.pinky.color, image: characters.pinky.image, type: 'ai' },
  { id: 'reina', slug: 'reina', name: 'Reina', role: 'UX & Frontend', color: characters.reina.color, image: characters.reina.image, type: 'ai' },
  { id: 'clark', slug: 'clark', name: 'Clark', role: 'Backend & Data', color: characters.clark.color, image: characters.clark.image, type: 'ai' },
];

// Agent UUID mapping
const agentUUIDs: Record<string, string> = {
  '4ff87193-d4bf-4628-a2cb-48501dc1e437': 'stepten',
  '06a22a80-5b34-4044-ae32-077a503f6098': 'pinky',
  '4c50dfa9-2a21-4423-a1a6-4b4123f35c77': 'reina',
  '924cbb87-5e0d-4f86-90a5-7e0ab1373e0f': 'clark',
};

type Tab = 'overview' | 'marketing' | 'tasks' | 'agents' | 'logs';

// Tab config with hotkeys
const tabs = [
  { id: 'overview', label: 'OVERVIEW', key: '1', icon: 'overview', color: '#00FF41' },
  { id: 'marketing', label: 'TALES', key: '2', icon: 'tales', color: '#00E5FF' },
  { id: 'tasks', label: 'TASKS', key: '3', icon: 'tasks', color: '#FF00FF' },
  { id: 'agents', label: 'AGENTS', key: '4', icon: 'agents', color: '#FFD700' },
  { id: 'logs', label: 'LOGS', key: '5', icon: 'logs', color: '#FF4444' },
];

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  created_by: string;
  assigned_to: string;
  created_at: string;
  completed_at: string | null;
}

interface Tale {
  id: string;
  slug: string;
  title: string;
  status: string;
  author_id: string;
  stepten_score: number | null;
  word_count: number | null;
  published_at: string | null;
  created_at: string;
}

// Matrix rain characters
const matrixChars = 'アイウエオカキクケコサシスセソ0123456789ABCDEF';

export default function EnginePage() {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tales, setTales] = useState<Tale[]>([]);
  const [loading, setLoading] = useState(true);
  const [dockHovered, setDockHovered] = useState(false);
  const [contentQueue, setContentQueue] = useState<any[]>([]);

  // Load content queue
  async function loadContentQueue() {
    const { data } = await steptenSupabase
      .from('content_queue')
      .select('*')
      .in('status', ['idea', 'queued', 'researched', 'writing'])
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(10);
    if (data) setContentQueue(data);
  }

  // Approve idea for auto-generation
  async function approveIdea(id: string) {
    await steptenSupabase
      .from('content_queue')
      .update({ status: 'approved' })
      .eq('id', id);
    loadContentQueue();
  }

  // Skip idea
  async function skipIdea(id: string) {
    await steptenSupabase
      .from('content_queue')
      .update({ status: 'skipped' })
      .eq('id', id);
    loadContentQueue();
  }
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      // Up/Down to show/hide dock
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setDockHovered(true);
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setDockHovered(false);
        return;
      }
      
      // Left/Right to navigate tabs
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        setDockHovered(true); // Show dock when navigating
        setActiveTab(prev => {
          const currentIndex = tabs.findIndex(t => t.id === prev);
          if (e.key === 'ArrowLeft') {
            return tabs[currentIndex > 0 ? currentIndex - 1 : tabs.length - 1].id as Tab;
          } else {
            return tabs[currentIndex < tabs.length - 1 ? currentIndex + 1 : 0].id as Tab;
          }
        });
        return;
      }
      
      // Number key navigation still works
      const tab = tabs.find(t => t.key === e.key);
      if (tab) {
        setActiveTab(tab.id as Tab);
        setDockHovered(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch real data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Fetch tasks from Army
      const { data: tasksData } = await armySupabase
        .from('army_tasks')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (tasksData) setTasks(tasksData);

      // Fetch tales from StepTen.io
      const { data: talesData } = await steptenSupabase
        .from('tales')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (talesData) setTales(talesData);

      // Fetch content queue
      const { data: queueData } = await steptenSupabase
        .from('content_queue')
        .select('*')
        .in('status', ['idea', 'queued', 'researched', 'writing'])
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (queueData) setContentQueue(queueData);
      
      setLoading(false);
    };

    fetchData();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

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
      ctx.fillStyle = '#00FF4110';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);
    const handleResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', handleResize);
    return () => { clearInterval(interval); window.removeEventListener('resize', handleResize); };
  }, []);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => setCurrentTime(new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getAgentById = (uuid: string) => {
    const slug = agentUUIDs[uuid];
    return team.find(t => t.slug === slug || t.id === slug) || team[0];
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': case 'published': return '#00FF41';
      case 'in_progress': case 'draft': return '#00E5FF';
      case 'pending': case 'queued': return '#FFD700';
      case 'failed': case 'error': return '#FF4444';
      default: return '#444';
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-AU', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  // Stats
  const publishedTales = tales.filter(t => t.status === 'published').length;
  const draftTales = tales.filter(t => t.status === 'draft').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const avgScore = tales.filter(t => t.stepten_score).reduce((acc, t) => acc + (t.stepten_score || 0), 0) / (tales.filter(t => t.stepten_score).length || 1);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#E5E5E5', fontFamily: 'Inter, system-ui, sans-serif', position: 'relative', overflow: 'hidden' }}>
      {/* Matrix Rain */}
      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }} />
      
      {/* Scan lines */}
      <div style={{ position: 'fixed', inset: 0, background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 2px)', pointerEvents: 'none', zIndex: 2 }} />

      {/* Header */}
      <header style={{ padding: '16px 32px', borderBottom: '1px solid rgba(0,255,65,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 10, background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(10px)' }}>
        <div>
          <h1 style={{ fontFamily: '"Orbitron", monospace', fontSize: '1.3rem', fontWeight: 800, color: '#00FF41', textShadow: '0 0 30px rgba(0,255,65,0.5)', margin: 0, letterSpacing: '0.15em' }}>
            STEPTEN COMMAND CENTER
          </h1>
          <p style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: '#00FF41', margin: '4px 0 0 0', letterSpacing: '0.3em', opacity: 0.6 }}>
            {'>'} NO_HANDS.exe // LIVE_DATA
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(0,255,65,0.1)', borderRadius: '4px', border: '1px solid rgba(0,255,65,0.3)' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00FF41', boxShadow: '0 0 20px #00FF41', animation: 'pulse 1s infinite' }} />
            <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#00FF41', fontWeight: 700 }}>LIVE</span>
          </div>
          <span style={{ fontFamily: '"Orbitron", monospace', fontSize: '1.1rem', color: '#00FF41', textShadow: '0 0 10px rgba(0,255,65,0.5)', letterSpacing: '0.1em' }}>{currentTime}</span>
        </div>
      </header>

      {/* Navigation moved to bottom dock */}

      {/* Main Content */}
      <main style={{ padding: '24px 32px', maxWidth: '1800px', margin: '0 auto', position: 'relative', zIndex: 10, paddingBottom: '150px' }}>
        
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px', gap: '12px' }}>
            <Loader2 size={24} style={{ color: '#00FF41', animation: 'spin 1s linear infinite' }} />
            <span style={{ fontFamily: 'monospace', color: '#00FF41' }}>LOADING DATA...</span>
          </div>
        ) : (
          <>
            {/* ═══════ OVERVIEW TAB ═══════ */}
            {activeTab === 'overview' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                
                {/* Stats Cards */}
                <div style={{ gridColumn: 'span 2', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                  {[
                    { label: 'TALES PUBLISHED', value: publishedTales, color: '#00FF41' },
                    { label: 'AVG SCORE', value: avgScore.toFixed(1), color: '#00E5FF' },
                    { label: 'TASKS COMPLETED', value: completedTasks, color: '#FF00FF' },
                    { label: 'IN PROGRESS', value: inProgressTasks, color: '#FFD700' },
                  ].map((stat, i) => (
                    <div key={i} style={{ background: 'rgba(10,10,10,0.85)', border: `1px solid ${stat.color}30`, borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
                      <div style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: '#666', marginBottom: '8px', letterSpacing: '0.1em' }}>{stat.label}</div>
                      <div style={{ fontFamily: '"Orbitron", monospace', fontSize: '2rem', fontWeight: 700, color: stat.color, textShadow: `0 0 20px ${stat.color}50` }}>{stat.value}</div>
                    </div>
                  ))}
                </div>

                {/* Agent Army */}
                <div style={{ background: 'rgba(10,10,10,0.85)', border: '1px solid rgba(0,229,255,0.2)', borderRadius: '8px', padding: '20px' }}>
                  <h2 style={{ fontFamily: '"Orbitron", monospace', fontSize: '0.9rem', fontWeight: 700, color: '#00E5FF', margin: '0 0 20px 0', letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Bot size={18} /> AGENT ARMY
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                    {team.map((agent) => {
                      const agentTasks = tasks.filter(t => agentUUIDs[t.assigned_to] === agent.slug);
                      const isWorking = agentTasks.some(t => t.status === 'in_progress');
                      return (
                        <div key={agent.id} style={{ background: isWorking ? `${agent.color}08` : 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '12px', textAlign: 'center', border: `1px solid ${agent.color}${isWorking ? '40' : '20'}` }}>
                          <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: `2px solid ${agent.color}`, boxShadow: isWorking ? `0 0 20px ${agent.color}60` : `0 0 10px ${agent.color}30`, margin: '0 auto 8px', overflow: 'hidden', position: 'relative' }}>
                            <Image src={agent.image} alt={agent.name} fill style={{ objectFit: 'cover' }} />
                          </div>
                          <div style={{ fontFamily: '"Orbitron", monospace', fontSize: '0.7rem', fontWeight: 700, color: agent.color }}>{agent.name.toUpperCase()}</div>
                          <div style={{ fontFamily: 'monospace', fontSize: '0.5rem', color: agent.type === 'human' ? '#00E5FF' : '#00FF41', marginTop: '4px' }}>{agent.type === 'human' ? '👤 HUMAN' : '🤖 AI'}</div>
                          <div style={{ fontFamily: 'monospace', fontSize: '0.55rem', color: isWorking ? '#00FF41' : '#444', marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                            {isWorking ? <><Loader2 size={10} style={{ animation: 'spin 1s linear infinite' }} /> WORKING</> : <><Circle size={8} fill="#444" /> IDLE</>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recent Tasks */}
                <div style={{ background: 'rgba(10,10,10,0.85)', border: '1px solid rgba(255,0,255,0.2)', borderRadius: '8px', padding: '20px' }}>
                  <h2 style={{ fontFamily: '"Orbitron", monospace', fontSize: '0.9rem', fontWeight: 700, color: '#FF00FF', margin: '0 0 20px 0', letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Sparkles size={18} /> RECENT TASKS
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                    {tasks.slice(0, 6).map((task) => {
                      const fromAgent = getAgentById(task.created_by);
                      const toAgent = getAgentById(task.assigned_to);
                      return (
                        <div key={task.id} style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '6px', padding: '12px', border: `1px solid ${getStatusColor(task.status)}20` }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: `2px solid ${fromAgent.color}`, overflow: 'hidden', position: 'relative' }}>
                              <Image src={fromAgent.image} alt={fromAgent.name} fill style={{ objectFit: 'cover' }} />
                            </div>
                            <ArrowRight size={12} style={{ color: '#444' }} />
                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: `2px solid ${toAgent.color}`, overflow: 'hidden', position: 'relative' }}>
                              <Image src={toAgent.image} alt={toAgent.name} fill style={{ objectFit: 'cover' }} />
                            </div>
                            <span style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: '0.6rem', color: getStatusColor(task.status), padding: '2px 8px', background: `${getStatusColor(task.status)}15`, borderRadius: '3px' }}>
                              {task.status?.toUpperCase()}
                            </span>
                          </div>
                          <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#E5E5E5', marginBottom: '4px' }}>{task.title}</div>
                          <div style={{ fontFamily: 'monospace', fontSize: '0.55rem', color: '#555' }}>{formatDate(task.created_at)}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ═══════ MARKETING TAB (TALES) ═══════ */}
            {activeTab === 'marketing' && (
              <div>
                {/* Content Queue Section */}
                <div style={{ marginBottom: '30px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2 style={{ fontFamily: '"Orbitron", monospace', fontSize: '1rem', fontWeight: 700, color: '#A78BFA', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                      📝 CONTENT QUEUE ({contentQueue.length})
                    </h2>
                    <button onClick={loadContentQueue} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                      <RefreshCw size={14} style={{ color: '#666' }} />
                    </button>
                  </div>
                  
                  {contentQueue.length > 0 ? (
                    <div style={{ background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '8px', overflow: 'hidden' }}>
                      {contentQueue.slice(0, 5).map((idea: any) => (
                        <div key={idea.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid rgba(139,92,246,0.1)' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#E5E5E5', marginBottom: '4px' }}>{idea.title}</div>
                            <div style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: '#666' }}>
                              <span style={{ color: idea.status === 'idea' ? '#EAB308' : idea.status === 'queued' ? '#3B82F6' : '#A78BFA', marginRight: '12px' }}>● {idea.status.toUpperCase()}</span>
                              Priority: {idea.priority}
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => approveIdea(idea.id)} style={{ padding: '6px 12px', background: '#00FF41', color: '#000', fontFamily: 'monospace', fontSize: '0.65rem', fontWeight: 600, borderRadius: '4px', border: 'none', cursor: 'pointer' }}>
                              ✓ AUTO
                            </button>
                            <button onClick={() => skipIdea(idea.id)} style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.1)', color: '#888', fontFamily: 'monospace', fontSize: '0.65rem', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>
                              ✕ SKIP
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#666', fontFamily: 'monospace', fontSize: '0.75rem', background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '8px' }}>
                      No ideas in queue. Ideas are generated daily from your conversations.
                    </div>
                  )}
                </div>

                {/* Published Tales Section */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ fontFamily: '"Orbitron", monospace', fontSize: '1rem', fontWeight: 700, color: '#00FF41', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <BookOpen size={20} /> TALES ({tales.length})
                  </h2>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#00FF41' }}>✓ {publishedTales} Published</span>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#FFD700' }}>◐ {draftTales} Draft</span>
                  </div>
                </div>
                
                {/* Tales Table */}
                <div style={{ background: 'rgba(10,10,10,0.85)', border: '1px solid rgba(0,255,65,0.2)', borderRadius: '8px', overflow: 'hidden' }}>
                  {/* Header */}
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 100px 100px 120px 80px', gap: '16px', padding: '12px 16px', background: 'rgba(0,255,65,0.05)', borderBottom: '1px solid rgba(0,255,65,0.1)', fontFamily: 'monospace', fontSize: '0.65rem', color: '#666', letterSpacing: '0.1em' }}>
                    <div>TITLE</div>
                    <div>AUTHOR</div>
                    <div>SCORE</div>
                    <div>WORDS</div>
                    <div>PUBLISHED</div>
                    <div>STATUS</div>
                  </div>
                  
                  {/* Rows */}
                  <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    {tales.map((tale) => {
                      const author = team.find(t => t.id === tale.author_id || t.slug === tale.author_id) || team[1];
                      return (
                        <div key={tale.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 100px 100px 120px 80px', gap: '16px', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.03)', alignItems: 'center' }}>
                          <div>
                            <a href={`https://stepten.io/tales/${tale.slug}`} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#E5E5E5', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              {tale.title}
                              <ExternalLink size={12} style={{ color: '#444' }} />
                            </a>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `1px solid ${author.color}`, overflow: 'hidden', position: 'relative' }}>
                              <Image src={author.image} alt={author.name} fill style={{ objectFit: 'cover' }} />
                            </div>
                            <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: author.color }}>{author.name}</span>
                          </div>
                          <div>
                            {tale.stepten_score ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '40px', height: '6px', background: 'rgba(0,0,0,0.3)', borderRadius: '3px', overflow: 'hidden' }}>
                                  <div style={{ width: `${tale.stepten_score}%`, height: '100%', background: tale.stepten_score >= 80 ? '#00FF41' : tale.stepten_score >= 60 ? '#FFD700' : '#FF4444' }} />
                                </div>
                                <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: tale.stepten_score >= 80 ? '#00FF41' : tale.stepten_score >= 60 ? '#FFD700' : '#FF4444' }}>{tale.stepten_score}</span>
                              </div>
                            ) : (
                              <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#444' }}>-</span>
                            )}
                          </div>
                          <div style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#888' }}>{tale.word_count?.toLocaleString() || '-'}</div>
                          <div style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: '#666' }}>{tale.published_at ? formatDate(tale.published_at) : '-'}</div>
                          <div>
                            <span style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: getStatusColor(tale.status), padding: '2px 8px', background: `${getStatusColor(tale.status)}15`, borderRadius: '3px' }}>
                              {tale.status?.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ═══════ AGENTS TAB ═══════ */}
            {activeTab === 'agents' && (
              <div>
                <h2 style={{ fontFamily: '"Orbitron", monospace', fontSize: '1rem', fontWeight: 700, color: '#FFD700', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Bot size={20} /> THE ARMY
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                  {team.map((agent) => {
                    const agentTasks = tasks.filter(t => agentUUIDs[t.assigned_to] === agent.slug);
                    const completedCount = agentTasks.filter(t => t.status === 'completed').length;
                    const activeCount = agentTasks.filter(t => t.status === 'in_progress').length;
                    const isWorking = activeCount > 0;
                    return (
                      <div key={agent.id} style={{
                        background: 'rgba(10,10,10,0.85)',
                        border: `1px solid ${agent.color}40`,
                        borderRadius: '16px',
                        padding: '24px',
                        textAlign: 'center',
                        boxShadow: isWorking ? `0 0 40px ${agent.color}20` : 'none',
                      }}>
                        <div style={{
                          width: '80px',
                          height: '80px',
                          borderRadius: '50%',
                          border: `3px solid ${agent.color}`,
                          boxShadow: `0 0 30px ${agent.color}50`,
                          margin: '0 auto 16px',
                          overflow: 'hidden',
                          position: 'relative',
                        }}>
                          <Image src={agent.image} alt={agent.name} fill style={{ objectFit: 'cover' }} />
                        </div>
                        <div style={{ fontFamily: '"Orbitron", monospace', fontSize: '1rem', fontWeight: 700, color: agent.color, textShadow: `0 0 15px ${agent.color}50`, marginBottom: '4px' }}>
                          {agent.name.toUpperCase()}
                        </div>
                        <div style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: agent.type === 'human' ? '#00E5FF' : '#00FF41', marginBottom: '8px' }}>
                          {agent.type === 'human' ? '👤 HUMAN' : '🤖 AI AGENT'}
                        </div>
                        <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#888', marginBottom: '16px' }}>
                          {agent.role}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px' }}>
                            <div style={{ fontFamily: '"Orbitron", monospace', fontSize: '1.2rem', color: '#00FF41' }}>{completedCount}</div>
                            <div style={{ fontFamily: 'monospace', fontSize: '0.55rem', color: '#666' }}>DONE</div>
                          </div>
                          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px' }}>
                            <div style={{ fontFamily: '"Orbitron", monospace', fontSize: '1.2rem', color: '#00E5FF' }}>{activeCount}</div>
                            <div style={{ fontFamily: 'monospace', fontSize: '0.55rem', color: '#666' }}>ACTIVE</div>
                          </div>
                        </div>
                        <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                          {isWorking ? (
                            <><Loader2 size={12} style={{ color: '#00FF41', animation: 'spin 1s linear infinite' }} /><span style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: '#00FF41' }}>WORKING</span></>
                          ) : (
                            <><Circle size={8} fill="#444" style={{ color: '#444' }} /><span style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: '#444' }}>IDLE</span></>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ═══════ LOGS TAB ═══════ */}
            {activeTab === 'logs' && (
              <div>
                <h2 style={{ fontFamily: '"Orbitron", monospace', fontSize: '1rem', fontWeight: 700, color: '#FF4444', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Activity size={20} /> SYSTEM LOGS
                </h2>
                <div style={{
                  background: 'rgba(5,5,5,0.9)',
                  border: '1px solid rgba(255,68,68,0.2)',
                  borderRadius: '8px',
                  padding: '20px',
                  fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                  fontSize: '0.75rem',
                  maxHeight: '600px',
                  overflowY: 'auto',
                }}>
                  {tasks.map((task, i) => {
                    const agent = getAgentById(task.assigned_to);
                    return (
                      <div key={task.id} style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.03)', display: 'flex', gap: '16px' }}>
                        <span style={{ color: '#333', whiteSpace: 'nowrap' }}>{formatDate(task.created_at)}</span>
                        <span style={{ color: agent.color, minWidth: '60px' }}>[{agent.name.toUpperCase().slice(0,5)}]</span>
                        <span style={{ color: getStatusColor(task.status) }}>{task.status?.toUpperCase()}</span>
                        <span style={{ color: '#777', flex: 1 }}>{task.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ═══════ TASKS TAB ═══════ */}
            {activeTab === 'tasks' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ fontFamily: '"Orbitron", monospace', fontSize: '1rem', fontWeight: 700, color: '#FF00FF', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Sparkles size={20} /> TASK FEED ({tasks.length})
                  </h2>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#00FF41' }}>✓ {completedTasks} Done</span>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#00E5FF' }}>⚡ {inProgressTasks} Active</span>
                  </div>
                </div>

                {/* Tasks List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {tasks.map((task) => {
                    const fromAgent = getAgentById(task.created_by);
                    const toAgent = getAgentById(task.assigned_to);
                    return (
                      <div key={task.id} style={{ background: 'rgba(10,10,10,0.85)', border: `1px solid ${getStatusColor(task.status)}30`, borderRadius: '8px', padding: '16px', position: 'relative', overflow: 'hidden' }}>
                        {task.status === 'in_progress' && (
                          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, #00E5FF, transparent)', animation: 'shimmer 2s infinite' }} />
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: `2px solid ${fromAgent.color}`, overflow: 'hidden', position: 'relative', boxShadow: `0 0 10px ${fromAgent.color}40` }}>
                            <Image src={fromAgent.image} alt={fromAgent.name} fill style={{ objectFit: 'cover' }} />
                          </div>
                          <ArrowRight size={16} style={{ color: '#444' }} />
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: `2px solid ${toAgent.color}`, overflow: 'hidden', position: 'relative', boxShadow: task.status === 'in_progress' ? `0 0 15px ${toAgent.color}60` : `0 0 10px ${toAgent.color}40` }}>
                            <Image src={toAgent.image} alt={toAgent.name} fill style={{ objectFit: 'cover' }} />
                          </div>
                          <div style={{ marginLeft: '8px' }}>
                            <div style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: '#666' }}>
                              {fromAgent.name} → {toAgent.name}
                            </div>
                          </div>
                          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: task.priority === 'high' ? '#FF4444' : task.priority === 'medium' ? '#FFD700' : '#666', padding: '2px 6px', background: 'rgba(0,0,0,0.3)', borderRadius: '3px' }}>
                              {task.priority?.toUpperCase() || 'NORMAL'}
                            </span>
                            <span style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: getStatusColor(task.status), padding: '4px 12px', background: `${getStatusColor(task.status)}15`, borderRadius: '4px', border: `1px solid ${getStatusColor(task.status)}40`, display: 'flex', alignItems: 'center', gap: '6px' }}>
                              {task.status === 'in_progress' && <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} />}
                              {task.status === 'completed' && <CheckCircle size={12} />}
                              {task.status === 'pending' && <Clock size={12} />}
                              {task.status?.toUpperCase().replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                        <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: '#E5E5E5', marginBottom: '8px' }}>{task.title}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'monospace', fontSize: '0.6rem', color: '#555' }}>
                          <span>ID: {task.id.slice(0, 8)}...</span>
                          <span>{formatDate(task.created_at)} {task.completed_at ? `→ ${formatDate(task.completed_at)}` : ''}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* ═══════ BOTTOM COMMAND DOCK ═══════ */}
      <div
        onMouseEnter={() => setDockHovered(true)}
        onMouseLeave={() => setDockHovered(false)}
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Collapsed indicator bar */}
        <div style={{
          position: 'absolute',
          bottom: '8px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '200px',
          height: '4px',
          background: 'linear-gradient(90deg, transparent, #00FF41, transparent)',
          borderRadius: '2px',
          opacity: dockHovered ? 0 : 0.6,
          transition: 'opacity 0.3s',
          boxShadow: '0 0 20px rgba(0,255,65,0.5)',
        }} />

        {/* Main Dock */}
        <div style={{
          background: 'rgba(5,5,5,0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0,255,65,0.3)',
          borderBottom: 'none',
          borderRadius: '20px 20px 0 0',
          padding: dockHovered ? '20px 32px 24px' : '8px 32px 12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 -10px 60px rgba(0,0,0,0.8), 0 0 40px rgba(0,255,65,0.1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: dockHovered ? 'translateY(0)' : 'translateY(60px)',
        }}>
          {/* Dock Handle */}
          <div style={{
            width: '60px',
            height: '4px',
            background: 'linear-gradient(90deg, #00FF41, #00E5FF)',
            borderRadius: '2px',
            opacity: 0.5,
          }} />

          {/* Hotkey hint */}
          <div style={{
            fontFamily: 'monospace',
            fontSize: '0.55rem',
            color: '#444',
            letterSpacing: '0.2em',
            opacity: dockHovered ? 1 : 0,
            transition: 'opacity 0.2s',
          }}>
            ↑ SHOW | ↓ HIDE | ← → NAVIGATE | 1-5 JUMP
          </div>

          {/* Tab Buttons */}
          <div style={{
            display: 'flex',
            gap: '8px',
            opacity: dockHovered ? 1 : 0,
            transition: 'opacity 0.2s',
          }}>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  style={{
                    position: 'relative',
                    padding: '12px 20px',
                    background: isActive 
                      ? `linear-gradient(180deg, ${tab.color}30, ${tab.color}10)`
                      : 'rgba(20,20,20,0.8)',
                    border: isActive 
                      ? `1px solid ${tab.color}60`
                      : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    minWidth: '80px',
                    transition: 'all 0.2s',
                    boxShadow: isActive 
                      ? `0 0 30px ${tab.color}40, inset 0 0 20px ${tab.color}10`
                      : 'none',
                  }}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div style={{
                      position: 'absolute',
                      top: '-1px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '40px',
                      height: '3px',
                      background: tab.color,
                      borderRadius: '0 0 3px 3px',
                      boxShadow: `0 0 15px ${tab.color}`,
                    }} />
                  )}
                  
                  {/* Custom Generated Icon */}
                  <div style={{
                    width: '32px',
                    height: '32px',
                    position: 'relative',
                    filter: isActive ? `drop-shadow(0 0 8px ${tab.color}) drop-shadow(0 0 15px ${tab.color})` : 'grayscale(100%) brightness(0.4)',
                    transition: 'filter 0.2s',
                  }}>
                    <Image 
                      src={iconPaths[tab.icon]} 
                      alt={tab.label}
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  
                  {/* Label */}
                  <span style={{
                    fontFamily: '"Orbitron", monospace',
                    fontSize: '0.6rem',
                    fontWeight: 600,
                    color: isActive ? tab.color : '#666',
                    letterSpacing: '0.05em',
                    textShadow: isActive ? `0 0 10px ${tab.color}` : 'none',
                  }}>
                    {tab.label}
                  </span>
                  
                  {/* Hotkey badge */}
                  <span style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    fontFamily: 'monospace',
                    fontSize: '0.5rem',
                    color: isActive ? tab.color : '#444',
                    background: 'rgba(0,0,0,0.5)',
                    padding: '2px 4px',
                    borderRadius: '3px',
                    border: `1px solid ${isActive ? tab.color + '40' : '#333'}`,
                  }}>
                    {tab.key}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Status bar */}
          <div style={{
            display: 'flex',
            gap: '24px',
            fontFamily: 'monospace',
            fontSize: '0.6rem',
            opacity: dockHovered ? 1 : 0,
            transition: 'opacity 0.2s',
          }}>
            <span style={{ color: '#666' }}>
              TALES <span style={{ color: '#00FF41' }}>{publishedTales}</span>
            </span>
            <span style={{ color: '#666' }}>
              TASKS <span style={{ color: '#00E5FF' }}>{inProgressTasks}</span>
            </span>
            <span style={{ color: '#666' }}>
              AGENTS <span style={{ color: '#FF00FF' }}>{team.filter(t => t.type === 'ai').length}</span>
            </span>
            <span style={{ color: '#666' }}>
              {currentTime}
            </span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;800&display=swap');
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: rgba(0,0,0,0.3); }
        ::-webkit-scrollbar-thumb { background: rgba(0,255,65,0.3); border-radius: 2px; }
      `}</style>
    </div>
  );
}
