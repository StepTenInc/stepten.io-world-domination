'use client';

import { useEffect, useState } from 'react';
import { Mic, Check, X, Sparkles, Loader2, Play, RefreshCw, ArrowLeft } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { PublicLayout } from '@/components/layout/PublicLayout';

const supabase = createClient(
  'https://iavnhggphhrvbcidixiw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlhdm5oZ2dwaGhydmJjaWRpeGl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxODU1NjksImV4cCI6MjA1MDc2MTU2OX0.Yd--FG2xF9ofEIdqQ7HX7zCFJmFFpyhgXGE0HqMy8yY'
);

interface Idea {
  id: string;
  title: string;
  topic: string;
  angle: string | null;
  status: string;
  priority: number;
  created_at: string;
  thought_provoking_questions: string[] | null;
}

export default function TalesQueuePage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [newIdea, setNewIdea] = useState('');

  useEffect(() => {
    loadIdeas();
  }, []);

  async function loadIdeas() {
    setLoading(true);
    const { data } = await supabase
      .from('content_queue')
      .select('*')
      .in('status', ['idea', 'queued', 'researched', 'writing', 'optimized'])
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false });
    
    if (data) setIdeas(data);
    setLoading(false);
  }

  async function approveIdea(id: string) {
    setProcessing(id);
    await supabase
      .from('content_queue')
      .update({ status: 'approved' })
      .eq('id', id);
    await loadIdeas();
    setProcessing(null);
  }

  async function skipIdea(id: string) {
    await supabase
      .from('content_queue')
      .update({ status: 'skipped' })
      .eq('id', id);
    await loadIdeas();
  }

  async function submitNewIdea() {
    if (!newIdea.trim()) return;
    
    await supabase.from('content_queue').insert({
      title: newIdea.substring(0, 100),
      topic: newIdea,
      suggested_author_id: 'b3149e8b-257f-47db-b6bf-653e9ef5eb61',
      priority: 10,
      status: 'idea',
    });
    
    setNewIdea('');
    await loadIdeas();
  }

  const statusColors: Record<string, string> = {
    idea: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    queued: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    researched: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    writing: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    optimized: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    approved: 'bg-green-500/20 text-green-400 border-green-500/30',
  };

  return (
    <PublicLayout>
      <div className="min-h-screen" style={{ paddingTop: '100px' }}>
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
          
          {/* Header */}
          <div style={{ marginBottom: '40px' }}>
            <Link href="/tales" style={{ 
              color: 'var(--mx)', 
              fontSize: '0.85rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              marginBottom: '16px',
              textDecoration: 'none',
            }}>
              <ArrowLeft size={16} /> Back to Tales
            </Link>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '8px' }}>Content Queue</h1>
            <p style={{ color: 'var(--mg)', fontSize: '1.1rem' }}>Ideas generated from your conversations</p>
          </div>

          {/* New Idea Input */}
          <div style={{ 
            marginBottom: '40px', 
            padding: '24px', 
            borderRadius: '12px', 
            border: '1px solid var(--mx)',
            background: 'rgba(0, 255, 65, 0.05)',
          }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} style={{ color: 'var(--mx)' }} />
              Add Your Own Idea
            </h2>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                type="text"
                value={newIdea}
                onChange={(e) => setNewIdea(e.target.value)}
                placeholder="What's on your mind? Drop an idea..."
                style={{
                  flex: 1,
                  background: 'var(--dk)',
                  border: '1px solid var(--bd)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  color: 'var(--fg)',
                  fontSize: '1rem',
                }}
                onKeyDown={(e) => e.key === 'Enter' && submitNewIdea()}
              />
              <button
                onClick={submitNewIdea}
                disabled={!newIdea.trim()}
                style={{
                  padding: '12px 24px',
                  background: 'var(--mx)',
                  color: 'var(--bg)',
                  fontWeight: '600',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: newIdea.trim() ? 'pointer' : 'not-allowed',
                  opacity: newIdea.trim() ? 1 : 0.5,
                }}
              >
                Add Idea
              </button>
            </div>
          </div>

          {/* Ideas Queue */}
          <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Play size={20} />
              Ideas Queue ({ideas.length})
            </h2>
            <button onClick={loadIdeas} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}>
              <RefreshCw size={20} style={{ color: 'var(--mg)' }} />
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--mx)' }} />
            </div>
          ) : ideas.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--mg)' }}>
              <p>No ideas in queue.</p>
              <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>Ideas will be generated from your daily conversations.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {ideas.map((idea) => (
                <div
                  key={idea.id}
                  style={{
                    padding: '24px',
                    borderRadius: '12px',
                    border: '1px solid var(--bd)',
                    background: 'var(--dk)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <span className={statusColors[idea.status]} style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          fontFamily: 'var(--fm)',
                          border: '1px solid',
                        }}>
                          {idea.status.toUpperCase()}
                        </span>
                        <span style={{ color: 'var(--mg)', fontSize: '0.85rem' }}>
                          Priority: {idea.priority}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '8px' }}>{idea.title}</h3>
                      <p style={{ color: 'var(--mg)', marginBottom: '12px' }}>{idea.topic}</p>
                      {idea.angle && (
                        <p style={{ color: 'var(--mg)', fontSize: '0.9rem', fontStyle: 'italic' }}>Angle: {idea.angle}</p>
                      )}
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '120px' }}>
                      <button
                        onClick={() => approveIdea(idea.id)}
                        disabled={processing === idea.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          padding: '10px 16px',
                          background: 'var(--mx)',
                          color: 'var(--bg)',
                          fontWeight: '600',
                          borderRadius: '8px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                        }}
                      >
                        {processing === idea.id ? (
                          <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                        ) : (
                          <Check size={16} />
                        )}
                        Auto
                      </button>
                      <button
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          padding: '10px 16px',
                          background: '#8B5CF6',
                          color: 'white',
                          fontWeight: '600',
                          borderRadius: '8px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                        }}
                      >
                        <Mic size={16} />
                        Record
                      </button>
                      <button
                        onClick={() => skipIdea(idea.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          padding: '10px 16px',
                          background: 'rgba(255,255,255,0.1)',
                          color: 'var(--mg)',
                          borderRadius: '8px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                        }}
                      >
                        <X size={16} />
                        Skip
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
