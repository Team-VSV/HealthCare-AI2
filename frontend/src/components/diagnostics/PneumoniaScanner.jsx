import React, { useState, useRef } from 'react';
import axios from 'axios';
import { UploadCloud, FileImage, ShieldAlert, ShieldCheck, Activity, AlertTriangle } from 'lucide-react';

const PneumoniaScanner = () => {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) processFile(selectedFile);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) processFile(droppedFile);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const processFile = (selectedFile) => {
        setFile(selectedFile);
        setPreviewUrl(URL.createObjectURL(selectedFile));
        setResult(null);
        setError(null);
    };

    const loadDemoImage = async (filename) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`/samples/${filename}`);
            if (!response.ok) throw new Error("Sample image not found on server.");
            const blob = await response.blob();
            const file = new File([blob], filename, { type: 'image/jpeg' });
            processFile(file);
        } catch (err) {
            setError(err.message || "Failed to load demo image.");
        } finally {
            setLoading(false);
        }
    };

    const handleScan = async () => {
        if (!file) return;
        
        setLoading(true);
        setError(null);
        
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:8000/api/predict/pneumonia', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            if (response.data.error) throw new Error(response.data.error);
            setResult(response.data);
        } catch (err) {
            setError(err.message || 'Error communicating with the server. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    const isHighRisk = result?.confidence > 50 && result?.risk_level?.includes('High');

    return (
        <div className="module-container">
            {/* Header */}
            <div className="module-header" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)' }}>
                <div className="module-header-icon">
                    <Activity size={28} />
                </div>
                <div>
                    <h2 className="module-header-title">Pneumonia X-Ray Scanner</h2>
                    <p className="module-header-subtitle">
                        Upload a chest X-Ray (JPEG/PNG) to analyze for pneumonia using our MobileNet CNN model
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
                        onClick={() => loadDemoImage('normal.jpg')}
                        disabled={loading}
                    >
                        Load Normal X-Ray
                    </button>
                    <button
                        type="button"
                        className="chip-button"
                        onClick={() => loadDemoImage('pneumonia.jpg')}
                        disabled={loading}
                    >
                        Load Pneumonia X-Ray
                    </button>
                </div>

                {/* Upload Zone */}
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    style={{
                        border: '2px dashed var(--border-default)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '40px 20px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 250ms',
                        background: 'var(--bg-input)',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.borderColor = '#10b981';
                        e.currentTarget.style.background = 'rgba(16, 185, 129, 0.05)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'var(--border-default)';
                        e.currentTarget.style.background = 'var(--bg-input)';
                    }}
                >
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        style={{ display: 'none' }} 
                        accept="image/jpeg, image/png, image/jpg"
                    />
                    
                    {previewUrl ? (
                        <div style={{ animation: 'fadeSlideUp 0.3s ease-out' }}>
                            <img 
                                src={previewUrl} 
                                alt="X-Ray Preview" 
                                style={{
                                    maxHeight: '256px',
                                    borderRadius: 'var(--radius-md)',
                                    boxShadow: 'var(--shadow-md)',
                                    marginBottom: '12px',
                                }}
                            />
                            <p style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                <FileImage size={16} /> {file.name}
                            </p>
                        </div>
                    ) : (
                        <div style={{ padding: '20px 0' }}>
                            <UploadCloud size={56} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
                            <p style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                Click or drag image to upload
                            </p>
                            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Supports JPG, PNG</p>
                        </div>
                    )}
                </div>

                {/* Scan Button */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
                    <button 
                        onClick={handleScan}
                        disabled={!file || loading}
                        className="btn-primary"
                        style={{
                            background: (!file || loading) 
                                ? 'var(--bg-card-hover)' 
                                : 'linear-gradient(135deg, #10b981, #059669)',
                            padding: '14px 32px',
                            fontSize: '16px',
                            borderRadius: '99px',
                            color: (!file || loading) ? 'var(--text-muted)' : 'white',
                            boxShadow: (!file || loading) ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.25)',
                        }}
                    >
                        {loading ? <><Activity className="spin-icon" size={20} /> Analyzing Scan...</> : 'Scan Image'}
                    </button>
                </div>

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
                        <div style={{
                            padding: '24px',
                            borderRadius: 'var(--radius-lg)',
                            background: isHighRisk ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.08)',
                            border: `1px solid ${isHighRisk ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`,
                        }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                <div style={{
                                    width: '56px', height: '56px', borderRadius: '50%',
                                    background: isHighRisk ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                    color: isHighRisk ? '#ef4444' : '#10b981',
                                }}>
                                    {isHighRisk ? <ShieldAlert size={28} /> : <ShieldCheck size={28} />}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{
                                        fontSize: '22px', fontWeight: 700, marginBottom: '8px',
                                        color: isHighRisk ? '#f87171' : '#34d399',
                                    }}>
                                        {result.risk_level}
                                    </h3>

                                    {/* Confidence Bar */}
                                    <div style={{ marginBottom: '16px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>AI Confidence Score</span>
                                            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                                                {result.confidence.toFixed(1)}%
                                            </span>
                                        </div>
                                        <div className="confidence-bar-track" style={{ height: '10px' }}>
                                            <div 
                                                className="confidence-bar-fill"
                                                style={{
                                                    width: `${Math.max(10, result.confidence)}%`,
                                                    background: isHighRisk 
                                                        ? 'linear-gradient(90deg, #ef4444, #dc2626)' 
                                                        : 'linear-gradient(90deg, #10b981, #059669)',
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <p style={{
                                        fontSize: '13px', color: 'var(--text-muted)',
                                        paddingTop: '12px', borderTop: '1px solid var(--border-light)',
                                        lineHeight: 1.5,
                                    }}>
                                        <strong>Note:</strong> This is an AI assessment generated by a Convolutional Neural Network 
                                        intended for clinical support. An expert radiologist must independently verify these findings.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="disclaimer-box" style={{ marginTop: '16px' }}>
                            <AlertTriangle size={16} />
                            <span>This AI prediction is for informational purposes only and is not a substitute for professional medical advice.</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PneumoniaScanner;
