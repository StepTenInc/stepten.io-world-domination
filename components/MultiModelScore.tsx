'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

interface ModelScore {
  model: string;
  provider: string;
  weighted_score: number;
  rating: string;
  breakdown?: Record<string, { score: number; feedback: string }>;
  top_strengths?: string[];
  top_weaknesses?: string[];
}

interface MultiModelScoreProps {
  taleSlug: string;
  className?: string;
}

const MODEL_COLORS: Record<string, string> = {
  'gemini-2.5-flash': 'from-blue-500 to-cyan-400',
  'claude-sonnet-4': 'from-orange-500 to-amber-400',
  'gpt-4o': 'from-green-500 to-emerald-400',
  'grok-3': 'from-purple-500 to-pink-400',
};

const MODEL_ICONS: Record<string, string> = {
  'gemini-2.5-flash': '🔮',
  'claude-sonnet-4': '🧠',
  'gpt-4o': '🤖',
  'grok-3': '⚡',
};

const MODEL_NAMES: Record<string, string> = {
  'gemini-2.5-flash': 'Gemini',
  'claude-sonnet-4': 'Claude',
  'gpt-4o': 'GPT-4',
  'grok-3': 'Grok',
};

export function MultiModelScore({ taleSlug, className = '' }: MultiModelScoreProps) {
  const [scores, setScores] = useState<ModelScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    async function fetchScores() {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data, error } = await supabase
          .from('tale_scores')
          .select(`
            model,
            provider,
            weighted_score,
            rating,
            breakdown,
            top_strengths,
            top_weaknesses
          `)
          .eq('tale_id', (
            await supabase
              .from('tales')
              .select('id')
              .eq('slug', taleSlug)
              .single()
          ).data?.id);

        if (error) throw error;
        setScores(data || []);
      } catch (err) {
        console.error('Failed to fetch scores:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchScores();
  }, [taleSlug]);

  if (loading) {
    return (
      <div className={`animate-pulse bg-white/5 rounded-xl p-6 ${className}`}>
        <div className="h-8 bg-white/10 rounded w-48 mb-4" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-white/10 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (scores.length === 0) {
    return null;
  }

  const avgScore = scores.reduce((sum, s) => sum + Number(s.weighted_score), 0) / scores.length;
  const sortedScores = [...scores].sort((a, b) => Number(b.weighted_score) - Number(a.weighted_score));

  return (
    <div className={`bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
            <span className="text-xl">📊</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">StepTen Score</h3>
            <p className="text-sm text-white/60">Rated by 4 AI Models</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            {avgScore.toFixed(1)}
          </div>
          <div className="text-sm text-white/60">Combined</div>
        </div>
      </div>

      {/* Model Scores Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {sortedScores.map((score) => (
          <div
            key={score.model}
            className="relative overflow-hidden rounded-xl bg-white/5 p-4 hover:bg-white/10 transition-colors cursor-pointer"
            onClick={() => setExpanded(!expanded)}
          >
            {/* Score bar background */}
            <div
              className={`absolute inset-0 bg-gradient-to-r ${MODEL_COLORS[score.model]} opacity-10`}
              style={{ width: `${score.weighted_score}%` }}
            />
            
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{MODEL_ICONS[score.model]}</span>
                <span className="text-sm font-medium text-white/80">
                  {MODEL_NAMES[score.model]}
                </span>
              </div>
              <div className={`text-2xl font-bold bg-gradient-to-r ${MODEL_COLORS[score.model]} bg-clip-text text-transparent`}>
                {Number(score.weighted_score).toFixed(1)}
              </div>
              <div className="text-xs text-white/50 mt-1">{score.rating}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="mt-6 pt-6 border-t border-white/10 space-y-6">
          {sortedScores.map((score) => (
            <div key={score.model} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{MODEL_ICONS[score.model]}</span>
                <span className="font-medium text-white">{MODEL_NAMES[score.model]}&apos;s Analysis</span>
              </div>
              
              {score.breakdown && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Object.entries(score.breakdown).map(([key, val]) => (
                    <div key={key} className="bg-white/5 rounded-lg p-2">
                      <div className="text-xs text-white/50 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div className="text-sm font-medium text-white">{val.score}</div>
                    </div>
                  ))}
                </div>
              )}
              
              {score.top_strengths && score.top_strengths.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {score.top_strengths.slice(0, 3).map((s, i) => (
                    <span key={i} className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                      ✓ {s}
                    </span>
                  ))}
                </div>
              )}
              
              {score.top_weaknesses && score.top_weaknesses.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {score.top_weaknesses.slice(0, 3).map((w, i) => (
                    <span key={i} className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">
                      ✗ {w}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Toggle hint */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full mt-4 text-center text-sm text-white/40 hover:text-white/60 transition-colors"
      >
        {expanded ? '▲ Hide details' : '▼ Show breakdown'}
      </button>
    </div>
  );
}

// Compact version for cards/lists
export function MultiModelScoreCompact({ taleSlug, className = '' }: MultiModelScoreProps) {
  const [avgScore, setAvgScore] = useState<number | null>(null);
  const [modelCount, setModelCount] = useState(0);

  useEffect(() => {
    async function fetchScore() {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data: tale } = await supabase
          .from('tales')
          .select('stepten_score, score_breakdown')
          .eq('slug', taleSlug)
          .single();

        if (tale?.stepten_score) {
          setAvgScore(Number(tale.stepten_score));
          setModelCount(tale.score_breakdown?.models || 4);
        }
      } catch (err) {
        console.error('Failed to fetch score:', err);
      }
    }

    fetchScore();
  }, [taleSlug]);

  if (avgScore === null) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-400 to-emerald-400';
    if (score >= 70) return 'from-cyan-400 to-blue-400';
    if (score >= 60) return 'from-yellow-400 to-orange-400';
    return 'from-red-400 to-pink-400';
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`text-lg font-bold bg-gradient-to-r ${getScoreColor(avgScore)} bg-clip-text text-transparent`}>
        {avgScore.toFixed(1)}
      </div>
      <div className="text-xs text-white/40">
        ({modelCount} AI)
      </div>
    </div>
  );
}
// Env vars updated Wed Feb 18 18:53:50 AEST 2026
