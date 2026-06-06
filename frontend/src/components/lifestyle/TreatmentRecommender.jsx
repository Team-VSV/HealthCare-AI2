import React, { useState } from 'react';
import axios from 'axios';
import { Pill, AlertTriangle, Activity, Heart, Dumbbell, Stethoscope, ClipboardList, Plus, X } from 'lucide-react';

const API_URL = "http://localhost:8000/api/recommend/treatment";

const CONDITIONS = [
  "Coronary Artery Disease",
  "Hypertension",
  "Pneumonia",
  "Asthma",
  "Type 2 Diabetes",
  "Major Depressive Disorder",
  "Generalized Anxiety Disorder",
];

const COMORBIDITY_OPTIONS = [
  "Diabetes", "Hypertension", "Heart Disease", "Kidney Disease",
  "Depression", "Anxiety", "Obesity", "COPD", "Asthma",
];

export default function TreatmentRecommender() {
  const [condition, setCondition] = useState('');
  const [severity, setSeverity] = useState('moderate');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [comorbidities, setComorbidities] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addComorbidity = (c) => {
    if (!comorbidities.includes(c)) {
      setComorbidities([...comorbidities, c]);
    }
  };

  const removeComorbidity = (c) => {
    setComorbidities(comorbidities.filter(x => x !== c));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!condition.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const payload = {
        condition: condition.trim(),
        severity,
        comorbidities,
      };
      if (age) payload.age = parseInt(age);
      if (sex) payload.sex = sex;

      const response = await axios.post(API_URL, payload);
      if (response.data.error) throw new Error(response.data.error);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to connect to AI engine.");
    }
    setLoading(false);
  };

  return (
    <div className="module-container">
      {/* Header */}
      <div className="module-header" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)' }}>
        <div className="module-header-icon">
          <Pill size={28} />
        </div>
        <div>
          <h2 className="module-header-title">Treatment Recommender</h2>
          <p className="module-header-subtitle">
            Evidence-based personalized treatment plans powered by clinical guidelines
          </p>
        </div>
      </div>

      <div className="module-body">
        <form onSubmit={handleSubmit}>
          {/* Condition Select */}
          <div className="form-group">
            <label className="form-label">Condition / Diagnosis</label>
            <select
              value={condition}
              onChange={(e) => { setCondition(e.target.value); setResult(null); }}
              className="form-select"
            >
              <option value="">Select a condition...</option>
              {CONDITIONS.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Severity */}
          <div className="form-group">
            <label className="form-label">Severity</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['mild', 'moderate', 'severe'].map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSeverity(s)}
                  className="severity-toggle"
                  style={{
                    background: severity === s
                      ? (s === 'mild' ? '#f0fdf4' : s === 'moderate' ? '#fff7ed' : '#fef2f2')
                      : 'var(--bg-card)',
                    borderColor: severity === s
                      ? (s === 'mild' ? '#22c55e' : s === 'moderate' ? '#f97316' : '#ef4444')
                      : 'var(--border-light)',
                    color: severity === s
                      ? (s === 'mild' ? '#16a34a' : s === 'moderate' ? '#ea580c' : '#dc2626')
                      : 'var(--text-muted)',
                  }}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Demographics */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Age (optional)</label>
              <input
                type="number" value={age} onChange={(e) => setAge(e.target.value)}
                className="form-input" placeholder="e.g., 55" min="1" max="120"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Sex (optional)</label>
              <select value={sex} onChange={(e) => setSex(e.target.value)} className="form-select">
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          {/* Comorbidities */}
          <div className="form-group">
            <label className="form-label">Comorbidities (optional)</label>
            {comorbidities.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                {comorbidities.map(c => (
                  <span key={c} className="comorbidity-tag">
                    {c}
                    <button type="button" onClick={() => removeComorbidity(c)} style={{
                      background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                      display: 'flex', color: 'inherit', opacity: 0.7,
                    }}>
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {COMORBIDITY_OPTIONS.filter(c => !comorbidities.includes(c)).map(c => (
                <button
                  key={c} type="button" onClick={() => addComorbidity(c)}
                  className="chip-button" style={{ fontSize: '12px', padding: '4px 10px' }}
                >
                  <Plus size={12} /> {c}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !condition.trim()}
            className="btn-primary"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', width: '100%' }}
          >
            {loading ? (
              <><Activity className="spin-icon" size={20} /> Generating Plan...</>
            ) : (
              <><ClipboardList size={20} /> Generate Treatment Plan</>
            )}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="result-error">
            <AlertTriangle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="results-section" style={{ animation: 'fadeSlideUp 0.5s ease-out' }}>
            {/* Plan Header */}
            <div style={{
              padding: '16px 20px', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(217, 119, 6, 0.08))',
              borderRadius: '12px', marginBottom: '24px', border: '1px solid rgba(245, 158, 11, 0.15)',
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px' }}>
                Treatment Plan: {result.condition}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                Severity: <strong style={{ textTransform: 'capitalize' }}>{result.severity}</strong> — {result.severity_note}
              </p>
            </div>

            {/* Lifestyle Modifications */}
            <div className="treatment-section">
              <div className="treatment-section-header">
                <Dumbbell size={20} style={{ color: '#16a34a' }} />
                <h4>Lifestyle Modifications</h4>
              </div>
              {result.lifestyle_modifications?.map((item, idx) => (
                <div key={idx} className="treatment-item">
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '14px', marginBottom: '4px' }}>
                    {item.recommendation}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    {item.reasoning}
                  </div>
                </div>
              ))}
            </div>

            {/* Medication Classes */}
            <div className="treatment-section">
              <div className="treatment-section-header">
                <Pill size={20} style={{ color: '#2563eb' }} />
                <h4>Medication Classes</h4>
              </div>
              {result.medication_classes?.map((item, idx) => (
                <div key={idx} className="treatment-item">
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '14px', marginBottom: '4px' }}>
                    {item.class}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    {item.reasoning}
                  </div>
                </div>
              ))}
            </div>

            {/* Specialist Referrals */}
            <div className="treatment-section">
              <div className="treatment-section-header">
                <Stethoscope size={20} style={{ color: '#7c3aed' }} />
                <h4>Specialist Referrals</h4>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '0 16px 16px' }}>
                {result.specialist_referrals?.map((ref, idx) => (
                  <span key={idx} className="referral-tag">{ref}</span>
                ))}
              </div>
            </div>

            {/* Monitoring Plan */}
            <div className="treatment-section">
              <div className="treatment-section-header">
                <Heart size={20} style={{ color: '#ec4899' }} />
                <h4>Monitoring Plan</h4>
              </div>
              <ul className="monitoring-list">
                {result.monitoring_plan?.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Personalization Notes */}
            {(result.age_specific_notes?.length > 0 || result.sex_specific_notes?.length > 0 || result.comorbidity_notes?.length > 0) && (
              <div className="treatment-section">
                <div className="treatment-section-header">
                  <ClipboardList size={20} style={{ color: '#0ea5e9' }} />
                  <h4>Personalized Notes</h4>
                </div>
                <div style={{ padding: '0 16px 16px' }}>
                  {result.age_specific_notes?.map((note, idx) => (
                    <div key={`age-${idx}`} className="personalization-note">{note}</div>
                  ))}
                  {result.sex_specific_notes?.map((note, idx) => (
                    <div key={`sex-${idx}`} className="personalization-note">{note}</div>
                  ))}
                  {result.comorbidity_notes?.map((note, idx) => (
                    <div key={`com-${idx}`} className="personalization-note">{note}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="disclaimer-box">
              <AlertTriangle size={16} />
              <span>{result.disclaimer}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
