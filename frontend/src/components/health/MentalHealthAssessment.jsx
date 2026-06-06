import React, { useState } from 'react';
import axios from 'axios';
import { Brain, AlertTriangle, Activity, ChevronRight, ChevronLeft, Phone } from 'lucide-react';

const API_URL = "http://localhost:8000/api/assess/mental-health";

const RESPONSE_OPTIONS = [
  { value: 0, label: "Not at all", sublabel: "0 days" },
  { value: 1, label: "Several days", sublabel: "1-6 days" },
  { value: 2, label: "More than half the days", sublabel: "7-11 days" },
  { value: 3, label: "Nearly every day", sublabel: "12-14 days" },
];

const PHQ9_QUESTIONS = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself — or that you are a failure",
  "Trouble concentrating on things",
  "Moving or speaking so slowly that others notice — or being fidgety",
  "Thoughts that you would be better off dead, or of hurting yourself",
];

const GAD7_QUESTIONS = [
  "Feeling nervous, anxious, or on edge",
  "Not being able to stop or control worrying",
  "Worrying too much about different things",
  "Trouble relaxing",
  "Being so restless that it's hard to sit still",
  "Becoming easily annoyed or irritable",
  "Feeling afraid, as if something awful might happen",
];

const SEVERITY_COLORS = {
  'Minimal': { gradient: 'linear-gradient(135deg, #22c55e, #16a34a)', text: '#16a34a', bg: '#f0fdf4' },
  'Mild': { gradient: 'linear-gradient(135deg, #eab308, #ca8a04)', text: '#ca8a04', bg: '#fefce8' },
  'Moderate': { gradient: 'linear-gradient(135deg, #f97316, #ea580c)', text: '#ea580c', bg: '#fff7ed' },
  'Moderately Severe': { gradient: 'linear-gradient(135deg, #ef4444, #dc2626)', text: '#dc2626', bg: '#fef2f2' },
  'Severe': { gradient: 'linear-gradient(135deg, #dc2626, #991b1b)', text: '#991b1b', bg: '#fef2f2' },
};

export default function MentalHealthAssessment() {
  const [step, setStep] = useState('intro'); // intro | phq9 | gad7 | submitting | results
  const [phq9Answers, setPhq9Answers] = useState(Array(9).fill(null));
  const [gad7Answers, setGad7Answers] = useState(Array(7).fill(null));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const isPhq9Phase = step === 'phq9';
  const isGad7Phase = step === 'gad7';
  const questions = isPhq9Phase ? PHQ9_QUESTIONS : GAD7_QUESTIONS;
  const answers = isPhq9Phase ? phq9Answers : gad7Answers;
  const setAnswers = isPhq9Phase ? setPhq9Answers : setGad7Answers;
  const totalQuestions = 16; // 9 + 7
  const globalIndex = isPhq9Phase ? currentQuestion : 9 + currentQuestion;

  const handleAnswer = (value) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);

    // Auto-advance after selection
    setTimeout(() => {
      if (isPhq9Phase && currentQuestion < 8) {
        setCurrentQuestion(currentQuestion + 1);
      } else if (isPhq9Phase && currentQuestion === 8) {
        setStep('gad7');
        setCurrentQuestion(0);
      } else if (isGad7Phase && currentQuestion < 6) {
        setCurrentQuestion(currentQuestion + 1);
      } else if (isGad7Phase && currentQuestion === 6) {
        submitAssessment(phq9Answers, newAnswers);
      }
    }, 300);
  };

  const goBack = () => {
    if (isGad7Phase && currentQuestion === 0) {
      setStep('phq9');
      setCurrentQuestion(8);
    } else if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitAssessment = async (phq9, gad7) => {
    setStep('submitting');
    setError(null);
    try {
      // Replace any nulls with 0 (unanswered = not at all)
      const finalPhq9 = phq9.map(v => v ?? 0);
      const finalGad7 = gad7.map(v => v ?? 0);

      const response = await axios.post(API_URL, {
        phq9: finalPhq9,
        gad7: finalGad7,
      });

      if (response.data.error) throw new Error(response.data.error);
      setResult(response.data);
      setStep('results');
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to connect to AI engine.");
      setStep('gad7');
      setCurrentQuestion(6);
    }
  };

  const resetAssessment = () => {
    setStep('intro');
    setPhq9Answers(Array(9).fill(null));
    setGad7Answers(Array(7).fill(null));
    setCurrentQuestion(0);
    setResult(null);
    setError(null);
  };

  // ── Intro Screen ──────────────────────────────────────────────────
  if (step === 'intro') {
    return (
      <div className="module-container">
        <div className="module-header" style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)' }}>
          <div className="module-header-icon">
            <Brain size={28} />
          </div>
          <div>
            <h2 className="module-header-title">Mental Health Assessment</h2>
            <p className="module-header-subtitle">
              Validated clinical screening using PHQ-9 and GAD-7 instruments
            </p>
          </div>
        </div>
        <div className="module-body" style={{ textAlign: 'center', padding: '48px 32px' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px', boxShadow: '0 8px 32px rgba(14, 165, 233, 0.25)'
          }}>
            <Brain size={36} color="white" />
          </div>
          <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
            Depression & Anxiety Screening
          </h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 8px', lineHeight: 1.6 }}>
            This assessment uses two clinically validated instruments:
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', margin: '24px 0', flexWrap: 'wrap' }}>
            <div className="info-card">
              <strong>PHQ-9</strong>
              <span>9 questions · Depression screening</span>
            </div>
            <div className="info-card">
              <strong>GAD-7</strong>
              <span>7 questions · Anxiety screening</span>
            </div>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '32px' }}>
            Takes approximately 3-5 minutes to complete. Your answers are processed locally.
          </p>
          <button
            onClick={() => { setStep('phq9'); setCurrentQuestion(0); }}
            className="btn-primary"
            style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', padding: '14px 40px', fontSize: '16px' }}
          >
            Begin Assessment <ChevronRight size={20} />
          </button>

          <div className="disclaimer-box" style={{ marginTop: '32px', textAlign: 'left' }}>
            <AlertTriangle size={16} />
            <span>This is a screening tool, not a clinical diagnosis. If you are in crisis, call <strong>988</strong> (Suicide & Crisis Lifeline) or text HOME to <strong>741741</strong>.</span>
          </div>
        </div>
      </div>
    );
  }

  // ── Submitting Screen ─────────────────────────────────────────────
  if (step === 'submitting') {
    return (
      <div className="module-container">
        <div className="module-header" style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)' }}>
          <div className="module-header-icon"><Brain size={28} /></div>
          <div>
            <h2 className="module-header-title">Mental Health Assessment</h2>
            <p className="module-header-subtitle">Processing your responses...</p>
          </div>
        </div>
        <div className="module-body" style={{ textAlign: 'center', padding: '64px 32px' }}>
          <Activity className="spin-icon" size={48} style={{ color: '#0284c7', marginBottom: '16px' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>Analyzing assessment data...</p>
        </div>
      </div>
    );
  }

  // ── Results Screen ────────────────────────────────────────────────
  if (step === 'results' && result) {
    const depColors = SEVERITY_COLORS[result.depression.severity] || SEVERITY_COLORS['Minimal'];
    const anxColors = SEVERITY_COLORS[result.anxiety.severity] || SEVERITY_COLORS['Minimal'];

    return (
      <div className="module-container">
        <div className="module-header" style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)' }}>
          <div className="module-header-icon"><Brain size={28} /></div>
          <div>
            <h2 className="module-header-title">Assessment Results</h2>
            <p className="module-header-subtitle">PHQ-9 & GAD-7 Clinical Screening</p>
          </div>
        </div>
        <div className="module-body" style={{ animation: 'fadeSlideUp 0.5s ease-out' }}>
          {/* Suicidal Ideation Alert */}
          {result.suicidal_ideation_flag && (
            <div style={{
              background: '#fef2f2', border: '2px solid #ef4444', borderRadius: '12px',
              padding: '16px 20px', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'flex-start'
            }}>
              <Phone size={24} style={{ color: '#dc2626', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#dc2626', display: 'block', marginBottom: '4px' }}>Important: Crisis Resources</strong>
                <p style={{ fontSize: '14px', color: '#991b1b', margin: 0, lineHeight: 1.5 }}>
                  Your responses indicate thoughts of self-harm. Please reach out immediately:<br />
                  <strong>988 Suicide & Crisis Lifeline</strong> — Call or text <strong>988</strong><br />
                  <strong>Crisis Text Line</strong> — Text HOME to <strong>741741</strong>
                </p>
              </div>
            </div>
          )}

          {/* Score Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            {/* Depression Score */}
            <div className="score-card">
              <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                Depression (PHQ-9)
              </h4>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
                <span style={{ fontSize: '36px', fontWeight: 800, color: depColors.text }}>
                  {result.depression.score}
                </span>
                <span style={{ fontSize: '16px', color: 'var(--text-muted)' }}>/ {result.depression.max_score}</span>
              </div>
              <div className="confidence-bar-track" style={{ marginBottom: '8px' }}>
                <div className="confidence-bar-fill" style={{
                  width: `${result.depression.percentage}%`,
                  background: depColors.gradient,
                }} />
              </div>
              <span className="severity-badge" style={{ background: depColors.bg, color: depColors.text }}>
                {result.depression.severity}
              </span>
            </div>

            {/* Anxiety Score */}
            <div className="score-card">
              <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                Anxiety (GAD-7)
              </h4>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
                <span style={{ fontSize: '36px', fontWeight: 800, color: anxColors.text }}>
                  {result.anxiety.score}
                </span>
                <span style={{ fontSize: '16px', color: 'var(--text-muted)' }}>/ {result.anxiety.max_score}</span>
              </div>
              <div className="confidence-bar-track" style={{ marginBottom: '8px' }}>
                <div className="confidence-bar-fill" style={{
                  width: `${result.anxiety.percentage}%`,
                  background: anxColors.gradient,
                }} />
              </div>
              <span className="severity-badge" style={{ background: anxColors.bg, color: anxColors.text }}>
                {result.anxiety.severity}
              </span>
            </div>
          </div>

          {/* Recommendations */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
              Recommendations
            </h4>
            {result.recommendations?.map((rec, idx) => (
              <div key={idx} style={{
                padding: '12px 16px', background: 'var(--bg-card-hover)', borderRadius: '10px',
                marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5,
                borderLeft: rec.includes('IMPORTANT') ? '3px solid #dc2626' : '3px solid var(--accent-primary)',
              }}>
                {rec}
              </div>
            ))}
          </div>

          {/* Question Breakdown */}
          <details className="breakdown-details">
            <summary>View PHQ-9 Question Breakdown</summary>
            <div style={{ paddingTop: '12px' }}>
              {result.depression.breakdown?.map((q, idx) => (
                <div key={idx} className="breakdown-item" style={{
                  borderLeftColor: q.is_elevated ? '#ef4444' : 'var(--border-light)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      Q{q.question_number}. {q.question}
                    </span>
                    <span style={{
                      fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap',
                      color: q.is_elevated ? '#dc2626' : 'var(--text-muted)'
                    }}>
                      {q.response_label} ({q.response})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </details>

          <details className="breakdown-details">
            <summary>View GAD-7 Question Breakdown</summary>
            <div style={{ paddingTop: '12px' }}>
              {result.anxiety.breakdown?.map((q, idx) => (
                <div key={idx} className="breakdown-item" style={{
                  borderLeftColor: q.is_elevated ? '#ef4444' : 'var(--border-light)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      Q{q.question_number}. {q.question}
                    </span>
                    <span style={{
                      fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap',
                      color: q.is_elevated ? '#dc2626' : 'var(--text-muted)'
                    }}>
                      {q.response_label} ({q.response})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </details>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
            <button onClick={resetAssessment} className="btn-outline">
              Take Assessment Again
            </button>
          </div>

          <div className="disclaimer-box" style={{ marginTop: '24px' }}>
            <AlertTriangle size={16} />
            <span>{result.disclaimer}</span>
          </div>
        </div>
      </div>
    );
  }

  // ── Question Flow ─────────────────────────────────────────────────
  const progressPercent = ((globalIndex + 1) / totalQuestions) * 100;

  return (
    <div className="module-container">
      <div className="module-header" style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)' }}>
        <div className="module-header-icon"><Brain size={28} /></div>
        <div>
          <h2 className="module-header-title">Mental Health Assessment</h2>
          <p className="module-header-subtitle">
            {isPhq9Phase ? 'PHQ-9 — Depression Screening' : 'GAD-7 — Anxiety Screening'}
          </p>
        </div>
      </div>

      <div className="module-body">
        {/* Progress */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Question {globalIndex + 1} of {totalQuestions}
            </span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {Math.round(progressPercent)}%
            </span>
          </div>
          <div className="confidence-bar-track" style={{ height: '6px' }}>
            <div className="confidence-bar-fill" style={{
              width: `${progressPercent}%`,
              background: 'linear-gradient(90deg, #0ea5e9, #0284c7)',
              transition: 'width 0.4s ease-out',
            }} />
          </div>
        </div>

        {/* Section Label */}
        <div style={{
          display: 'inline-block', padding: '4px 12px', borderRadius: '20px',
          background: isPhq9Phase ? '#eff6ff' : '#f0fdf4',
          color: isPhq9Phase ? '#2563eb' : '#16a34a',
          fontSize: '12px', fontWeight: 600, marginBottom: '16px',
        }}>
          {isPhq9Phase ? 'PHQ-9 Depression' : 'GAD-7 Anxiety'} · Q{currentQuestion + 1}
        </div>

        {/* Question */}
        <h3 style={{
          fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)',
          marginBottom: '8px', lineHeight: 1.4,
        }}>
          {questions[currentQuestion]}
        </h3>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
          Over the <strong>last 2 weeks</strong>, how often have you been bothered by this problem?
        </p>

        {/* Response Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
          {RESPONSE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleAnswer(opt.value)}
              className="response-option"
              style={{
                borderColor: answers[currentQuestion] === opt.value ? '#0284c7' : 'var(--border-light)',
                background: answers[currentQuestion] === opt.value ? 'rgba(14, 165, 233, 0.08)' : 'var(--bg-card)',
              }}
            >
              <div style={{
                width: '24px', height: '24px', borderRadius: '50%',
                border: `2px solid ${answers[currentQuestion] === opt.value ? '#0284c7' : '#cbd5e1'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {answers[currentQuestion] === opt.value && (
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#0284c7' }} />
                )}
              </div>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '15px' }}>{opt.label}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{opt.sublabel}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            onClick={goBack}
            disabled={isPhq9Phase && currentQuestion === 0}
            className="btn-outline"
            style={{ opacity: (isPhq9Phase && currentQuestion === 0) ? 0.4 : 1 }}
          >
            <ChevronLeft size={18} /> Back
          </button>
          {/* Skip shows only if not last question */}
          {(!(isGad7Phase && currentQuestion === 6)) && (
            <button
              onClick={() => handleAnswer(answers[currentQuestion] ?? 0)}
              className="btn-outline"
            >
              Skip <ChevronRight size={18} />
            </button>
          )}
        </div>

        {error && (
          <div className="result-error" style={{ marginTop: '16px' }}>
            <AlertTriangle size={20} />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
