'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';

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

const MODEL_CONFIG: Record<string, {
  name: string;
  icon: string;
  iconType: 'png' | 'svg';
  gradient: string;
  glow: string;
  bgGlow: string;
}> = {
  'gemini-2.5-flash': {
    name: 'Gemini',
    icon: '/images/models/gemini.png',
    iconType: 'png',
    gradient: 'from-blue-500 via-cyan-400 to-green-400',
    glow: 'shadow-cyan-500/50',
    bgGlow: 'bg-gradient-to-r from-blue-500/20 via-cyan-400/20 to-green-400/20',
  },
  'claude-sonnet-4': {
    name: 'Claude',
    icon: '/images/models/anthropic.svg',
    iconType: 'svg',
    gradient: 'from-orange-500 via-amber-400 to-yellow-400',
    glow: 'shadow-orange-500/50',
    bgGlow: 'bg-gradient-to-r from-orange-500/20 via-amber-400/20 to-yellow-400/20',
  },
  'gpt-4o': {
    name: 'GPT-4',
    icon: '/images/models/openai.png',
    iconType: 'png',
    gradient: 'from-emerald-500 via-green-400 to-teal-400',
    glow: 'shadow-emerald-500/50',
    bgGlow: 'bg-gradient-to-r from-emerald-500/20 via-green-400/20 to-teal-400/20',
  },
  'grok-3': {
    name: 'Grok',
    icon: '/images/models/xai.svg',
    iconType: 'svg',
    gradient: 'from-purple-500 via-pink-400 to-rose-400',
    glow: 'shadow-purple-500/50',
    bgGlow: 'bg-gradient-to-r from-purple-500/20 via-pink-400/20 to-rose-400/20',
  },
};

function ModelIcon({ model, className = '', animate = false }: { model: string; className?: string; animate?: boolean }) {
  const config = MODEL_CONFIG[model];
  if (!config) return null;
  
  const animationClass = animate ? 'animate-pulse' : '';
  
  return (
    <div className={`relative ${animationClass} ${className}`}>
      {/* Glow effect behind icon */}
      <div className={`absolute inset-0 blur-md opacity-60 ${config.bgGlow} rounded-full`} />
      
      {config.iconType === 'svg' ? (
        <Image 
          src={config.icon}
          alt={config.name}
          width={32}
          height={32}
          className="relative z-10 object-contain drop-shadow-lg"
        />
      ) : (
        <Image 
          src={config.icon}
          alt={config.name}
          width={32}
          height={32}
          className="relative z-10 object-contain drop-shadow-lg"
        />
      )}
    </div>
  );
}

function ScoreRing({ score, size = 80, strokeWidth = 6 }: { score: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        {/* Score ring with gradient */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-white">{score.toFixed(0)}</span>
      </div>
    </div>
  );
}

export function MultiModelScore({ taleSlug, className = '' }: MultiModelScoreProps) {
  const [scores, setScores] = useState<ModelScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [animateIn, setAnimateIn] = useState(false);

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
        // Trigger animation after data loads
        setTimeout(() => setAnimateIn(true), 100);
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
      <div className={`bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 ${className}`}>
        <div className="flex items-center justify-center gap-4">
          <div className="flex gap-2">
            {Object.keys(MODEL_CONFIG).map((model, i) => (
              <div 
                key={model} 
                className="w-10 h-10 rounded-xl bg-white/10 animate-pulse"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
          <div className="text-white/50">Loading AI scores...</div>
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
    <div className={`relative overflow-hidden bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 ${className}`}>
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5 animate-pulse" />
      <div className="absolute top-0 left-1/4 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* Animated Score Ring */}
            <ScoreRing score={avgScore} />
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="animate-pulse">📊</span> StepTen Score
              </h3>
              <p className="text-sm text-white/60">
                Consensus from {scores.length} AI Models
              </p>
            </div>
          </div>
          
          {/* Floating model icons */}
          <div className="hidden md:flex items-center gap-3">
            {sortedScores.map((score, i) => (
              <div 
                key={score.model}
                className={`transform transition-all duration-500 ${animateIn ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <ModelIcon model={score.model} className="w-8 h-8" animate={selectedModel === score.model} />
              </div>
            ))}
          </div>
        </div>

        {/* Model Score Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {sortedScores.map((score, i) => {
            const config = MODEL_CONFIG[score.model];
            const isSelected = selectedModel === score.model;
            const isTop = i === 0;
            
            return (
              <button
                key={score.model}
                onClick={() => setSelectedModel(isSelected ? null : score.model)}
                className={`relative group overflow-hidden rounded-xl p-4 text-left transition-all duration-300 transform hover:scale-[1.02] ${
                  isSelected 
                    ? `ring-2 ring-white/40 shadow-lg ${config?.glow || ''}` 
                    : 'hover:ring-1 hover:ring-white/20'
                } ${animateIn ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                style={{ 
                  transitionDelay: `${i * 100}ms`,
                  background: isSelected 
                    ? 'rgba(255,255,255,0.15)' 
                    : 'rgba(255,255,255,0.05)',
                }}
              >
                {/* Animated gradient background on hover */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${config?.bgGlow || ''}`} />
                
                {/* Score progress bar */}
                <div
                  className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${config?.gradient || 'from-gray-500 to-gray-400'} transition-all duration-1000`}
                  style={{ width: animateIn ? `${score.weighted_score}%` : '0%' }}
                />
                
                {/* Crown for top scorer */}
                {isTop && (
                  <div className="absolute -top-1 -right-1 text-lg animate-bounce">👑</div>
                )}
                
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <ModelIcon model={score.model} className="w-6 h-6" />
                    <span className="text-sm font-medium text-white/80">
                      {config?.name || score.model}
                    </span>
                  </div>
                  
                  <div className={`text-3xl font-black bg-gradient-to-r ${config?.gradient || 'from-gray-400 to-gray-300'} bg-clip-text text-transparent`}>
                    {Number(score.weighted_score).toFixed(0)}
                  </div>
                  
                  <div className={`text-xs font-semibold mt-1 px-2 py-0.5 rounded-full inline-block ${
                    score.rating === 'EXCEPTIONAL' ? 'bg-yellow-500/20 text-yellow-400' :
                    score.rating === 'EXCELLENT' ? 'bg-green-500/20 text-green-400' :
                    score.rating === 'GOOD' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-white/10 text-white/60'
                  }`}>
                    {score.rating}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Model Details */}
        {selectedScore && (
          <div className={`mt-6 pt-6 border-t border-white/10 transition-all duration-300 ${selectedScore ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex items-center gap-3 mb-4">
              <ModelIcon model={selectedScore.model} className="w-8 h-8" animate />
              <span className="font-bold text-white text-lg">
                {MODEL_CONFIG[selectedScore.model]?.name || selectedScore.model}&apos;s Analysis
              </span>
            </div>
            
            {/* Strengths */}
            {selectedScore.top_strengths && selectedScore.top_strengths.length > 0 && (
              <div className="mb-4">
                <div className="text-xs text-white/50 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="animate-pulse">💪</span> Strengths
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedScore.top_strengths.map((s, i) => (
                    <span 
                      key={i} 
                      className="text-sm bg-green-500/20 text-green-400 px-3 py-1.5 rounded-lg border border-green-500/30 hover:bg-green-500/30 transition-colors cursor-default"
                    >
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Weaknesses */}
            {selectedScore.top_weaknesses && selectedScore.top_weaknesses.length > 0 && (
              <div>
                <div className="text-xs text-white/50 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span>🎯</span> Areas to Improve
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedScore.top_weaknesses.map((w, i) => (
                    <span 
                      key={i} 
                      className="text-sm bg-amber-500/20 text-amber-400 px-3 py-1.5 rounded-lg border border-amber-500/30 hover:bg-amber-500/30 transition-colors cursor-default"
                    >
                      ◎ {w}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Hint when no model selected */}
        {!selectedModel && (
          <div className="text-center text-sm text-white/30 mt-2 animate-pulse">
            👆 Click a model to see its full analysis
          </div>
        )}
      </div>
    </div>
  );
}
