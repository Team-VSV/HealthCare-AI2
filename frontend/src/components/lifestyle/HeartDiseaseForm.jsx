import React, { useState } from 'react';
import axios from 'axios';
import { HeartPulse, Activity, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

const API_URL = "http://localhost:8000/api/predict/heart-disease";

export default function HeartDiseaseForm() {
  const [formData, setFormData] = useState({
    age: 50,
    gender: 1,
    height: 170,
    weight: 75,
    ap_hi: 120,
    ap_lo: 80,
    cholesterol: 1,
    gluc: 1,
    smoke: 0,
    alco: 0,
    active: 1
  });
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await axios.post(API_URL, formData);
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to connect to AI engine.");
    }
    setLoading(false);
  };

  return (
    <div className="module-container">
      {/* Header */}
      <div className="module-header" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)' }}>
        <div className="module-header-icon">
          <HeartPulse size={28} />
        </div>
        <div>
          <h2 className="module-header-title">Heart Disease Risk AI</h2>
          <p className="module-header-subtitle">
            PyTorch Deep Neural Network powered by 70,000 patient records
          </p>
        </div>
      </div>

      <div className="module-body">
        {/* Preset Demo Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Demo Presets:</span>
          <button
            type="button"
            className="chip-button"
            onClick={() => setFormData({
              age: 35,
              gender: 0,
              height: 165,
              weight: 60,
              ap_hi: 115,
              ap_lo: 75,
              cholesterol: 1,
              gluc: 1,
              smoke: 0,
              alco: 0,
              active: 1
            })}
          >
            Load Low-Risk Patient
          </button>
          <button
            type="button"
            className="chip-button"
            onClick={() => setFormData({
              age: 62,
              gender: 1,
              height: 175,
              weight: 95,
              ap_hi: 155,
              ap_lo: 95,
              cholesterol: 3,
              gluc: 2,
              smoke: 1,
              alco: 0,
              active: 0
            })}
          >
            Load High-Risk Patient
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="heart-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {/* Demographics */}
            <div className="form-group">
              <label className="form-label">Age (Years)</label>
              <input type="number" name="age" value={formData.age} onChange={handleChange} className="form-input" min="1" max="120" />
            </div>
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="form-select">
                <option value={1}>Male</option>
                <option value={0}>Female</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Height (cm)</label>
              <input type="number" name="height" value={formData.height} onChange={handleChange} className="form-input" min="50" max="250" />
            </div>
            <div className="form-group">
              <label className="form-label">Weight (kg)</label>
              <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="form-input" min="10" max="300" />
            </div>

            {/* Vitals */}
            <div className="form-group">
              <label className="form-label">Systolic BP</label>
              <input type="number" name="ap_hi" value={formData.ap_hi} onChange={handleChange} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Diastolic BP</label>
              <input type="number" name="ap_lo" value={formData.ap_lo} onChange={handleChange} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Cholesterol</label>
              <select name="cholesterol" value={formData.cholesterol} onChange={handleChange} className="form-select">
                <option value={1}>Normal</option>
                <option value={2}>Above Normal</option>
                <option value={3}>Well Above Normal</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Glucose</label>
              <select name="gluc" value={formData.gluc} onChange={handleChange} className="form-select">
                <option value={1}>Normal</option>
                <option value={2}>Above Normal</option>
                <option value={3}>Well Above Normal</option>
              </select>
            </div>

            {/* Lifestyle */}
            <div className="form-group">
              <label className="form-label">Smoking</label>
              <select name="smoke" value={formData.smoke} onChange={handleChange} className="form-select">
                <option value={0}>Non-Smoker</option>
                <option value={1}>Smoker</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Alcohol Intake</label>
              <select name="alco" value={formData.alco} onChange={handleChange} className="form-select">
                <option value={0}>No / Rare</option>
                <option value={1}>Frequent</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Physical Activity</label>
              <select name="active" value={formData.active} onChange={handleChange} className="form-select">
                <option value={1}>Active</option>
                <option value={0}>Sedentary</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary"
              style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}
            >
              {loading ? <Activity className="spin-icon" size={20} /> : <Activity size={20} />}
              {loading ? "Running Neural Network..." : "Run AI Analysis"}
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="result-error">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="results-section" style={{ animation: 'fadeSlideUp 0.5s ease-out' }}>
            <div style={{
              padding: '24px',
              borderRadius: 'var(--radius-lg)',
              background: result.prediction === 1 ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.08)',
              border: `1px solid ${result.prediction === 1 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  background: result.prediction === 1 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  color: result.prediction === 1 ? '#ef4444' : '#10b981',
                }}>
                  {result.prediction === 1 ? <AlertCircle size={24} /> : <CheckCircle size={24} />}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '20px', fontWeight: 700, marginBottom: '8px',
                    color: result.prediction === 1 ? '#f87171' : '#34d399',
                  }}>
                    {result.risk_level}
                  </h3>
                  <p style={{
                    fontSize: '14px', lineHeight: 1.6,
                    color: result.prediction === 1 ? '#fca5a5' : '#6ee7b7',
                    opacity: 0.9,
                  }}>
                    The PyTorch neural network analyzed your vitals with a confidence score of <strong>{(result.confidence * 100).toFixed(1)}%</strong>. 
                    {result.prediction === 1 
                      ? " Please consult with a healthcare professional for a thorough cardiovascular evaluation." 
                      : " Your metrics appear within a safer range, but maintain your regular checkups."}
                  </p>

                  {/* Confidence Bar */}
                  <div style={{ marginTop: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>AI Confidence</span>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {(result.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="confidence-bar-track">
                      <div
                        className="confidence-bar-fill"
                        style={{
                          width: `${result.confidence * 100}%`,
                          background: result.prediction === 1
                            ? 'linear-gradient(90deg, #ef4444, #dc2626)'
                            : 'linear-gradient(90deg, #10b981, #059669)',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="disclaimer-box" style={{ marginTop: '16px' }}>
              <AlertTriangle size={16} />
              <span>This Deep Learning classification is for informational purposes only and is not a clinical diagnosis.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
