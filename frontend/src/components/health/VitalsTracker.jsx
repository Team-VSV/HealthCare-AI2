import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, AlertTriangle, Plus, TrendingUp, TrendingDown, Minus, Heart, Droplets } from 'lucide-react';

const LOG_API = 'http://localhost:8000/api/vitals/log';
const HISTORY_API = 'http://localhost:8000/api/vitals/history';

function getOrCreateSession() {
  let id = localStorage.getItem('vitals_session_id');
  if (!id) {
    id = Math.random().toString(36).substring(2, 12);
    localStorage.setItem('vitals_session_id', id);
  }
  return id;
}

const METRIC_CONFIGS = [
  { key: 'systolic_bp', label: 'Systolic BP', unit: 'mmHg', color: '#ef4444', min: 70, max: 200, step: 1 },
  { key: 'diastolic_bp', label: 'Diastolic BP', unit: 'mmHg', color: '#f97316', min: 40, max: 130, step: 1 },
  { key: 'heart_rate', label: 'Heart Rate', unit: 'bpm', color: '#ec4899', min: 30, max: 200, step: 1 },
  { key: 'blood_glucose', label: 'Blood Glucose', unit: 'mg/dL', color: '#f59e0b', min: 50, max: 500, step: 1 },
  { key: 'spo2', label: 'SpO2', unit: '%', color: '#06b6d4', min: 85, max: 100, step: 0.1 },
  { key: 'temperature_c', label: 'Temperature', unit: '°C', color: '#8b5cf6', min: 35, max: 41, step: 0.1 },
  { key: 'weight_kg', label: 'Weight', unit: 'kg', color: '#10b981', min: 20, max: 300, step: 0.1 },
];

function SparkLine({ values, color, width = 140, height = 48 }) {
  if (!values || values.length < 2) return <div style={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>No data</div>;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * (width - 4) + 2;
    const y = height - 4 - ((v - min) / range) * (height - 8);
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {values.map((v, i) => {
        const x = (i / (values.length - 1)) * (width - 4) + 2;
        const y = height - 4 - ((v - min) / range) * (height - 8);
        return <circle key={i} cx={x} cy={y} r={i === values.length - 1 ? 4 : 2} fill={color} />;
      })}
    </svg>
  );
}

function TrendIcon({ trend }) {
  if (trend === 'rising') return <TrendingUp size={14} color="#ef4444" />;
  if (trend === 'falling') return <TrendingDown size={14} color="#10b981" />;
  return <Minus size={14} color="#64748b" />;
}

export default function VitalsTracker() {
  const [sessionId] = useState(getOrCreateSession);
  const [form, setForm] = useState({});
  const [notes, setNotes] = useState('');
  const [stats, setStats] = useState({});
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [lastFlags, setLastFlags] = useState([]);
  const [saved, setSaved] = useState(false);

  const fetchHistory = async () => {
    setFetching(true);
    try {
      const res = await axios.post(HISTORY_API, { session_id: sessionId });
      setStats(res.data.stats || {});
      setEntries(res.data.entries || []);
    } catch {}
    setFetching(false);
  };

  useEffect(() => { fetchHistory(); }, []);

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleLog = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { session_id: sessionId };
      for (const [k, v] of Object.entries(form)) {
        if (v !== '' && v !== undefined) payload[k] = parseFloat(v);
      }
      if (notes) payload.notes = notes;
      const res = await axios.post(LOG_API, payload);
      setLastFlags(res.data.flags || []);
      setForm({}); setNotes('');
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      await fetchHistory();
    } catch {}
    setLoading(false);
  };

  return (
    <div className="module-container">
      <div className="module-header" style={{ background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #14b8a6 100%)' }}>
        <div className="module-header-icon"><Heart size={28} /></div>
        <div>
          <h2 className="module-header-title">Vitals & Biometrics Tracker</h2>
          <p className="module-header-subtitle">Log and monitor your health metrics over time with trend analysis</p>
        </div>
      </div>

      <div className="module-body">
        {/* Log Entry Form */}
        <div style={{ padding: '18px', background: 'var(--bg-card-hover)', borderRadius: 'var(--radius-md)', marginBottom: '24px', border: '1px solid var(--border-default)' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={16} /> Log New Vitals
          </h4>
          <form onSubmit={handleLog}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '12px' }}>
              {METRIC_CONFIGS.map(m => (
                <div key={m.key} className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ color: m.color }}>{m.label} ({m.unit})</label>
                  <input
                    className="form-input"
                    type="number"
                    step={m.step}
                    min={m.min}
                    max={m.max}
                    placeholder={`e.g., ${m.min + (m.max - m.min) / 3}`}
                    value={form[m.key] || ''}
                    onChange={e => set(m.key, e.target.value)}
                    style={{ borderColor: form[m.key] ? m.color + '60' : undefined }}
                  />
                </div>
              ))}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Notes (optional)</label>
                <input
                  className="form-input"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g., after exercise"
                />
              </div>
            </div>
            <button type="submit" disabled={loading || Object.values(form).every(v => v === '' || v === undefined)} className="btn-primary"
              style={{ background: 'linear-gradient(135deg, #0f766e, #14b8a6)' }}>
              {loading ? <><Activity className="spin-icon" size={18} /> Saving...</> : saved ? '✅ Saved!' : <><Plus size={18} /> Save Entry</>}
            </button>
          </form>

          {lastFlags.length > 0 && (
            <div style={{ marginTop: '12px' }}>
              {lastFlags.map((f, i) => (
                <div key={i} style={{
                  padding: '8px 12px', marginTop: '6px',
                  background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                  borderRadius: 'var(--radius-sm)', fontSize: '13px', color: '#ef4444',
                }}>
                  <AlertTriangle size={13} style={{ marginRight: '6px', verticalAlign: 'middle' }} />{f}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats Dashboard */}
        {Object.keys(stats).length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TrendingUp size={16} /> Health Metrics Dashboard
              <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--text-muted)', marginLeft: '8px' }}>{entries.length} reading{entries.length !== 1 ? 's' : ''} logged</span>
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {METRIC_CONFIGS.filter(m => stats[m.key]).map(m => {
                const s = stats[m.key];
                const isAbnormal = (s.normal_min && s.latest < s.normal_min) || (s.normal_max && s.latest > s.normal_max);
                const histValues = entries.map(e => e[m.key]).filter(v => v !== undefined && v !== null);
                return (
                  <div key={m.key} style={{
                    padding: '14px', borderRadius: 'var(--radius-md)',
                    background: isAbnormal ? `${m.color}0d` : 'var(--bg-card-hover)',
                    border: `1px solid ${isAbnormal ? m.color + '30' : 'var(--border-default)'}`,
                    transition: 'all 0.2s',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: m.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{m.label}</div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '2px' }}>
                          <span style={{ fontSize: '22px', fontWeight: 800, color: isAbnormal ? m.color : 'var(--text-primary)' }}>{s.latest}</span>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{m.unit}</span>
                        </div>
                      </div>
                      <TrendIcon trend={s.trend} />
                    </div>
                    <SparkLine values={histValues} color={m.color} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Min: {s.min}</span>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Avg: {s.avg}</span>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Max: {s.max}</span>
                    </div>
                    {s.normal_min && s.normal_max && (
                      <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Normal: {s.normal_min}–{s.normal_max} {m.unit}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* History Table */}
        {entries.length > 0 && (
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
              Recent Readings
            </h4>
            <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-card-hover)', borderBottom: '1px solid var(--border-default)' }}>
                    <th style={{ padding: '10px 14px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 700 }}>Time</th>
                    {METRIC_CONFIGS.map(m => (
                      <th key={m.key} style={{ padding: '10px 10px', textAlign: 'center', color: m.color, fontWeight: 700 }}>
                        {m.label}
                      </th>
                    ))}
                    <th style={{ padding: '10px 14px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 700 }}>Flags</th>
                  </tr>
                </thead>
                <tbody>
                  {[...entries].reverse().slice(0, 10).map((entry, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-light)', transition: 'background 0.1s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>
                        {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        <br /><span style={{ fontSize: '10px' }}>{new Date(entry.timestamp).toLocaleDateString()}</span>
                      </td>
                      {METRIC_CONFIGS.map(m => (
                        <td key={m.key} style={{
                          padding: '10px', textAlign: 'center',
                          color: entry[`${m.key}_status`] === 'high' || entry[`${m.key}_status`] === 'low' ? m.color : 'var(--text-secondary)',
                          fontWeight: entry[`${m.key}_status`] !== 'normal' ? 700 : 400,
                        }}>
                          {entry[m.key] !== undefined ? entry[m.key] : '—'}
                        </td>
                      ))}
                      <td style={{ padding: '10px 14px' }}>
                        {entry.flags?.length > 0 ? (
                          <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: 600 }}>
                            {entry.flags.length} flag{entry.flags.length > 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span style={{ fontSize: '11px', color: '#10b981' }}>✓ Normal</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {entries.length === 0 && !fetching && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <Droplets size={48} style={{ marginBottom: '12px', opacity: 0.3 }} />
            <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '6px' }}>No readings yet</div>
            <div style={{ fontSize: '14px' }}>Log your first vitals above to start tracking</div>
          </div>
        )}

        <div className="disclaimer-box" style={{ marginTop: '16px' }}>
          <AlertTriangle size={16} />
          <span>Vitals are stored in session memory and reset when the server restarts. This tool is for personal tracking only. Consult a healthcare professional about any abnormal readings.</span>
        </div>
      </div>
    </div>
  );
}
