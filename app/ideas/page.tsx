'use client';

import { useEffect, useState } from 'react';
import { Mic, MicOff, Check, X, Sparkles, Loader2, Play, RefreshCw } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  'https://iavnhggphhrvbcidixiw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlhdm5oZ2dwaGhydmJjaWRpeGl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwMDUwMzgsImV4cCI6MjA4MzU4MTAzOH0.o6-WnuWzunOS637ihjfsVMyag9EHMscm5A0ywtJYu2I'
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

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [newIdea, setNewIdea] = useState('');

  useEffect(() => {
    loadIdeas();
  }, []);

  async function loadIdeas() {
    setLoading(true);
    const { data, error } = await supabase
      .from('content_queue')
      .select('*')
      .in('status', ['idea', 'queued', 'researched'])
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false });
    
    if (data) setIdeas(data);
    setLoading(false);
  }

  async function approveIdea(id: string) {
    setProcessing(id);
    // Update status to trigger pipeline
    await supabase
      .from('content_queue')
      .update({ status: 'approved' })
      .eq('id', id);
    
    // TODO: Create army_task and trigger pipeline
    
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
    approved: 'bg-green-500/20 text-green-400 border-green-500/30',
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-[#00FF41]/20 bg-black/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="text-[#00FF41] font-mono text-sm hover:underline">← STEPTEN.IO</Link>
              <h1 className="text-2xl font-bold mt-1">Content Ideas</h1>
              <p className="text-gray-400 text-sm">Generated from your conversations</p>
            </div>
            <button
              onClick={loadIdeas}
              className="p-2 hover:bg-white/10 rounded-lg transition"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* New Idea Input */}
        <div className="mb-8 p-6 rounded-xl border border-[#00FF41]/30 bg-[#00FF41]/5">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#00FF41]" />
            Add Your Own Idea
          </h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={newIdea}
              onChange={(e) => setNewIdea(e.target.value)}
              placeholder="What's on your mind? Drop an idea..."
              className="flex-1 bg-black/50 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-[#00FF41] transition"
              onKeyDown={(e) => e.key === 'Enter' && submitNewIdea()}
            />
            <button
              onClick={submitNewIdea}
              disabled={!newIdea.trim()}
              className="px-6 py-3 bg-[#00FF41] text-black font-semibold rounded-lg hover:bg-[#00FF41]/80 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Add Idea
            </button>
          </div>
          <p className="text-gray-500 text-sm mt-2">
            Or use voice input (coming soon) to speak your ideas
          </p>
        </div>

        {/* Ideas Queue */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Play className="w-5 h-5" />
            Ideas Queue ({ideas.length})
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#00FF41]" />
            </div>
          ) : ideas.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No ideas in queue.</p>
              <p className="text-sm mt-2">Ideas will be generated from your daily conversations.</p>
            </div>
          ) : (
            ideas.map((idea) => (
              <div
                key={idea.id}
                className="p-6 rounded-xl border border-white/10 bg-white/5 hover:border-white/20 transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-mono border ${statusColors[idea.status] || 'bg-gray-500/20'}`}>
                        {idea.status.toUpperCase()}
                      </span>
                      <span className="text-gray-500 text-sm">
                        Priority: {idea.priority}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{idea.title}</h3>
                    <p className="text-gray-400 mb-3">{idea.topic}</p>
                    {idea.angle && (
                      <p className="text-gray-500 text-sm italic">Angle: {idea.angle}</p>
                    )}
                    {idea.thought_provoking_questions && (
                      <div className="mt-3 space-y-1">
                        <p className="text-gray-500 text-xs uppercase">Key Points:</p>
                        <ul className="list-disc list-inside text-gray-400 text-sm">
                          {idea.thought_provoking_questions.slice(0, 3).map((q, i) => (
                            <li key={i}>{q}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => approveIdea(idea.id)}
                      disabled={processing === idea.id}
                      className="flex items-center gap-2 px-4 py-2 bg-[#00FF41] text-black font-semibold rounded-lg hover:bg-[#00FF41]/80 disabled:opacity-50 transition"
                    >
                      {processing === idea.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      Auto
                    </button>
                    <button
                      onClick={() => {/* TODO: Record modal */}}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-500/80 transition"
                    >
                      <Mic className="w-4 h-4" />
                      Record
                    </button>
                    <button
                      onClick={() => skipIdea(idea.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-white/10 text-gray-400 rounded-lg hover:bg-white/20 transition"
                    >
                      <X className="w-4 h-4" />
                      Skip
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
