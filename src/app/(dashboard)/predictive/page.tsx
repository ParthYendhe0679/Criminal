'use client';

import React from 'react';
import { predictiveData } from '@/mock';
import {
  BrainCircuit, TrendingUp, TrendingDown, Minus,
  Shield, AlertTriangle, MapPin, Clock, ArrowRight, ShieldAlert
} from 'lucide-react';
import { toast } from 'sonner';

export default function PredictiveIntelligencePage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] font-bold tracking-tight" style={{ color: 'var(--ink-primary)' }}>
              Predictive Pattern Modeling &amp; Risk Forecasting
            </h1>
            <span
              className="text-[11px] font-mono-id px-2 py-0.5 rounded-full font-medium"
              style={{ background: 'var(--accent-muted)', color: 'var(--accent)' }}
            >
              Neural Spatial-Temporal Model
            </span>
          </div>
          <p className="text-[13px] text-[var(--ink-secondary)]">
            Aggregated geospatial crime forecasts, peak temporal windows, and resource allocation recommendations
          </p>
        </div>
      </div>

      {/* Safety / Compliance Notice (Section 28 & 56) */}
      <div
        className="p-3.5 rounded-xl border flex items-center justify-between text-[12px]"
        style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center gap-2.5">
          <Shield size={16} className="text-[var(--accent)] shrink-0" />
          <span style={{ color: 'var(--ink-primary)' }}>
            <strong>Ethical AI Guardrail:</strong> KRITAGAS forecasts spatial crime trends and temporal probabilities. It does NOT predict individual criminality or personal culpability.
          </span>
        </div>
        <span className="text-[11px] font-mono-id px-2 py-0.5 rounded bg-[var(--surface-1)] border" style={{ borderColor: 'var(--border)' }}>
          Audit Level A1
        </span>
      </div>

      {/* Predictive Forecast Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {predictiveData.map((pred, i) => {
          const isIncreasing = pred.trend === 'Increasing';
          const isDecreasing = pred.trend === 'Decreasing';

          return (
            <div
              key={i}
              className="p-5 rounded-xl border flex flex-col justify-between hover:border-[var(--accent)] transition-all"
              style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[12px] font-mono-id" style={{ color: 'var(--ink-secondary)' }}>
                    <MapPin size={13} className="text-[var(--accent)]" />
                    <span>{pred.city}</span>
                  </div>
                  <span
                    className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded"
                    style={{
                      background: isIncreasing ? 'var(--error-muted)' : isDecreasing ? 'var(--success-muted)' : 'var(--warning-muted)',
                      color: isIncreasing ? '#DC2626' : isDecreasing ? '#16A34A' : '#D97706',
                    }}
                  >
                    {isIncreasing ? <TrendingUp size={12} /> : isDecreasing ? <TrendingDown size={12} /> : <Minus size={12} />}
                    <span>{pred.trend}</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-[17px] font-bold" style={{ color: 'var(--ink-primary)' }}>
                    {pred.area}
                  </h3>
                  <div className="text-[13px] font-medium text-[var(--accent)] mt-0.5">
                    {pred.crimeType}
                  </div>
                </div>

                {/* Probability and forecast badge */}
                <div className="p-3 rounded-lg border space-y-1.5 text-[12px]" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--ink-secondary)' }}>Forecast Status:</span>
                    <span className="font-semibold text-[var(--ink-primary)]">{pred.forecast}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--ink-secondary)' }}>Event Probability:</span>
                    <span className="font-mono-id font-bold text-[var(--error)]">{(pred.probability * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--ink-secondary)' }}>Peak Window:</span>
                    <span className="font-mono-id font-semibold text-[var(--ink-primary)]">{pred.peakPeriod}</span>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="text-[12px] leading-relaxed" style={{ color: 'var(--ink-secondary)' }}>
                  <span className="font-semibold text-[var(--ink-primary)] block mb-0.5">Tactical Recommendation:</span>
                  {pred.recommendation}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                <span className="text-[11px] font-mono-id" style={{ color: 'var(--ink-tertiary)' }}>
                  Confidence: {Math.floor(pred.probability * 100)}%
                </span>
                <button
                  onClick={() => toast.success(`Patrol recommendation for ${pred.area} dispatched to precinct`)}
                  className="text-[11px] font-semibold text-[var(--accent)] hover:underline"
                >
                  Deploy Patrol →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
