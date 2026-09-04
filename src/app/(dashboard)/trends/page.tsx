'use client';

import React, { useState } from 'react';
import { crimeTrendData } from '@/mock';
import {
  TrendingUp, TrendingDown, BarChart2, PieChart as PieIcon,
  Calendar, Layers, Filter, Shield
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';

const growthMetrics = [
  { crime: 'Robbery', change: '+18%', direction: 'up', color: '#DC2626' },
  { crime: 'Fraud / Cheating', change: '+11%', direction: 'up', color: '#D97706' },
  { crime: 'Cybercrime', change: '+26%', direction: 'up', color: '#7C3AED' },
  { crime: 'Vehicle Theft', change: '-4%', direction: 'down', color: '#16A34A' },
  { crime: 'Extortion', change: '+2%', direction: 'up', color: '#B45309' },
];

const categoryDistribution = [
  { name: 'Fraud / PMLA', value: 38, color: '#5B5BD6' },
  { name: 'Robbery', value: 24, color: '#F59E0B' },
  { name: 'Cybercrime', value: 18, color: '#10B981' },
  { name: 'Vehicle Theft', value: 12, color: '#EC4899' },
  { name: 'Others', value: 8, color: '#6B7280' },
];

const peakHoursData = [
  { hour: '00-04', incidents: 14 },
  { hour: '04-08', incidents: 8 },
  { hour: '08-12', incidents: 38 },
  { hour: '12-16', incidents: 42 },
  { hour: '16-20', incidents: 68 }, // Peak
  { hour: '20-24', incidents: 54 },
];

const cityGrowthData = [
  { city: 'Mumbai', count: 142 },
  { city: 'Delhi', count: 168 },
  { city: 'Pune', count: 74 },
  { city: 'Bengaluru', count: 86 },
  { city: 'Hyderabad', count: 62 },
  { city: 'Kolkata', count: 58 },
];

export default function CrimeTrendsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] font-bold tracking-tight" style={{ color: 'var(--ink-primary)' }}>
              Crime Trends &amp; Comparative Analytics
            </h1>
            <span
              className="text-[11px] font-mono-id px-2 py-0.5 rounded-full font-medium"
              style={{ background: 'var(--accent-muted)', color: 'var(--accent)' }}
            >
              Multi-Year Longitudinal
            </span>
          </div>
          <p className="text-[13px] text-[var(--ink-secondary)]">
            Aggregated statistical trajectories, peak temporal windows, category distribution, and territorial velocity
          </p>
        </div>
      </div>

      {/* Top Growth Metric Cards (Section 30: Robbery +18%, Fraud +11%, Vehicle Theft -4%) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {growthMetrics.map((m) => (
          <div
            key={m.crime}
            className="p-3.5 rounded-xl border flex flex-col justify-between"
            style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
          >
            <span className="text-[12px] font-medium text-[var(--ink-secondary)] truncate">
              {m.crime}
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-[22px] font-bold font-mono-id" style={{ color: m.color }}>
                {m.change}
              </span>
              <span className="text-[11px] text-[var(--ink-tertiary)]">MoM Growth</span>
            </div>
          </div>
        ))}
      </div>

      {/* 2-Column Main Charts: Monthly Trend Area & Category Distribution Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Trend Area Chart (8 cols) */}
        <div
          className="lg:col-span-8 p-5 rounded-xl border flex flex-col justify-between"
          style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
        >
          <div className="mb-3">
            <h3 className="text-[15px] font-semibold" style={{ color: 'var(--ink-primary)' }}>
              Crime Trajectory by Month (Jan – Aug 2026)
            </h3>
            <p className="text-[12px]" style={{ color: 'var(--ink-secondary)' }}>
              Comparative monthly incident velocity across major investigative classifications
            </p>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={crimeTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--ink-tertiary)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--ink-tertiary)' }} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--surface-1)',
                    border: '1px solid var(--border-strong)',
                    fontSize: '12px',
                    borderRadius: '6px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="fraud" stroke="#5B5BD6" strokeWidth={2.5} name="Fraud" />
                <Line type="monotone" dataKey="robbery" stroke="#F59E0B" strokeWidth={2.5} name="Robbery" />
                <Line type="monotone" dataKey="cybercrime" stroke="#10B981" strokeWidth={2} name="Cybercrime" />
                <Line type="monotone" dataKey="vehicleTheft" stroke="#EC4899" strokeWidth={2} name="Vehicle Theft" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share Donut / Pie (4 cols) */}
        <div
          className="lg:col-span-4 p-5 rounded-xl border flex flex-col justify-between"
          style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
        >
          <div className="mb-3">
            <h3 className="text-[15px] font-semibold" style={{ color: 'var(--ink-primary)' }}>
              Crime Category Distribution
            </h3>
            <p className="text-[12px]" style={{ color: 'var(--ink-secondary)' }}>
              Relative proportional share of caseload
            </p>
          </div>

          <div className="h-[220px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'var(--surface-1)',
                    border: '1px solid var(--border-strong)',
                    fontSize: '12px',
                    borderRadius: '6px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1 pt-2 border-t text-[11px]" style={{ borderColor: 'var(--border)' }}>
            {categoryDistribution.map((c) => (
              <div key={c.name} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5" style={{ color: 'var(--ink-secondary)' }}>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                  {c.name}
                </span>
                <span className="font-mono-id font-semibold" style={{ color: 'var(--ink-primary)' }}>
                  {c.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom 2 Charts: Peak Temporal Hours & Jurisdictional Incident Volume */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peak Hours Histogram */}
        <div
          className="p-5 rounded-xl border"
          style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
        >
          <div className="mb-3">
            <h3 className="text-[15px] font-semibold" style={{ color: 'var(--ink-primary)' }}>
              Peak Incident Hours Window
            </h3>
            <p className="text-[12px]" style={{ color: 'var(--ink-secondary)' }}>
              24-hour diurnal distribution (highest frequency between 16:00 – 20:00)
            </p>
          </div>

          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peakHoursData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="hour" tick={{ fontSize: 11, fill: 'var(--ink-tertiary)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--ink-tertiary)' }} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--surface-1)',
                    border: '1px solid var(--border-strong)',
                    fontSize: '12px',
                    borderRadius: '6px',
                  }}
                />
                <Bar dataKey="incidents" fill="#5B5BD6" radius={[4, 4, 0, 0]} name="Logged Incidents" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Jurisdictional Distribution */}
        <div
          className="p-5 rounded-xl border"
          style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
        >
          <div className="mb-3">
            <h3 className="text-[15px] font-semibold" style={{ color: 'var(--ink-primary)' }}>
              Caseload by Metropolitan Jurisdiction
            </h3>
            <p className="text-[12px]" style={{ color: 'var(--ink-secondary)' }}>
              Total recorded active incidents by metropolitan police commissionerate
            </p>
          </div>

          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cityGrowthData} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--ink-tertiary)' }} />
                <YAxis dataKey="city" type="category" tick={{ fontSize: 11, fill: 'var(--ink-secondary)' }} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--surface-1)',
                    border: '1px solid var(--border-strong)',
                    fontSize: '12px',
                    borderRadius: '6px',
                  }}
                />
                <Bar dataKey="count" fill="#3B82F6" radius={[0, 4, 4, 0]} name="Active Cases" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
