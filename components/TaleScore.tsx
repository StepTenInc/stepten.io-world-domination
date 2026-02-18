'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

interface TaleScoreProps {
  taleSlug: string;
  className?: string;
}

interface ScoreData {
  contentScore: number | null;
  performanceScore: number | null;
  models: number;
  validated: boolean;
}

export function TaleScore({ taleSlug, className = '' }: TaleScoreProps) {
  const [data, setData] = useState<ScoreData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchScores() {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!supabaseUrl || !supabaseKey) return;

        const supabase = createClient(supabaseUrl, supabaseKey);

        // Get tale with scores
        const { data: tale } = await supabase
          .from('tales')
          .select('id, content_score, performance_score, stepten_score')
          .eq('slug', taleSlug)
          .single();

        if (!tale) return;

        // Get model count from tale_scores
        const { count } = await supabase
          .from('tale_scores')
          .select('*', { count: 'exact', head: true })
          .eq('tale_id', tale.id);

        setData({
          contentScore: tale.content_score || tale.stepten_score,
          performanceScore: tale.performance_score,
          models: count || 0,
          validated: !!tale.performance_score && tale.performance_score > 0
        });
      } catch (err) {
        console.error('Failed to fetch scores:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchScores();
  }, [taleSlug]);

  if (loading || !data) return null;

  const getColor = (score: number | null) => {
    if (!score) return 'text-white/40';
    if (score >= 80) return 'text-green-400';
    if (score >= 70) return 'text-cyan-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Score 1: Content */}
      <div className="flex items-center gap-2">
        <div className="text-xs text-white/50 uppercase tracking-wider">Content</div>
        <div className={`text-lg font-bold ${getColor(data.contentScore)}`}>
          {data.contentScore?.toFixed(1) || '—'}
        </div>
        {data.models > 0 && (
          <div className="text-xs text-white/30">({data.models} AI)</div>
        )}
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-white/20" />

      {/* Score 2: Performance */}
      <div className="flex items-center gap-2">
        <div className="text-xs text-white/50 uppercase tracking-wider">Performance</div>
        {data.performanceScore ? (
          <>
            <div className={`text-lg font-bold ${getColor(data.performanceScore)}`}>
              {data.performanceScore.toFixed(1)}
            </div>
            {data.validated && (
              <div className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">
                ✓ Validated
              </div>
            )}
          </>
        ) : (
          <div className="text-sm text-white/30 italic">Collecting data...</div>
        )}
      </div>
    </div>
  );
}

// Badge version for cards
export function TaleScoreBadge({ taleSlug, className = '' }: TaleScoreProps) {
  const [score, setScore] = useState<number | null>(null);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    async function fetch() {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!supabaseUrl || !supabaseKey) return;

      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data } = await supabase
        .from('tales')
        .select('stepten_score, performance_score')
        .eq('slug', taleSlug)
        .single();

      if (data) {
        setScore(data.stepten_score);
        setValidated(!!data.performance_score);
      }
    }
    fetch();
  }, [taleSlug]);

  if (!score) return null;

  const bg = score >= 80 ? 'bg-green-500/20' : score >= 70 ? 'bg-cyan-500/20' : score >= 60 ? 'bg-yellow-500/20' : 'bg-red-500/20';
  const text = score >= 80 ? 'text-green-400' : score >= 70 ? 'text-cyan-400' : score >= 60 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className={`inline-flex items-center gap-1 ${bg} ${text} px-2 py-0.5 rounded text-sm font-medium ${className}`}>
      {score.toFixed(0)}
      {validated && <span className="text-xs">✓</span>}
    </div>
  );
}
