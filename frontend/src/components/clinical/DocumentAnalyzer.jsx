import React, { useState } from 'react';
import axios from 'axios';
import { ScanLine, Activity, AlertTriangle, Upload, FileSearch, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const API_URL = 'http://localhost:8000/api/analyze/document';

const DEMO_REPORT = `PATIENT MEDICAL REPORT
Date: 2025-03-15
Patient: John Smith, Age 54

LABORATORY RESULTS:
Fasting Glucose: 118 mg/dL
HbA1c: 6.2%
Total Cholesterol: 215 mg/dL
LDL: 138 mg/dL
HDL: 42 mg/dL
Triglycerides: 185 mg/dL
Blood Pressure: 142/88 mmHg
Heart Rate: 76 bpm
BMI: 28.4 kg/m²
Creatinine: 1.1 mg/dL
eGFR: 72 mL/min/1.73m²
Hemoglobin: 13.8 g/dL
TSH: 2.1 mIU/L
Sodium: 139 mEq/L
Potassium: 4.2 mEq/L

CURRENT MEDICATIONS:
Patient is currently taking Metformin 500mg, Aspirin 81mg, and Atorvastatin 20mg.
Also on Lisinopril 10mg for blood pressure management.

PHYSICIAN NOTES:
Patient presents with prediabetes and borderline hypertension. LDL is slightly elevated. 
Continue current medication regimen. Diet and exercise counseling recommended.`;

const STATUS_CONFIG = {
  normal: { bg: 'rgba(16, 185, 129, 0.08)', border: 'rgba(16, 185, 129, 0.2)', text: '#10b981', icon: <CheckCircle size={14} /> },
  high: { bg: 'rgba(239, 68, 68, 0.08)', border: 'rgba(239, 68, 68, 0.2)', text: '#ef4444', icon: <AlertCircle size={14} /> },
  low: { bg: 'rgba(245, 158, 11, 0.08)', border: 'rgba(245, 158, 11, 0.2)', text: '#f59e0b', icon: <AlertTriangle size={14} /> },
};

export default function DocumentAnalyzer() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await axios.post(API_URL, { text });
      if (res.data.error) throw new Error(res.data.error);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Document analysis failed.');
    }
    setLoading(false);
  };

  return (
    <div className="module-container">
      <div className="module-header" style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%)' }}>
        <div className="module-header-icon"><ScanLine size={28} /></div>
        <div>
          <h2 className="module-header-title">Medical Document Analyzer</h2>
          <p className="module-header-subtitle">Extract lab values, medications, and flags from medical reports</p>
        </div>
      </div>

      <div className="module-body">
        <button className="chip-button" style={{ marginBottom: '16px' }}
          onClick={() => { setText(DEMO_REPORT); setResult(null); }}>
          <Upload size={13} /> Load Sample Report
        </button>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Paste Medical Document / Lab Report Text</label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              className="form-textarea"
              rows={10}
              placeholder="Paste any medical report, lab results, discharge summary, or clinical note here..."
              style={{ resize: 'vertical', minHeight: '200px', fontFamily: 'monospace', fontSize: '13px' }}
            />
          </div>

          <button type="submit" disabled={loading || !text.trim()} className="btn-primary"
            style={{ background: 'linear-gradient(135deg, #1d4ed8, #2563eb)', width: '100%' }}>
            {loading ? <><Activity className="spin-icon" size={20} /> Analyzing Document...</> : <><FileSearch size={20} /> Analyze Document</>}
          </button>
        </form>

        {error && <div className="result-error"><AlertTriangle size={20} /><span>{error}</span></div>}

        {result && (
          <div className="results-section" style={{ animation: 'fadeSlideUp 0.5s ease-out' }}>
            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
              {[
                { label: 'Labs Extracted', value: result.total_labs_extracted, color: '#2563eb' },
                { label: 'Abnormal Values', value: result.total_abnormal, color: '#f59e0b' },
                { label: 'Critical Flags', value: result.critical_flags?.length || 0, color: '#ef4444' },
              ].map((s, i) => (
                <div key={i} style={{
                  background: 'var(--bg-card-hover)', border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-md)', padding: '16px', textAlign: 'center',
                }}>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Critical Flags */}
            {result.critical_flags?.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#ef4444', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertCircle size={16} /> Critical Findings
                </h4>
                {result.critical_flags.map((flag, i) => (
                  <div key={i} style={{
                    padding: '10px 14px', background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-sm)',
                    color: '#ef4444', fontSize: '13px', fontWeight: 600, marginBottom: '8px',
                    display: 'flex', alignItems: 'center', gap: '8px'
                  }}>
                    <XCircle size={14} /> {flag}
                  </div>
                ))}
              </div>
            )}

            {/* Lab Values Table */}
            {result.extracted_lab_values?.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
                  Extracted Lab Values
                </h4>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {result.extracted_lab_values.map((lab, i) => {
                    const config = STATUS_CONFIG[lab.status] || STATUS_CONFIG.normal;
                    return (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '12px 16px',
                        background: config.bg, border: `1px solid ${config.border}`,
                        borderRadius: 'var(--radius-sm)', animation: `fadeSlideUp 0.3s ease-out ${i * 50}ms both`,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color: config.text }}>{config.icon}</span>
                          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{lab.name}</span>
                          {lab.flag && (
                            <span style={{ fontSize: '11px', color: config.text, fontWeight: 500 }}>({lab.flag})</span>
                          )}
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '16px', fontWeight: 800, color: config.text }}>
                            {lab.value} <span style={{ fontSize: '11px', fontWeight: 500 }}>{lab.unit}</span>
                          </div>
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Normal: {lab.normal_range}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Medications */}
            {result.medications_detected?.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>
                  Medications Detected
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {result.medications_detected.map((med, i) => (
                    <span key={i} style={{
                      padding: '5px 14px', background: 'rgba(99,102,241,0.1)',
                      color: '#818cf8', borderRadius: '20px', fontSize: '13px', fontWeight: 600,
                    }}>{med}</span>
                  ))}
                </div>
              </div>
            )}

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
