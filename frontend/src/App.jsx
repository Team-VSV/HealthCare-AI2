import React, { useState, Suspense, lazy } from 'react';

const HeartDiseaseForm = lazy(() => import('./components/lifestyle/HeartDiseaseForm'));
const PneumoniaScanner = lazy(() => import('./components/diagnostics/PneumoniaScanner'));
const SymptomChecker = lazy(() => import('./components/clinical/SymptomChecker'));
const MentalHealthAssessment = lazy(() => import('./components/health/MentalHealthAssessment'));
const TreatmentRecommender = lazy(() => import('./components/lifestyle/TreatmentRecommender'));
const SoapNoteGenerator = lazy(() => import('./components/clinical/SoapNoteGenerator'));
const DocumentAnalyzer = lazy(() => import('./components/clinical/DocumentAnalyzer'));
const ClinicalChatbot = lazy(() => import('./components/clinical/ClinicalChatbot'));
const SkinLesionClassifier = lazy(() => import('./components/diagnostics/SkinLesionClassifier'));
const ImagingModules = lazy(() => import('./components/diagnostics/ImagingModules'));
const DiabetesRiskCalculator = lazy(() => import('./components/health/DiabetesRiskCalculator'));
const DrugInteractionChecker = lazy(() => import('./components/health/DrugInteractionChecker'));
const VitalsTracker = lazy(() => import('./components/health/VitalsTracker'));
const LifestylePlanner = lazy(() => import('./components/lifestyle/LifestylePlanner'));

import {
  HeartPulse, Stethoscope, Search, Brain, Pill,
  LayoutDashboard, ArrowRight, Menu, X, Activity,
  FileText, ScanLine, MessageSquare, Microscope, Bone,
  TrendingUp, ShieldAlert, Heart, Salad, Eye,
} from 'lucide-react';

const MODULES = [
  {
    id: 'home',
    label: 'Dashboard',
    icon: <LayoutDashboard size={18} />,
    section: 'navigation',
  },
  // ── Diagnostics ───────────────────────────────────────────────────
  {
    id: 'heart',
    label: 'Heart Disease',
    icon: <HeartPulse size={18} />,
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.1)',
    gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
    description: 'Predict coronary disease risk using 13 clinical factors with PyTorch neural network',
    section: 'diagnostics',
  },
  {
    id: 'pneumonia',
    label: 'Pneumonia X-Ray',
    icon: <Stethoscope size={18} />,
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.1)',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    description: 'Upload chest X-rays for AI pneumonia detection using MobileNetV2 CNN',
    section: 'diagnostics',
  },
  {
    id: 'skin',
    label: 'Skin Lesion AI',
    icon: <Microscope size={18} />,
    color: '#a855f7',
    bg: 'rgba(168, 85, 247, 0.1)',
    gradient: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    description: 'AI classification of skin lesions across 7 dermoscopy categories including melanoma',
    section: 'diagnostics',
  },
  {
    id: 'imaging',
    label: 'Fracture & Retina',
    icon: <Bone size={18} />,
    color: '#64748b',
    bg: 'rgba(100, 116, 139, 0.1)',
    gradient: 'linear-gradient(135deg, #64748b, #475569)',
    description: 'Bone fracture detection and 5-level diabetic retinopathy grading from images',
    section: 'diagnostics',
  },
  // ── Analysis ──────────────────────────────────────────────────────
  {
    id: 'symptoms',
    label: 'Symptom Checker',
    icon: <Search size={18} />,
    color: '#8b5cf6',
    bg: 'rgba(139, 92, 246, 0.1)',
    gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    description: 'Describe symptoms in natural language — AI matches against 30+ conditions with triage',
    section: 'analysis',
  },
  {
    id: 'mental',
    label: 'Mental Health',
    icon: <Brain size={18} />,
    color: '#0ea5e9',
    bg: 'rgba(14, 165, 233, 0.1)',
    gradient: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
    description: 'Validated PHQ-9 depression and GAD-7 anxiety screening instruments',
    section: 'analysis',
  },
  {
    id: 'diabetes-risk',
    label: 'Diabetes Risk',
    icon: <TrendingUp size={18} />,
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.1)',
    gradient: 'linear-gradient(135deg, #d97706, #f59e0b)',
    description: 'FINDRISC/ADA evidence-based diabetes risk scoring without lab tests required',
    section: 'analysis',
  },
  {
    id: 'document',
    label: 'Document Analyzer',
    icon: <ScanLine size={18} />,
    color: '#2563eb',
    bg: 'rgba(37, 99, 235, 0.1)',
    gradient: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
    description: 'Extract and flag lab values, medications, and critical findings from medical reports',
    section: 'analysis',
  },
  // ── Clinical Tools ────────────────────────────────────────────────
  {
    id: 'chatbot',
    label: 'Clinical Chatbot',
    icon: <MessageSquare size={18} />,
    color: '#818cf8',
    bg: 'rgba(129, 140, 248, 0.1)',
    gradient: 'linear-gradient(135deg, #4f46e5, #6366f1)',
    description: 'Evidence-based clinical knowledge chatbot powered by TF-IDF medical RAG',
    section: 'clinical',
  },
  {
    id: 'soap',
    label: 'AI Scribe',
    icon: <FileText size={18} />,
    color: '#94a3b8',
    bg: 'rgba(148, 163, 184, 0.1)',
    gradient: 'linear-gradient(135deg, #0f172a, #1e40af)',
    description: 'Convert clinical transcripts and dictation into structured SOAP notes automatically',
    section: 'clinical',
  },
  {
    id: 'drugs',
    label: 'Drug Interactions',
    icon: <ShieldAlert size={18} />,
    color: '#dc2626',
    bg: 'rgba(220, 38, 38, 0.1)',
    gradient: 'linear-gradient(135deg, #dc2626, #ef4444)',
    description: 'Check 50+ significant drug-drug and food-drug interactions with clinical guidance',
    section: 'clinical',
  },
  // ── Recommendations ───────────────────────────────────────────────
  {
    id: 'treatment',
    label: 'Treatment Plan',
    icon: <Pill size={18} />,
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.1)',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    description: 'Evidence-based personalized treatment recommendations and monitoring plans',
    section: 'recommendations',
  },
  {
    id: 'vitals',
    label: 'Vitals Tracker',
    icon: <Heart size={18} />,
    color: '#14b8a6',
    bg: 'rgba(20, 184, 166, 0.1)',
    gradient: 'linear-gradient(135deg, #0f766e, #14b8a6)',
    description: 'Log and monitor BP, heart rate, glucose, SpO2 with sparkline trend analysis',
    section: 'recommendations',
  },
  {
    id: 'lifestyle',
    label: 'Lifestyle Planner',
    icon: <Salad size={18} />,
    color: '#22c55e',
    bg: 'rgba(34, 197, 94, 0.1)',
    gradient: 'linear-gradient(135deg, #16a34a, #22c55e)',
    description: 'Personalized 7-day meal plans and exercise routines tailored to your condition',
    section: 'recommendations',
  },
];

const SECTION_LABELS = {
  navigation: null,
  diagnostics: 'Diagnostics',
  analysis: 'AI Analysis',
  clinical: 'Clinical Tools',
  recommendations: 'Recommendations',
};

/**
 * Main Application Component
 * 
 * Handles routing, lazy-loaded rendering of the 15 AI modules,
 * and manages the global sidebar layout.
 *
 * @component
 */
function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigateTo = (id) => {
    setActiveTab(id);
    setSidebarOpen(false);
  };

  const activeModule = MODULES.find(m => m.id === activeTab);
  const diagnosticModules = MODULES.filter(m => m.section !== 'navigation');

  const renderContent = () => {
    switch (activeTab) {
      case 'heart':        return <HeartDiseaseForm />;
      case 'pneumonia':    return <PneumoniaScanner />;
      case 'symptoms':     return <SymptomChecker />;
      case 'mental':       return <MentalHealthAssessment />;
      case 'treatment':    return <TreatmentRecommender />;
      case 'soap':         return <SoapNoteGenerator />;
      case 'document':     return <DocumentAnalyzer />;
      case 'chatbot':      return <ClinicalChatbot />;
      case 'skin':         return <SkinLesionClassifier />;
      case 'imaging':      return <ImagingModules />;
      case 'diabetes-risk': return <DiabetesRiskCalculator />;
      case 'drugs':        return <DrugInteractionChecker />;
      case 'vitals':       return <VitalsTracker />;
      case 'lifestyle':    return <LifestylePlanner />;
      default: return (
        <div>
          {/* Hero */}
          <div className="home-hero">
            <h2>HealthCare AI Platform</h2>
            <p>
              Multi-modal clinical intelligence dashboard powered by machine learning,
              natural language processing, and evidence-based medicine.
              Now featuring <strong>15 AI modules</strong>.
            </p>
          </div>

          {/* Module Grid */}
          <div className="module-grid">
            {diagnosticModules.map(mod => (
              <div
                key={mod.id}
                className="module-card"
                onClick={() => navigateTo(mod.id)}
                style={{ '--card-accent': mod.color }}
              >
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div
                    className="module-card-icon"
                    style={{ background: mod.bg, color: mod.color }}
                  >
                    {React.cloneElement(mod.icon, { size: 24 })}
                  </div>
                  <h3>{mod.label}</h3>
                  <p>{mod.description}</p>
                </div>
                <div className="module-card-arrow">
                  <ArrowRight size={18} />
                </div>
                <style>{`
                  .module-card:hover::before {
                    background: ${mod.gradient} !important;
                  }
                `}</style>
              </div>
            ))}
          </div>

          {/* Platform Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            marginTop: '40px',
          }}>
            {[
              { label: 'AI Modules', value: '15', sub: 'Active' },
              { label: 'Conditions', value: '50+', sub: 'Supported' },
              { label: 'ML Models', value: '3', sub: 'Deep Learning' },
              { label: 'Drug Pairs', value: '50+', sub: 'Interactions DB' },
            ].map((stat, i) => (
              <div key={i} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--accent-primary)' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }
  };

  // Group sidebar items by section
  let lastSection = null;

  return (
    <div className="app-layout">
      {/* Mobile Header */}
      <div className="mobile-header">
        <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
          <Menu size={24} />
        </button>
        <span style={{ fontWeight: 700, fontSize: '16px' }}>HealthCare AI</span>
      </div>

      {/* Sidebar Overlay (mobile) */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <Activity size={22} />
          </div>
          <div>
            <h1>HealthCare AI</h1>
            <span>Clinical Dashboard</span>
          </div>
          {/* Mobile close */}
          <button
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen(false)}
            style={{ marginLeft: 'auto', display: sidebarOpen ? 'block' : 'none' }}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {MODULES.map(mod => {
            const showSection = mod.section !== lastSection && SECTION_LABELS[mod.section];
            lastSection = mod.section;

            return (
              <React.Fragment key={mod.id}>
                {showSection && (
                  <div className="sidebar-section-label">{SECTION_LABELS[mod.section]}</div>
                )}
                <button
                  className={`sidebar-item ${activeTab === mod.id ? 'active' : ''}`}
                  onClick={() => navigateTo(mod.id)}
                  style={{
                    '--item-color': mod.color || 'var(--accent-primary)',
                  }}
                >
                  <div
                    className="nav-icon"
                    style={{
                      background: activeTab === mod.id ? (mod.bg || 'rgba(99, 102, 241, 0.1)') : 'transparent',
                      color: activeTab === mod.id ? (mod.color || 'var(--accent-primary)') : 'inherit',
                    }}
                  >
                    {mod.icon}
                  </div>
                  {mod.label}
                </button>
              </React.Fragment>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          AI-powered clinical support tool<br />
          <span style={{ opacity: 0.6 }}>For educational purposes only</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="main-header">
          <div>
            <div className="main-header-title">
              {activeModule?.label || 'Dashboard'}
            </div>
            <div className="main-header-subtitle">
              {activeTab === 'home'
                ? 'Overview of all 15 AI modules'
                : activeModule?.description || ''}
            </div>
          </div>
          {activeTab !== 'home' && (
            <button
              className="btn-outline"
              onClick={() => setActiveTab('home')}
              style={{ fontSize: '13px', padding: '8px 16px' }}
            >
              <LayoutDashboard size={14} /> All Modules
            </button>
          )}
        </header>

        <div className="main-body">
          <Suspense fallback={<div style={{padding: '2rem', textAlign: 'center'}}><div className="loader" style={{margin: '0 auto'}}></div><p style={{marginTop: '1rem', opacity: 0.7}}>Loading Module...</p></div>}>
            {renderContent()}
          </Suspense>
        </div>
      </main>
    </div>
  );
}

export default App;
