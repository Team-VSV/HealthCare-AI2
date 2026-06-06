import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pill, Plus, X, Activity, AlertTriangle, ShieldAlert, Info } from 'lucide-react';

const CHECK_API = 'http://localhost:8000/api/check/drug-interactions';
const DRUGS_API = 'http://localhost:8000/api/drugs/list';

const SEVERITY_CONFIG = {
  safe: { bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)', text: '#10b981', label: '✅ No Interactions Found' },
  mild: { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)', text: '#2563eb', label: 'ℹ️ Mild Interactions' },
  moderate: { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', text: '#f59e0b', label: '⚠️ Moderate Interactions' },
  severe: { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', text: '#ef4444', label: '🚨 Severe Interactions' },
  contraindicated: { bg: 'rgba(127,29,29,0.1)', border: 'rgba(127,29,29,0.3)', text: '#dc2626', label: '🚫 CONTRAINDICATED' },
};

const INTERACTION_COLORS = {
  mild: '#3b82f6', moderate: '#f59e0b', severe: '#ef4444', contraindicated: '#dc2626',
};

export default function DrugInteractionChecker() {
  const [drugs, setDrugs] = useState([]);
  const [input, setInput] = useState('');
  const [allDrugs, setAllDrugs] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(DRUGS_API).then(r => setAllDrugs(r.data.drugs || [])).catch(() => {});
  }, []);

  const handleInputChange = (val) => {
    setInput(val);
    if (val.length >= 2) {
      const filtered = allDrugs.filter(d => d.toLowerCase().includes(val.toLowerCase()) && !drugs.includes(d)).slice(0, 6);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const addDrug = (drug) => {
    const clean = drug.trim().toLowerCase();
    if (clean && !drugs.includes(clean) && drugs.length < 12) {
      setDrugs(prev => [...prev, clean]);
      setInput(''); setSuggestions([]); setResult(null);
    }
  };

  const removeDrug = (drug) => {
    setDrugs(prev => prev.filter(d => d !== drug));
    setResult(null);
  };

  const handleCheck = async () => {
    if (drugs.length < 1) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await axios.post(CHECK_API, { drugs });
      if (res.data.error) throw new Error(res.data.error);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Check failed.');
    }
    setLoading(false);
  };

  const overallConf = result ? (SEVERITY_CONFIG[result.overall_safety] || SEVERITY_CONFIG.safe) : null;

  return (
    <div className="module-container">
      <div className="module-header" style={{ background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f87171 100%)' }}>
        <div className="module-header-icon"><Pill size={28} /></div>
        <div>
          <h2 className="module-header-title">Drug Interaction Checker</h2>
          <p className="module-header-subtitle">Check 50+ clinically significant drug-drug and food-drug interactions</p>
        </div>
      </div>

      <div className="module-body">
        {/* Drug Input */}
        <div className="form-group">
          <label className="form-label">Add Medications ({drugs.length}/12)</label>
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                className="form-input"
                value={input}
                onChange={e => handleInputChange(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addDrug(input || (suggestions[0] || '')); } }}
                placeholder="Type a drug name (e.g., warfarin, aspirin, metformin)..."
              />
              <button type="button" className="btn-primary"
                style={{ padding: '10px 16px', background: 'linear-gradient(135deg, #dc2626, #ef4444)', flexShrink: 0 }}
                onClick={() => addDrug(input)}>
                <Plus size={18} />
              </button>
            </div>

            {/* Autocomplete Suggestions */}
            {suggestions.length > 0 && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 40,
                background: 'var(--bg-card)', border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-sm)', zIndex: 50, boxShadow: 'var(--shadow-md)',
                marginTop: '2px', overflow: 'hidden',
              }}>
                {suggestions.map((s, i) => (
                  <button key={i}
                    onMouseDown={() => addDrug(s)}
                    style={{
                      width: '100%', padding: '10px 14px', textAlign: 'left', background: 'none',
                      border: 'none', cursor: 'pointer', fontSize: '14px', color: 'var(--text-primary)',
                      fontFamily: 'inherit', borderBottom: '1px solid var(--border-light)',
                    }}
                    onMouseEnter={e => e.target.style.background = 'var(--bg-card-hover)'}
                    onMouseLeave={e => e.target.style.background = 'none'}
                  >
                    {s} <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>— recognized drug</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Drug Tags */}
        {drugs.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
            {drugs.map(d => (
              <div key={d} style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '6px 12px',
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: '20px', fontSize: '13px', fontWeight: 600, color: '#ef4444',
              }}>
                <Pill size={12} />{d}
                <button onClick={() => removeDrug(d)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: '0 2px', display: 'flex' }}>
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Quick Presets */}
        <div style={{ marginBottom: '20px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Quick test: </span>
          {[
            { label: 'Warfarin + Aspirin + Amiodarone', drugs: ['warfarin', 'aspirin', 'amiodarone'] },
            { label: 'Simvastatin + Clarithromycin', drugs: ['simvastatin', 'clarithromycin'] },
            { label: 'Sertraline + Tramadol', drugs: ['sertraline', 'tramadol'] },
            { label: 'Metformin + Furosemide + Lisinopril', drugs: ['metformin', 'furosemide', 'lisinopril'] },
          ].map((preset, i) => (
            <button key={i} className="chip-button" style={{ margin: '3px', fontSize: '11px' }}
              onClick={() => { setDrugs(preset.drugs); setResult(null); }}>
              {preset.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleCheck}
          disabled={loading || drugs.length < 1}
          className="btn-primary"
          style={{ background: 'linear-gradient(135deg, #dc2626, #ef4444)', width: '100%' }}
        >
          {loading ? <><Activity className="spin-icon" size={20} /> Checking Interactions...</> : <><ShieldAlert size={20} /> Check Interactions</>}
        </button>

        {error && <div className="result-error"><AlertTriangle size={20} /><span>{error}</span></div>}

        {result && (
          <div className="results-section" style={{ animation: 'fadeSlideUp 0.5s ease-out' }}>
            {/* Overall Safety Banner */}
            <div style={{
              padding: '16px 20px', marginBottom: '20px',
              background: overallConf.bg, border: `2px solid ${overallConf.border}`,
              borderRadius: 'var(--radius-md)',
            }}>
              <div style={{ fontSize: '16px', fontWeight: 700, color: overallConf.text, marginBottom: '6px' }}>
                {overallConf.label}
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{result.summary}</div>
            </div>

            {/* Drug-Drug Interactions */}
            {result.interactions_found?.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
                  Drug-Drug Interactions ({result.interactions_found.length})
                </h4>
                {result.interactions_found.map((int, i) => {
                  const color = INTERACTION_COLORS[int.severity] || '#6366f1';
                  return (
                    <div key={i} style={{
                      padding: '16px', marginBottom: '10px',
                      background: `${color}0d`, border: `1px solid ${color}30`,
                      borderRadius: 'var(--radius-md)', animation: `fadeSlideUp 0.3s ease-out ${i * 80}ms both`,
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>
                          {int.drug_a.charAt(0).toUpperCase() + int.drug_a.slice(1)} + {int.drug_b.charAt(0).toUpperCase() + int.drug_b.slice(1)}
                        </div>
                        <span style={{
                          padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 700,
                          background: `${color}20`, color, flexShrink: 0, marginLeft: '8px', textTransform: 'uppercase',
                        }}>{int.severity}</span>
                      </div>
                      <div style={{ fontSize: '13px', color: '#ef4444', fontWeight: 600, marginBottom: '6px' }}>⚡ {int.effect}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', lineHeight: 1.5 }}>
                        <strong>Mechanism:</strong> {int.mechanism}
                      </div>
                      <div style={{
                        padding: '8px 12px', background: 'rgba(99,102,241,0.06)',
                        borderRadius: 'var(--radius-sm)', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5,
                      }}>
                        <strong style={{ color: 'var(--text-primary)' }}>Recommendation:</strong> {int.recommendation}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Food-Drug Alerts */}
            {result.food_drug_alerts?.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
                  🍽️ Food-Drug Interactions
                </h4>
                {result.food_drug_alerts.map((alert, i) => (
                  <div key={i} style={{
                    padding: '14px 16px', marginBottom: '8px',
                    background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)',
                    borderRadius: 'var(--radius-sm)',
                  }}>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#f59e0b', marginBottom: '4px' }}>{alert.food}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      Affects: {alert.matched_drugs.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(', ')} · {alert.effect}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{alert.recommendation}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Unrecognized */}
            {result.unrecognized_drugs?.length > 0 && (
              <div style={{
                padding: '12px 16px', marginBottom: '16px',
                background: 'rgba(148,163,184,0.06)', border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-sm)', display: 'flex', gap: '8px', alignItems: 'flex-start',
              }}>
                <Info size={16} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: '1px' }} />
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  <strong>Unrecognized medications:</strong> {result.unrecognized_drugs.join(', ')} — not in our database. Results may be incomplete.
                </div>
              </div>
            )}

            <div className="disclaimer-box">
              <AlertTriangle size={16} /><span>{result.disclaimer}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
