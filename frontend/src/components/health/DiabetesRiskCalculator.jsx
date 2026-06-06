import React, { useState } from 'react';
import axios from 'axios';
import { TrendingUp, Activity, AlertTriangle, ChevronDown } from 'lucide-react';

const API_URL = 'http://localhost:8000/api/predict/diabetes-risk';

const RISK_CONFIG = {
  Low: { bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)', text: '#10b981', bar: '#10b981' },
  Moderate: { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', text: '#f59e0b', bar: '#f59e0b' },
  High: { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', text: '#ef4444', bar: '#ef4444' },
  'Very High': { bg: 'rgba(127,29,29,0.08)', border: 'rgba(127,29,29,0.25)', text: '#dc2626', bar: '#dc2626' },
};

export default function DiabetesRiskCalculator() {
  const [form, setForm] = useState({
    age: 45, bmi: 26.0, fasting_glucose: '', hba1c: '', blood_pressure: '',
    physical_activity: 'moderate', family_history: false,
    gestational_diabetes: false, sex: 'not_specified', ethnicity_high_risk: false,
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null); setResult(null);
    try {
      const payload = {
        age: parseInt(form.age), bmi: parseFloat(form.bmi),
        physical_activity: form.physical_activity,
        family_history: form.family_history,
        gestational_diabetes: form.gestational_diabetes,
        sex: form.sex, ethnicity_high_risk: form.ethnicity_high_risk,
      };
      if (form.fasting_glucose) payload.fasting_glucose = parseFloat(form.fasting_glucose);
      if (form.hba1c) payload.hba1c = parseFloat(form.hba1c);
      if (form.blood_pressure) payload.blood_pressure = parseFloat(form.blood_pressure);

      const res = await axios.post(API_URL, payload);
      if (res.data.error) throw new Error(res.data.error);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Calculation failed.');
    }
    setLoading(false);
  };

  const riskConf = result ? (RISK_CONFIG[result.risk_band] || RISK_CONFIG.Low) : null;

  return (
    <div className="module-container">
      <div className="module-header" style={{ background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #fbbf24 100%)' }}>
        <div className="module-header-icon"><TrendingUp size={28} /></div>
        <div>
          <h2 className="module-header-title">Diabetes Risk Calculator</h2>
          <p className="module-header-subtitle">Evidence-based FINDRISC/ADA risk scoring — no lab tests required</p>
        </div>
      </div>

      <div className="module-body">
        <form onSubmit={handleSubmit}>
          {/* Demographics */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '4px' }}>
            <div className="form-group">
              <label className="form-label">Age</label>
              <input className="form-input" type="number" value={form.age} onChange={e => set('age', e.target.value)} min="18" max="100" />
            </div>
            <div className="form-group">
              <label className="form-label">BMI (kg/m²)</label>
              <input className="form-input" type="number" step="0.1" value={form.bmi} onChange={e => set('bmi', e.target.value)} min="10" max="70" />
            </div>
            <div className="form-group">
              <label className="form-label">Sex</label>
              <select className="form-select" value={form.sex} onChange={e => set('sex', e.target.value)}>
                <option value="not_specified">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Physical Activity</label>
              <select className="form-select" value={form.physical_activity} onChange={e => set('physical_activity', e.target.value)}>
                <option value="vigorous">Vigorous (5+ days/week)</option>
                <option value="moderate">Moderate (3-5 days/week)</option>
                <option value="light">Light (1-2 days/week)</option>
                <option value="sedentary">Sedentary (rarely/never)</option>
              </select>
            </div>
          </div>

          {/* Optional Lab Values */}
          <div style={{ padding: '14px 16px', background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 'var(--radius-sm)', marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#d97706', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Optional: Lab Values (improves accuracy)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Fasting Glucose (mg/dL)</label>
                <input className="form-input" type="number" placeholder="e.g., 95" value={form.fasting_glucose} onChange={e => set('fasting_glucose', e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">HbA1c (%)</label>
                <input className="form-input" type="number" step="0.1" placeholder="e.g., 5.4" value={form.hba1c} onChange={e => set('hba1c', e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Systolic BP (mmHg)</label>
                <input className="form-input" type="number" placeholder="e.g., 120" value={form.blood_pressure} onChange={e => set('blood_pressure', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Risk Factors (Checkboxes) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
            {[
              { key: 'family_history', label: 'Family history of diabetes' },
              { key: 'gestational_diabetes', label: 'History of gestational diabetes' },
              { key: 'ethnicity_high_risk', label: 'High-risk ethnicity (South Asian / African / Hispanic)' },
            ].map(({ key, label }) => (
              <label key={key} style={{
                display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px',
                background: form[key] ? 'rgba(245,158,11,0.08)' : 'var(--bg-card-hover)',
                border: `1px solid ${form[key] ? 'rgba(245,158,11,0.3)' : 'var(--border-default)'}`,
                borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: 'all 0.2s',
              }}>
                <input type="checkbox" checked={form[key]} onChange={e => set(key, e.target.checked)}
                  style={{ marginTop: '2px', accentColor: '#f59e0b' }} />
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{label}</span>
              </label>
            ))}
          </div>

          <button type="submit" disabled={loading} className="btn-primary"
            style={{ background: 'linear-gradient(135deg, #d97706, #f59e0b)', width: '100%' }}>
            {loading ? <><Activity className="spin-icon" size={20} /> Calculating Risk...</> : <><TrendingUp size={20} /> Calculate Diabetes Risk</>}
          </button>
        </form>

        {error && <div className="result-error"><AlertTriangle size={20} /><span>{error}</span></div>}

        {result && (
          <div className="results-section" style={{ animation: 'fadeSlideUp 0.5s ease-out' }}>
            {/* Risk Banner */}
            <div style={{
              padding: '24px',
              background: riskConf.bg, border: `1px solid ${riskConf.border}`,
              borderRadius: 'var(--radius-lg)', marginBottom: '20px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: riskConf.text, marginBottom: '4px' }}>
                    Diabetes Risk Assessment
                  </div>
                  <h3 style={{ fontSize: '28px', fontWeight: 900, color: riskConf.text, margin: 0 }}>
                    {result.risk_band} Risk
                  </h3>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '42px', fontWeight: 900, color: riskConf.text, lineHeight: 1 }}>
                    {result.risk_percentage}%
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Risk Score</div>
                </div>
              </div>
              <div className="confidence-bar-track" style={{ marginBottom: '12px' }}>
                <div className="confidence-bar-fill" style={{ width: `${result.risk_percentage}%`, background: `linear-gradient(90deg, ${riskConf.bar}88, ${riskConf.bar})` }} />
              </div>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{result.risk_description}</p>
            </div>

            {/* Contributing Factors */}
            {result.contributing_factors?.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>⚠️ Risk Factors Identified</h4>
                {result.contributing_factors.map((f, i) => (
                  <div key={i} style={{
                    padding: '10px 14px', background: 'rgba(239,68,68,0.05)',
                    border: '1px solid rgba(239,68,68,0.12)', borderRadius: 'var(--radius-sm)',
                    marginBottom: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{f.factor}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{f.detail}</div>
                    </div>
                    <span style={{ padding: '3px 10px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderRadius: '12px', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>
                      +{f.points} pts
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Protective Factors */}
            {result.protective_factors?.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#10b981', marginBottom: '10px' }}>✅ Protective Factors</h4>
                {result.protective_factors.map((f, i) => (
                  <div key={i} style={{
                    padding: '8px 14px', background: 'rgba(16,185,129,0.05)',
                    border: '1px solid rgba(16,185,129,0.12)', borderRadius: 'var(--radius-sm)',
                    marginBottom: '6px', fontSize: '13px', color: '#10b981',
                  }}>✓ {f}</div>
                ))}
              </div>
            )}

            {/* Recommendations */}
            {result.recommendations?.length > 0 && (
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>💡 Recommendations</h4>
                {result.recommendations.map((r, i) => (
                  <div key={i} style={{
                    padding: '10px 14px', background: 'rgba(99,102,241,0.06)',
                    border: '1px solid rgba(99,102,241,0.12)', borderRadius: 'var(--radius-sm)',
                    marginBottom: '8px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6,
                  }}>{r}</div>
                ))}
              </div>
            )}

            <div className="disclaimer-box" style={{ marginTop: '16px' }}>
              <AlertTriangle size={16} /><span>{result.disclaimer}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
