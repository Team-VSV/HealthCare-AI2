import React, { useState } from 'react';
import axios from 'axios';
import { Bone, Activity, AlertTriangle, Image, CheckCircle, XCircle } from 'lucide-react';

const FRACTURE_API = 'http://localhost:8000/api/predict/fracture';
const RETINOPATHY_API = 'http://localhost:8000/api/predict/retinopathy';

const DR_GRADE_COLORS = ['#10b981', '#84cc16', '#f59e0b', '#ef4444', '#991b1b'];

function ImageUploadPanel({ title, icon, apiUrl, gradient, acceptNote, resultRenderer }) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await axios.post(apiUrl, form, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (res.data.error) throw new Error(res.data.error);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Analysis failed.');
    }
    setLoading(false);
  };

  return (
    <div className="module-container" style={{ marginBottom: '24px' }}>
      <div className="module-header" style={{ background: gradient }}>
        <div className="module-header-icon">{icon}</div>
        <div>
          <h2 className="module-header-title">{title}</h2>
          <p className="module-header-subtitle">{acceptNote}</p>
        </div>
      </div>
      <div className="module-body">
        <form onSubmit={handleSubmit}>
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f?.type.startsWith('image/')) handleFile(f); }}
            onClick={() => document.getElementById(`file-${apiUrl}`).click()}
            style={{
              border: `2px dashed ${dragging ? '#6366f1' : 'var(--border-default)'}`,
              borderRadius: 'var(--radius-lg)', padding: '28px', textAlign: 'center',
              cursor: 'pointer', transition: 'all 0.2s',
              background: dragging ? 'rgba(99,102,241,0.05)' : 'var(--bg-card-hover)',
              marginBottom: '16px',
            }}
          >
            <input id={`file-${apiUrl}`} type="file" accept="image/*" style={{ display: 'none' }}
              onChange={e => handleFile(e.target.files[0])} />
            {preview ? (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                <img src={preview} alt="preview" style={{
                  maxHeight: '160px', maxWidth: '200px', borderRadius: 'var(--radius-md)',
                  objectFit: 'cover', border: '2px solid var(--border-active)',
                  filter: 'grayscale(50%)',
                }} />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{file.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{(file.size / 1024).toFixed(0)} KB</div>
                  <button type="button" className="chip-button" style={{ marginTop: '8px', fontSize: '11px' }}
                    onClick={e => { e.stopPropagation(); setFile(null); setPreview(null); setResult(null); }}>
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Image size={40} color="#6366f1" style={{ marginBottom: '10px', opacity: 0.6 }} />
                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>Drop image here</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>or click to browse · JPG, PNG supported</div>
              </>
            )}
          </div>

          <button type="submit" disabled={loading || !file} className="btn-primary" style={{ background: gradient, width: '100%' }}>
            {loading ? <><Activity className="spin-icon" size={20} /> Analyzing...</> : <>{icon} Analyze Image</>}
          </button>
        </form>

        {error && <div className="result-error"><AlertTriangle size={20} /><span>{error}</span></div>}
        {result && resultRenderer(result)}
      </div>
    </div>
  );
}

function FractureResult({ result }) {
  const isFracture = result.fracture_probability >= 50;
  const color = isFracture ? '#ef4444' : '#10b981';
  return (
    <div className="results-section" style={{ animation: 'fadeSlideUp 0.5s ease-out' }}>
      <div style={{
        padding: '20px 24px',
        background: isFracture ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.08)',
        border: `1px solid ${isFracture ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}`,
        borderRadius: 'var(--radius-lg)', marginBottom: '16px',
        display: 'flex', alignItems: 'center', gap: '16px',
      }}>
        <div style={{
          width: '52px', height: '52px', borderRadius: '50%', flexShrink: 0,
          background: isFracture ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color,
        }}>
          {isFracture ? <XCircle size={28} /> : <CheckCircle size={28} />}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '20px', fontWeight: 800, color, margin: '0 0 4px' }}>{result.prediction}</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{result.recommendation}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        {[
          { label: 'Fracture Probability', value: `${result.fracture_probability}%`, color: '#ef4444' },
          { label: 'Normal Probability', value: `${result.normal_probability}%`, color: '#10b981' },
        ].map((s, i) => (
          <div key={i} style={{ padding: '14px', background: 'var(--bg-card-hover)', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border-default)' }}>
            <div style={{ fontSize: '24px', fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="confidence-bar-track" style={{ marginBottom: '16px' }}>
        <div className="confidence-bar-fill" style={{
          width: `${result.fracture_probability}%`,
          background: `linear-gradient(90deg, #ef444488, #ef4444)`,
        }} />
      </div>

      <div className="disclaimer-box"><AlertTriangle size={16} /><span>{result.disclaimer}</span></div>
    </div>
  );
}

function RetinopathyResult({ result }) {
  const color = DR_GRADE_COLORS[result.predicted_grade] || '#10b981';
  return (
    <div className="results-section" style={{ animation: 'fadeSlideUp 0.5s ease-out' }}>
      <div style={{
        padding: '20px 24px', marginBottom: '16px',
        background: `${color}12`, border: `1px solid ${color}30`,
        borderRadius: 'var(--radius-lg)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div>
            <div style={{ fontSize: '11px', color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Grade {result.predicted_grade} — {result.probability}% Confidence
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0' }}>{result.grade_name}</h3>
          </div>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 800, color }}>
            {result.predicted_grade}
          </div>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 10px' }}>{result.description}</p>
        <div style={{ padding: '10px 14px', background: 'rgba(99,102,241,0.08)', borderRadius: 'var(--radius-sm)', fontSize: '13px', color: 'var(--text-secondary)' }}>
          <strong style={{ color: 'var(--text-primary)' }}>Recommendation:</strong> {result.recommendation}
        </div>
      </div>

      {/* Grade Scale */}
      <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>DR Grade Probability</h4>
      {result.all_grades?.map((g, i) => (
        <div key={i} style={{ marginBottom: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
            <span style={{ fontSize: '12px', fontWeight: i === result.predicted_grade ? 700 : 400, color: 'var(--text-primary)' }}>
              Grade {g.grade}: {g.name}
            </span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: DR_GRADE_COLORS[i] }}>{g.probability}%</span>
          </div>
          <div className="confidence-bar-track">
            <div className="confidence-bar-fill" style={{ width: `${g.probability}%`, background: DR_GRADE_COLORS[i] }} />
          </div>
        </div>
      ))}

      <div className="disclaimer-box" style={{ marginTop: '16px' }}><AlertTriangle size={16} /><span>{result.disclaimer}</span></div>
    </div>
  );
}

export default function ImagingModules() {
  return (
    <div>
      <ImageUploadPanel
        title="Bone Fracture Detector"
        icon={<Bone size={28} />}
        apiUrl={FRACTURE_API}
        gradient="linear-gradient(135deg, #64748b 0%, #475569 50%, #334155 100%)"
        acceptNote="Upload X-ray images for AI-powered fracture detection"
        resultRenderer={(r) => <FractureResult result={r} />}
      />
      <ImageUploadPanel
        title="Diabetic Retinopathy Screener"
        icon={<span style={{ fontSize: '24px' }}>👁️</span>}
        apiUrl={RETINOPATHY_API}
        gradient="linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #14b8a6 100%)"
        acceptNote="Upload fundus/retinal images for 5-level DR grading"
        resultRenderer={(r) => <RetinopathyResult result={r} />}
      />
    </div>
  );
}
