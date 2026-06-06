import React, { useState } from 'react';
import axios from 'axios';
import { Microscope, Activity, AlertTriangle, Upload, Image } from 'lucide-react';

const API_URL = 'http://localhost:8000/api/predict/skin-lesion';

const URGENCY_CONFIG = {
  routine: { bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)', text: '#10b981', label: 'Routine Monitoring' },
  soon: { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', text: '#f59e0b', label: 'Schedule Soon' },
  urgent: { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', text: '#ef4444', label: 'Urgent Evaluation' },
  emergency: { bg: 'rgba(127,29,29,0.08)', border: 'rgba(127,29,29,0.25)', text: '#991b1b', label: 'Immediate Care' },
};

export default function SkinLesionClassifier() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (f) => {
    if (!f) return;
    setFile(f); setResult(null); setError(null);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(f);
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith('image/')) handleFile(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await axios.post(API_URL, form, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (res.data.error) throw new Error(res.data.error);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Analysis failed.');
    }
    setLoading(false);
  };

  const topResult = result?.top_prediction;
  const urgencyConf = topResult ? (URGENCY_CONFIG[topResult.urgency] || URGENCY_CONFIG.routine) : null;

  return (
    <div className="module-container">
      <div className="module-header" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%)' }}>
        <div className="module-header-icon"><Microscope size={28} /></div>
        <div>
          <h2 className="module-header-title">Skin Lesion Classifier</h2>
          <p className="module-header-subtitle">AI analysis of skin lesions across 7 dermoscopy categories</p>
        </div>
      </div>

      <div className="module-body">
        <form onSubmit={handleSubmit}>
          {/* Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById('skin-file-input').click()}
            style={{
              border: `2px dashed ${dragging ? '#a855f7' : 'var(--border-default)'}`,
              borderRadius: 'var(--radius-lg)',
              padding: '32px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: dragging ? 'rgba(168,85,247,0.05)' : 'var(--bg-card-hover)',
              marginBottom: '20px',
            }}
          >
            <input id="skin-file-input" type="file" accept="image/*" style={{ display: 'none' }}
              onChange={e => handleFile(e.target.files[0])} />

            {preview ? (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                <img src={preview} alt="Skin lesion preview" style={{
                  maxHeight: '180px', maxWidth: '200px', borderRadius: 'var(--radius-md)',
                  border: '2px solid rgba(168,85,247,0.3)', objectFit: 'cover',
                }} />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>{file.name}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{(file.size / 1024).toFixed(0)} KB</div>
                  <button type="button" className="chip-button" style={{ marginTop: '10px' }}
                    onClick={e => { e.stopPropagation(); setFile(null); setPreview(null); setResult(null); }}>
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Image size={48} color="#a855f7" style={{ marginBottom: '12px', opacity: 0.7 }} />
                <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  Drop a skin image here
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  or click to browse · JPG, PNG, WEBP supported
                </div>
              </>
            )}
          </div>

          <div style={{
            padding: '12px 16px', background: 'rgba(245,158,11,0.08)',
            border: '1px solid rgba(245,158,11,0.2)', borderRadius: 'var(--radius-sm)',
            fontSize: '13px', color: '#d97706', marginBottom: '20px',
          }}>
            <strong>7 Classes Analyzed:</strong> Melanocytic Nevus, Melanoma, Basal Cell Carcinoma, Actinic Keratosis, Benign Keratosis, Dermatofibroma, Vascular Lesion
          </div>

          <button type="submit" disabled={loading || !file} className="btn-primary"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', width: '100%' }}>
            {loading ? <><Activity className="spin-icon" size={20} /> Analyzing Lesion...</> : <><Microscope size={20} /> Classify Skin Lesion</>}
          </button>
        </form>

        {error && <div className="result-error"><AlertTriangle size={20} /><span>{error}</span></div>}

        {result && topResult && (
          <div className="results-section" style={{ animation: 'fadeSlideUp 0.5s ease-out' }}>
            {/* Top Prediction Banner */}
            <div style={{
              padding: '20px 24px',
              background: urgencyConf.bg, border: `1px solid ${urgencyConf.border}`,
              borderRadius: 'var(--radius-lg)', marginBottom: '20px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: urgencyConf.text, marginBottom: '4px' }}>
                    Top Classification
                  </div>
                  <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    {topResult.name}
                  </h3>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: urgencyConf.text }}>
                    {urgencyConf.label} · {topResult.probability}% confidence
                  </span>
                </div>
                <span style={{
                  padding: '4px 12px', borderRadius: '20px',
                  background: urgencyConf.bg, border: `1px solid ${urgencyConf.border}`,
                  color: urgencyConf.text, fontSize: '13px', fontWeight: 700,
                }}>{topResult.abbreviation}</span>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 12px' }}>
                {topResult.description}
              </p>
              <div style={{
                padding: '10px 14px', background: 'rgba(99,102,241,0.08)',
                borderRadius: 'var(--radius-sm)', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6,
              }}>
                <strong style={{ color: 'var(--text-primary)' }}>Recommendation:</strong> {topResult.recommendation}
              </div>
            </div>

            {/* Probability Bars */}
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
              All Classification Probabilities
            </h4>
            {result.all_predictions.map((pred, i) => {
              const conf = URGENCY_CONFIG[pred.urgency] || URGENCY_CONFIG.routine;
              return (
                <div key={i} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', fontWeight: i === 0 ? 700 : 400, color: 'var(--text-primary)' }}>
                      {pred.name}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: conf.text }}>{pred.probability}%</span>
                  </div>
                  <div className="confidence-bar-track">
                    <div className="confidence-bar-fill" style={{
                      width: `${pred.probability}%`,
                      background: `linear-gradient(90deg, ${conf.text}88, ${conf.text})`,
                    }} />
                  </div>
                </div>
              );
            })}

            {/* Image Features */}
            <div style={{ marginTop: '20px', padding: '14px', background: 'var(--bg-card-hover)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                Image Feature Analysis
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {Object.entries(result.image_features).map(([k, v]) => (
                  <div key={k} style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{k.replace(/_/g, ' ')}: </span>
                    <strong>{v}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="disclaimer-box" style={{ marginTop: '16px' }}>
              <AlertTriangle size={16} /><span>{result.disclaimer}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
