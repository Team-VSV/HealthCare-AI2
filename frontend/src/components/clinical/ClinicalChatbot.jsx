import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, Send, AlertTriangle, Bot, User, ShieldAlert, Zap } from 'lucide-react';

const API_URL = 'http://localhost:8000/api/chat/clinical';

const QUICK_QUESTIONS = [
  'What are the symptoms of diabetes?',
  'How is hypertension treated?',
  'What causes pneumonia?',
  'What are anxiety symptoms?',
  'How to manage high cholesterol?',
  'What is heart failure?',
];

function ChatMessage({ msg }) {
  const isBot = msg.role === 'assistant';
  const isEmergency = msg.type === 'emergency';

  if (isEmergency) {
    return (
      <div style={{
        margin: '12px 0',
        padding: '16px 20px',
        background: 'rgba(239,68,68,0.1)',
        border: '2px solid rgba(239,68,68,0.4)',
        borderRadius: 'var(--radius-md)',
        animation: 'fadeSlideUp 0.3s ease-out',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <ShieldAlert size={20} color="#ef4444" />
          <span style={{ fontWeight: 700, color: '#ef4444', fontSize: '15px' }}>Emergency Response</span>
        </div>
        <p style={{ fontSize: '14px', color: 'var(--text-primary)', marginBottom: '12px' }}>{msg.content}</p>
        {msg.emergency_actions && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {msg.emergency_actions.map((action, i) => (
              <div key={i} style={{
                padding: '8px 12px', background: 'rgba(239,68,68,0.08)',
                borderRadius: 'var(--radius-sm)', fontSize: '13px',
                color: '#ef4444', fontWeight: 600,
              }}>
                {action}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: '10px',
      margin: '12px 0', flexDirection: isBot ? 'row' : 'row-reverse',
      animation: 'fadeSlideUp 0.3s ease-out',
    }}>
      {/* Avatar */}
      <div style={{
        width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: isBot ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'linear-gradient(135deg, #0ea5e9, #0284c7)',
        color: 'white',
      }}>
        {isBot ? <Bot size={16} /> : <User size={16} />}
      </div>

      {/* Bubble */}
      <div style={{
        maxWidth: '75%',
        padding: '12px 16px',
        borderRadius: isBot ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
        background: isBot ? 'var(--bg-card-hover)' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
        border: isBot ? '1px solid var(--border-default)' : 'none',
        color: isBot ? 'var(--text-primary)' : 'white',
        fontSize: '14px', lineHeight: 1.6,
      }}>
        {/* Format markdown-like bold */}
        {msg.content.split('\n\n').map((para, i) => (
          <p key={i} style={{ margin: i > 0 ? '8px 0 0' : 0 }}>
            {para.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
              part.startsWith('**') ? <strong key={j}>{part.slice(2, -2)}</strong> : part
            )}
          </p>
        ))}
        {msg.confidence && (
          <div style={{ marginTop: '8px', fontSize: '11px', opacity: 0.7, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Zap size={10} /> Knowledge match: {msg.confidence}%
          </div>
        )}
        {msg.sources && msg.sources.length > 0 && (
          <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {msg.sources.map((src, i) => (
              <span key={i} style={{
                fontSize: '10px', padding: '2px 8px',
                background: 'rgba(99,102,241,0.15)', borderRadius: '10px',
                color: '#a78bfa', fontWeight: 600,
              }}>{src}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ClinicalChatbot() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your clinical knowledge assistant. I can answer questions about symptoms, conditions, treatments, and general health topics based on evidence-based medical knowledge. How can I help you today?',
      type: 'greeting',
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (messageText) => {
    const text = (messageText || input).trim();
    if (!text) return;

    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post(API_URL, { message: text, conversation_history: [] });
      const data = res.data;

      if (data.error) throw new Error(data.error);

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response,
        type: data.type,
        sources: data.sources,
        confidence: data.confidence,
        emergency_actions: data.emergency_actions,
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I encountered an error processing your request. Please check that the backend server is running.',
        type: 'error',
      }]);
    }
    setLoading(false);
  };

  return (
    <div className="module-container" style={{ display: 'flex', flexDirection: 'column', height: '700px' }}>
      {/* Header */}
      <div className="module-header" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #818cf8 100%)', flexShrink: 0 }}>
        <div className="module-header-icon"><MessageSquare size={28} /></div>
        <div>
          <h2 className="module-header-title">Clinical Knowledge Chatbot</h2>
          <p className="module-header-subtitle">Ask about symptoms, conditions, and treatments — AI-powered medical Q&A</p>
        </div>
      </div>

      {/* Quick Questions */}
      <div style={{ padding: '12px 24px', borderBottom: '1px solid var(--border-default)', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {QUICK_QUESTIONS.map((q, i) => (
            <button key={i} onClick={() => sendMessage(q)} className="chip-button" style={{ fontSize: '11px' }}>
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
        {messages.map((msg, i) => (
          <ChatMessage key={i} msg={msg} />
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', margin: '12px 0' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
            }}>
              <Bot size={16} />
            </div>
            <div style={{
              padding: '12px 16px', background: 'var(--bg-card-hover)',
              border: '1px solid var(--border-default)', borderRadius: '4px 16px 16px 16px',
            }}>
              <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: '#6366f1',
                    animation: `pulse-glow 1.4s ease-in-out ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Disclaimer */}
      <div style={{
        padding: '8px 24px', borderTop: '1px solid var(--border-default)',
        fontSize: '11px', color: 'var(--text-muted)', flexShrink: 0,
        display: 'flex', gap: '6px', alignItems: 'center',
      }}>
        <AlertTriangle size={12} color="#f59e0b" />
        For educational use only. Not a substitute for professional medical advice.
      </div>

      {/* Input */}
      <div style={{ padding: '12px 24px 20px', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            className="form-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Ask about symptoms, treatments, medications..."
            disabled={loading}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="btn-primary"
            style={{ padding: '10px 18px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
