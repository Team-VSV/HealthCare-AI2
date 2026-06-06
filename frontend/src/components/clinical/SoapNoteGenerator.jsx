import React, { useState } from 'react';
import axios from 'axios';
import { FileText, Activity, AlertTriangle, Copy, CheckCheck, ChevronDown, ChevronUp } from 'lucide-react';

const API_URL = 'http://localhost:8000/api/scribe/soap-note';

const DEMO_TRANSCRIPTS = [
  {
    label: 'Hypertension Follow-up',
    text: `Patient is a 58-year-old male presenting for hypertension follow-up. He reports occasional headaches and dizziness over the past two weeks. States he has been compliant with his medication regimen. Denies chest pain or shortness of breath. He mentions some work-related stress lately which may be worsening symptoms.

On examination, blood pressure is 148/92 mmHg, heart rate 78 bpm, temperature 36.8°C, respiratory rate 16, SpO2 98%. Patient appears alert and oriented. Cardiovascular exam reveals regular rate and rhythm. Lungs are clear to auscultation bilaterally. Abdomen is soft and non-tender.

Assessment: Hypertension, currently suboptimally controlled. Consistent with known diagnosis. Rule out secondary cause given recent elevation.

Plan: Increase Lisinopril from 10mg to 20mg daily. Continue Hydrochlorothiazide 25mg. Counsel on sodium restriction and stress reduction. Follow-up blood test: BMP and lipid panel in 6 weeks. Return to clinic in 4 weeks or sooner if symptoms worsen. Referral to dietitian for DASH diet education.`,
    chief_complaint: 'Elevated blood pressure and headaches'
  },
  {
    label: 'Diabetes Check-up',
    text: `62-year-old female with Type 2 Diabetes presents for quarterly follow-up. She complains of increased fatigue and increased urination over the past month. Reports blurred vision occasionally. She states she has been eating more sweets during the holiday season. No chest pain or shortness of breath.

Vitals: BP 132/84 mmHg, HR 82 bpm, weight 91 kg, temperature 36.5. Physical exam unremarkable. Feet examination shows intact sensation, no ulcers.

Assessment: Type 2 Diabetes, poorly controlled. HbA1c likely elevated based on symptoms. Consistent with dietary non-compliance.

Plan: Order HbA1c and fasting glucose labs today. Increase Metformin to 1000mg twice daily. Counsel extensively on carbohydrate counting. Referral to certified diabetes educator. Schedule dilated eye exam with ophthalmologist. Follow-up in 3 months.`,
    chief_complaint: 'Increased fatigue and urinary frequency'
  },
];

const SOAP_COLORS = {
  subjective: '#8b5cf6',
  objective: '#0ea5e9',
  assessment: '#f59e0b',
  plan: '#10b981',
};

function SoapSection({ section, data, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const color = SOAP_COLORS[section] || '#6366f1';

  return (
    <div style={{
      border: `1.5px solid ${color}30`,
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      marginBottom: '12px',
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 18px', background: `${color}0d`, border: 'none', cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '8px',
            background: color, color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', fontWeight: 800,
          }}>
            {data.title.split(' — ')[0]}
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>{data.title}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{data.description}</div>
          </div>
        </div>
        <span style={{ color: 'var(--text-muted)' }}>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>

      {open && (
        <div style={{ padding: '16px 18px', borderTop: `1px solid ${color}20` }}>
          {/* Vitals (objective section only) */}
          {data.vitals && Object.keys(data.vitals).length > 0 && (
            <div style={{ marginBottom: '14px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {Object.entries(data.vitals).map(([k, v]) => (
                <div key={k} style={{
                  padding: '6px 12px', background: `${color}15`,
                  borderRadius: '20px', fontSize: '12px', fontWeight: 600, color,
                }}>
                  {k}: <span style={{ fontWeight: 700 }}>{v}</span>
                </div>
              ))}
            </div>
          )}

          {/* Content bullets */}
          {Array.isArray(data.content) && data.content.map((item, i) => (
            <div key={i} style={{
              padding: '8px 12px', marginBottom: '6px',
              borderLeft: `3px solid ${color}`,
              background: 'var(--bg-card-hover)',
              borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
              fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6,
            }}>
              {item}
            </div>
          ))}

          {/* Medications mentioned (plan section) */}
          {data.medications_mentioned && data.medications_mentioned.length > 0 && (
            <div style={{ marginTop: '12px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>
                Medications Mentioned:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {data.medications_mentioned.map((med, i) => (
                  <span key={i} style={{
                    padding: '3px 10px', background: 'rgba(16,185,129,0.1)',
                    color: '#10b981', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                  }}>{med}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SoapNoteGenerator() {
  const [transcript, setTranscript] = useState('');
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [visitType, setVisitType] = useState('follow-up');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!transcript.trim()) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const payload = { transcript, visit_type: visitType };
      if (chiefComplaint) payload.chief_complaint = chiefComplaint;
      if (patientAge) payload.patient_age = parseInt(patientAge);
      const res = await axios.post(API_URL, payload);
      if (res.data.error) throw new Error(res.data.error);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to generate SOAP note.');
    }
    setLoading(false);
  };

  const handleCopy = () => {
    if (!result) return;
    const text = [
      `SOAP NOTE — ${new Date().toLocaleDateString()}`,
      `Chief Complaint: ${result.chief_complaint}`,
      `Patient Age: ${result.patient_age || 'Not specified'}`,
      `Visit Type: ${result.visit_type}`,
      '',
      `SUBJECTIVE:\n${result.subjective?.content?.join('\n')}`,
      `\nOBJECTIVE:\n${result.objective?.content?.join('\n')}`,
      `\nASSESSMENT:\n${result.assessment?.content?.join('\n')}`,
      `\nPLAN:\n${result.plan?.content?.join('\n')}`,
      `\nDISCLAIMER: ${result.disclaimer}`,
    ].join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="module-container">
      <div className="module-header" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)' }}>
        <div className="module-header-icon"><FileText size={28} /></div>
        <div>
          <h2 className="module-header-title">AI Medical Scribe</h2>
          <p className="module-header-subtitle">Convert clinical transcripts into structured SOAP notes automatically</p>
        </div>
      </div>

      <div className="module-body">
        {/* Demo Presets */}
        <div style={{ marginBottom: '20px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Load demo transcript: </span>
          {DEMO_TRANSCRIPTS.map((d, i) => (
            <button key={i} className="chip-button" style={{ margin: '4px' }}
              onClick={() => { setTranscript(d.text); setChiefComplaint(d.chief_complaint); setResult(null); }}>
              {d.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Clinical Transcript / Dictation *</label>
            <textarea
              value={transcript}
              onChange={e => setTranscript(e.target.value)}
              className="form-textarea"
              rows={8}
              placeholder="Paste or dictate the clinical encounter transcript here. Include patient complaints, examination findings, assessment, and plan..."
              style={{ resize: 'vertical', minHeight: '180px' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '20px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Chief Complaint (optional)</label>
              <input className="form-input" value={chiefComplaint}
                onChange={e => setChiefComplaint(e.target.value)} placeholder="e.g., Chest pain" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Patient Age (optional)</label>
              <input className="form-input" type="number" value={patientAge}
                onChange={e => setPatientAge(e.target.value)} placeholder="e.g., 55" min="1" max="120" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Visit Type</label>
              <select className="form-select" value={visitType} onChange={e => setVisitType(e.target.value)}>
                <option value="follow-up">Follow-up</option>
                <option value="new-patient">New Patient</option>
                <option value="emergency">Emergency</option>
                <option value="telehealth">Telehealth</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading || !transcript.trim()} className="btn-primary"
            style={{ background: 'linear-gradient(135deg, #0f172a, #1e40af)', width: '100%' }}>
            {loading ? <><Activity className="spin-icon" size={20} /> Generating SOAP Note...</> : <><FileText size={20} /> Generate SOAP Note</>}
          </button>
        </form>

        {error && (
          <div className="result-error"><AlertTriangle size={20} /><span>{error}</span></div>
        )}

        {result && (
          <div className="results-section" style={{ animation: 'fadeSlideUp 0.5s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Generated SOAP Note
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {result.visit_type} visit · {result.chief_complaint}
                  {result.patient_age ? ` · Age: ${result.patient_age}` : ''}
                </p>
              </div>
              <button onClick={handleCopy} className="btn-outline" style={{ fontSize: '13px' }}>
                {copied ? <><CheckCheck size={14} /> Copied!</> : <><Copy size={14} /> Copy Note</>}
              </button>
            </div>

            {['subjective', 'objective', 'assessment', 'plan'].map((s, i) => (
              result[s] && (
                <SoapSection key={s} section={s} data={result[s]} defaultOpen={i === 0} />
              )
            ))}

            <div className="disclaimer-box" style={{ marginTop: '16px' }}>
              <AlertTriangle size={16} /><span>{result.disclaimer}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
