import React, { useState } from 'react';
import axios from 'axios';
import { Search, AlertTriangle, CheckCircle, Activity, Stethoscope, ArrowRight, ShieldAlert } from 'lucide-react';

const API_URL = "http://localhost:8000/api/analyze/symptoms";

const SEVERITY_CONFIG = {
  low: { bg: 'rgba(34, 197, 94, 0.08)', border: 'rgba(34, 197, 94, 0.25)', text: '#16a34a', label: 'Low' },
  moderate: { bg: 'rgba(245, 158, 11, 0.08)', border: 'rgba(245, 158, 11, 0.25)', text: '#d97706', label: 'Moderate' },
  high: { bg: 'rgba(239, 68, 68, 0.08)', border: 'rgba(239, 68, 68, 0.25)', text: '#dc2626', label: 'High' },
  critical: { bg: 'rgba(127, 29, 29, 0.08)', border: 'rgba(127, 29, 29, 0.25)', text: '#991b1b', label: 'Critical' },
};

const TRIAGE_CONFIG = {
  'self-care': { icon: <CheckCircle size={20} />, color: '#16a34a', bg: '#f0fdf4' },
  'schedule-appointment': { icon: <Stethoscope size={20} />, color: '#2563eb', bg: '#eff6ff' },
  'urgent-care': { icon: <AlertTriangle size={20} />, color: '#d97706', bg: '#fffbeb' },
  'emergency': { icon: <ShieldAlert size={20} />, color: '#dc2626', bg: '#fef2f2' },
};

const EXAMPLE_SYMPTOMS = [
  "Persistent headache with nausea and light sensitivity",
  "Chest pain, shortness of breath, sweating",
  "Frequent urination, increased thirst, fatigue",
  "Cough, fever, chills, body aches",
  "Persistent sadness, loss of interest, difficulty sleeping",
  "Joint pain, stiffness, swelling in hands",
];

export default function SymptomChecker() {
  const [symptoms, setSymptoms] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const payload = { symptoms };
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

  const useExample = (text) => {
    setSymptoms(text);
    setResult(null);
    setError(null);
  };

  return (
    <div className="module-container">
      {/* Header */}
      <div className="module-header" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%)' }}>
        <div className="module-header-icon">
          <Search size={28} />
        </div>
        <div>
          <h2 className="module-header-title">AI Symptom Checker</h2>
          <p className="module-header-subtitle">
            Describe your symptoms in natural language to receive AI-powered analysis
          </p>
        </div>
      </div>

      <div className="module-body">
        <form onSubmit={handleSubmit}>
          {/* Symptom Input */}
          <div className="form-group">
            <label className="form-label">Describe Your Symptoms</label>
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g., I've been having persistent headaches, nausea, and sensitivity to light for the past week..."
              className="form-textarea"
              rows={4}
              style={{ resize: 'vertical', minHeight: '100px' }}
            />
          </div>

          {/* Example Chips */}
          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Try an example:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {EXAMPLE_SYMPTOMS.map((ex, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => useExample(ex)}
                  className="chip-button"
                >
                  {ex.length > 40 ? ex.substring(0, 40) + '…' : ex}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Demographics */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Age (optional)</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="form-input"
                placeholder="e.g., 35"
                min="1"
                max="120"
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Sex (optional)</label>
              <select value={sex} onChange={(e) => setSex(e.target.value)} className="form-select">
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !symptoms.trim()}
            className="btn-primary"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', width: '100%' }}
          >
            {loading ? (
              <><Activity className="spin-icon" size={20} /> Analyzing Symptoms...</>
            ) : (
              <><Search size={20} /> Analyze Symptoms</>
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
            {/* Triage Banner */}
            {result.highest_triage_level && (
              <div className="triage-banner" style={{
                background: TRIAGE_CONFIG[result.highest_triage_level]?.bg || '#f8fafc',
                borderColor: TRIAGE_CONFIG[result.highest_triage_level]?.color || '#64748b',
                color: TRIAGE_CONFIG[result.highest_triage_level]?.color || '#64748b',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  {TRIAGE_CONFIG[result.highest_triage_level]?.icon}
                  <strong style={{ fontSize: '16px', textTransform: 'capitalize' }}>
                    {result.highest_triage_level.replace('-', ' ')} Recommended
                  </strong>
                </div>
                <p style={{ fontSize: '14px', opacity: 0.9, margin: 0 }}>{result.triage_recommendation}</p>
              </div>
            )}

            {/* Matched Conditions */}
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
              Possible Conditions ({result.matches?.length || 0} matches)
            </h3>

            {result.matches?.map((match, idx) => {
              const sev = SEVERITY_CONFIG[match.severity] || SEVERITY_CONFIG.moderate;
              return (
                <div key={idx} className="condition-card" style={{ animationDelay: `${idx * 100}ms` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                        {match.condition}
                      </h4>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                        {match.description}
                      </p>
                    </div>
                    <div style={{
                      background: sev.bg, border: `1px solid ${sev.border}`, color: sev.text,
                      padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                      whiteSpace: 'nowrap', flexShrink: 0, marginLeft: '12px'
                    }}>
                      {sev.label} Severity
                    </div>
                  </div>

                  {/* Confidence Bar */}
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Match Confidence</span>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {match.confidence}%
                      </span>
                    </div>
                    <div className="confidence-bar-track">
                      <div
                        className="confidence-bar-fill"
                        style={{
                          width: `${Math.max(5, match.confidence)}%`,
                          background: `linear-gradient(90deg, ${sev.text}88, ${sev.text})`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Matched Symptoms */}
                  {match.matched_symptoms?.length > 0 && (
                    <div>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>Matched symptoms:</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {match.matched_symptoms.map((s, j) => (
                          <span key={j} className="symptom-tag">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Referral */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-light)',
                    fontSize: '13px', color: 'var(--text-muted)'
                  }}>
                    <ArrowRight size={14} />
                    <span>Recommended specialist: <strong style={{ color: 'var(--text-primary)' }}>{match.specialist}</strong></span>
                  </div>
                </div>
              );
            })}

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
