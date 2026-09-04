'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { openInspector } from '@/store/slices/uiSlice';
import { mockAIService } from '@/services/mockServices';
import type { AIMessage } from '@/types';
import {
  Bot, User, Sparkles, Send, Shield, FolderOpen,
  Package, CheckCircle2, ChevronRight, HelpCircle
} from 'lucide-react';
import { toast } from 'sonner';

export default function KRITAGASAIPage() {
  const dispatch = useAppDispatch();
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'msg-0',
      role: 'assistant',
      content:
        'Welcome to **KRITAGAS AI** — Criminal Network Intelligence Assistant.\n\nI have indexed all 128 cases, 100 persons of interest, 150 evidence records, and multi-relational network paths. You can ask me to explain connections, search historical MOs, query FIRs, or synthesize investigative leads.\n\nSelect any suggested inquiry below or enter your own query.',
      timestamp: new Date().toISOString(),
      confidence: 98,
      sources: [{ id: 'CASE-102', type: 'Case', title: 'XYZ Network Investigation' }],
    },
  ]);

  const suggestedQuestions = mockAIService.getSuggestedQuestions();

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || loading) return;

    const userMsg: AIMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const aiReply = await mockAIService.ask(query);
      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      toast.error('Error generating AI analysis');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div className="space-y-4 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] font-bold tracking-tight" style={{ color: 'var(--ink-primary)' }}>
              KRITAGAS AI
            </h1>
            <span
              className="text-[11px] font-mono-id px-2 py-0.5 rounded-full font-medium"
              style={{ background: 'var(--accent-muted)', color: 'var(--accent)' }}
            >
              Intelligence Synthesis Model
            </span>
          </div>
          <p className="text-[13px] text-[var(--ink-secondary)]">
            Investigative reasoning assistant grounded strictly in verified case facts, evidence ledgers, and network graphs
          </p>
        </div>
      </div>

      {/* Suggested Questions Carousel / Wrap */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {suggestedQuestions.map((q) => (
          <button
            key={q}
            onClick={() => handleSend(q)}
            className="px-3 py-1.5 rounded-lg border text-[12px] hover:bg-[var(--surface-2)] transition-colors text-left font-medium"
            style={{ borderColor: 'var(--border)', color: 'var(--ink-secondary)' }}
          >
            &quot;{q}&quot;
          </button>
        ))}
      </div>

      {/* Chat Viewport Card */}
      <div
        className="rounded-xl border flex flex-col h-[580px] overflow-hidden"
        style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
      >
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            const isAI = msg.role === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isAI ? '' : 'flex-row-reverse'}`}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-bold text-white text-[12px]"
                  style={{
                    background: isAI ? 'var(--accent)' : 'var(--ink-secondary)',
                  }}
                >
                  {isAI ? <Bot size={16} /> : <User size={16} />}
                </div>

                <div
                  className={`p-4 rounded-xl max-w-[85%] text-[13px] leading-relaxed border space-y-3 ${
                    isAI ? 'bg-[var(--surface-2)]' : 'bg-[var(--accent-muted)]'
                  }`}
                  style={{
                    borderColor: isAI ? 'var(--border)' : 'var(--accent-subtle)',
                    color: 'var(--ink-primary)',
                  }}
                >
                  {/* Message body with Markdown style */}
                  <div className="whitespace-pre-wrap">{msg.content}</div>

                  {/* Grounded Sources & Entities (Section 35) */}
                  {isAI && (msg.sources?.length || msg.entities?.length || msg.confidence) ? (
                    <div className="pt-2 border-t space-y-2 text-[11px]" style={{ borderColor: 'var(--border)' }}>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-semibold text-[var(--ink-tertiary)] uppercase">Sources:</span>
                          {msg.sources?.map((s) => (
                            <button
                              key={s.id}
                              onClick={() => dispatch(openInspector({ id: s.id, type: s.type }))}
                              className="font-mono-id px-1.5 py-0.2 rounded bg-[var(--surface-1)] text-[var(--accent)] font-semibold hover:underline"
                            >
                              {s.id}
                            </button>
                          ))}
                        </div>

                        {msg.confidence && (
                          <div className="font-mono-id font-bold text-[var(--success)]">
                            Confidence: {msg.confidence}%
                          </div>
                        )}
                      </div>

                      {/* Linked entities pills */}
                      {msg.entities && msg.entities.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1">
                          <span className="font-semibold text-[var(--ink-tertiary)] uppercase">Referenced:</span>
                          {msg.entities.map((ent) => (
                            <button
                              key={ent.id}
                              onClick={() => dispatch(openInspector({ id: ent.id, type: ent.type }))}
                              className="px-1.5 py-0.2 rounded text-[10px] bg-[var(--surface-1)] border font-mono-id text-[var(--ink-primary)] hover:border-[var(--accent)]"
                              style={{ borderColor: 'var(--border)' }}
                            >
                              {ent.name} ({ent.id})
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-[12px]"
                style={{ background: 'var(--accent)' }}
              >
                <Bot size={16} />
              </div>
              <div
                className="p-3.5 rounded-xl border bg-[var(--surface-2)] text-[13px] flex items-center gap-2"
                style={{ borderColor: 'var(--border)' }}
              >
                <Sparkles size={14} className="animate-spin text-[var(--accent)]" />
                <span className="text-[var(--ink-secondary)]">Synthesizing multi-agency records and network paths...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t flex items-center gap-2" style={{ borderColor: 'var(--border)', background: 'var(--surface-0)' }}>
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask KRITAGAS AI a question or query investigation evidence..."
            className="flex-1 h-10 px-3.5 rounded-lg border bg-[var(--surface-1)] text-[13px] text-[var(--ink-primary)] outline-none focus:border-[var(--accent)]"
            style={{ borderColor: 'var(--border)' }}
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputQuery.trim() || loading}
            className="h-10 px-4 rounded-lg font-medium text-white shadow-sm flex items-center gap-1.5 transition-all hover:opacity-90 disabled:opacity-40"
            style={{ background: 'var(--accent)' }}
          >
            <Send size={14} />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
