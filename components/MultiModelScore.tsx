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

const MODEL_LOGOS: Record<string, string> = {
  'gemini-2.5-flash': '/images/models/gemini.png',
  'claude-sonnet-4': '/images/models/anthropic.png',
  'gpt-4o': '/images/models/openai.png',
  'grok-3': '/images/models/xai.png',
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
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchScores() {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseKey) {
          setError('Missing Supabase config');
          setLoading(false);
          return;
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data: taleData, error: taleError } = await supabase
          .from('tales')
          .select('id')
          .eq('slug', taleSlug)
          .single();

        if (taleError || !taleData) {
          setError('Tale not found');
          setLoading(false);
          return;
        }

        const { data, error: scoresError } = await supabase
          .from('tale_scores')
          .select('model, provider, weighted_score, rating, breakdown, top_strengths, top_weaknesses')
          .eq('tale_id', taleData.id);

        if (scoresError) {
          setError(scoresError.message);
          setLoading(false);
          return;
        }

        setScores(data || []);
      } catch (err) {
        console.error('Failed to fetch scores:', err);
        setError('Failed to load scores');
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

  if (error || scores.length === 0) {
    return null;
  }

  const avgScore = scores.reduce((sum, s) => sum + Number(s.weighted_score), 0) / scores.length;
  const sortedScores = [...scores].sort((a, b) => Number(b.weighted_score) - Number(a.weighted_score));
  const selectedScore = selectedModel ? scores.find(s => s.model === selectedModel) : null;

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
            <p className="text-sm text-white/60">Rated by {scores.length} AI Models</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            {avgScore.toFixed(1)}
          </div>
          <div className="text-sm text-white/60">Combined</div>
        </div>
      </div>

      {/* Model Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {sortedScores.map((score) => {
          const isSelected = selectedModel === score.model;
          return (
            <button
              key={score.model}
              onClick={() => setSelectedModel(isSelected ? null : score.model)}
              className={`relative overflow-hidden rounded-xl p-4 text-left transition-all ${
                isSelected 
                  ? 'bg-white/15 ring-2 ring-white/30' 
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              {/* Score bar background */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${MODEL_COLORS[score.model] || 'from-gray-500 to-gray-400'} opacity-10`}
                style={{ width: `${score.weighted_score}%` }}
              />
              
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <img 
                    src={MODEL_LOGOS[score.model]} 
                    alt={MODEL_NAMES[score.model] || score.model}
                    className="w-5 h-5 object-contain"
                  />
                  <span className="text-sm font-medium text-white/80">
                    {MODEL_NAMES[score.model] || score.model}
                  </span>
                </div>
                <div className={`text-2xl font-bold bg-gradient-to-r ${MODEL_COLORS[score.model] || 'from-gray-400 to-gray-300'} bg-clip-text text-transparent`}>
                  {Number(score.weighted_score).toFixed(1)}
                </div>
                <div className="text-xs text-white/50 mt-1">{score.rating}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Model Details */}
      {selectedScore && (
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <img 
              src={MODEL_LOGOS[selectedScore.model]} 
              alt={MODEL_NAMES[selectedScore.model] || selectedScore.model}
              className="w-6 h-6 object-contain"
            />
            <span className="font-bold text-white text-lg">
              {MODEL_NAMES[selectedScore.model] || selectedScore.model}&apos;s Analysis
            </span>
          </div>
          
          {/* Breakdown Grid */}
          {selectedScore.breakdown && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {Object.entries(selectedScore.breakdown).map(([key, val]) => (
                <div key={key} className="bg-white/5 rounded-lg p-3">
                  <div className="text-xs text-white/50 capitalize mb-1">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className="text-xl font-bold text-white">{val.score}</div>
                  {val.feedback && (
                    <div className="text-xs text-white/40 mt-1 line-clamp-2">{val.feedback}</div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* Strengths */}
          {selectedScore.top_strengths && selectedScore.top_strengths.length > 0 && (
            <div className="mb-3">
              <div className="text-xs text-white/50 uppercase tracking-wider mb-2">Strengths</div>
              <div className="flex flex-wrap gap-2">
                {selectedScore.top_strengths.map((s, i) => (
                  <span key={i} className="text-sm bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Weaknesses */}
          {selectedScore.top_weaknesses && selectedScore.top_weaknesses.length > 0 && (
            <div>
              <div className="text-xs text-white/50 uppercase tracking-wider mb-2">Areas to Improve</div>
              <div className="flex flex-wrap gap-2">
                {selectedScore.top_weaknesses.map((w, i) => (
                  <span key={i} className="text-sm bg-red-500/20 text-red-400 px-3 py-1 rounded-full">
                    ✗ {w}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hint */}
      {!selectedModel && (
        <div className="text-center text-sm text-white/30 mt-2">
          Click a model to see its analysis
        </div>
      )}
    </div>
  );
}
