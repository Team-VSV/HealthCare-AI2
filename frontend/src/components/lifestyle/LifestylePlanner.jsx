import React, { useState } from 'react';
import axios from 'axios';
import { Salad, Activity, AlertTriangle, ChevronRight } from 'lucide-react';

const API_URL = 'http://localhost:8000/api/plan/lifestyle';

const CONDITION_OPTIONS = [
  { value: 'Hypertension', label: '🫀 Hypertension (High Blood Pressure)' },
  { value: 'Type 2 Diabetes', label: '🍬 Type 2 Diabetes' },
  { value: 'Coronary Artery Disease', label: '❤️ Coronary Artery Disease' },
  { value: 'General', label: '🌿 General Wellness' },
];

const DAY_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#0ea5e9', '#64748b'];

const EXERCISE_TYPE_COLORS = {
  Aerobic: '#0ea5e9',
  Strength: '#8b5cf6',
  Flexibility: '#10b981',
  Balance: '#f59e0b',
  Recovery: '#64748b',
  Rest: '#475569',
  'Rest/Recovery': '#64748b',
  Combined: '#ec4899',
  'Active Recreation': '#f59e0b',
  'Flexibility + Balance': '#10b981',
  'Flexibility (Light)': '#10b981',
  'Strength (Light)': '#8b5cf6',
};

export default function LifestylePlanner() {
  const [form, setForm] = useState({
    condition: 'Hypertension',
    age: '',
    sex: '',
    height_cm: '',
    weight_kg: '',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('meals');
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null); setResult(null);
    try {
      const payload = { condition: form.condition };
      if (form.age) payload.age = parseInt(form.age);
      if (form.sex) payload.sex = form.sex;
      if (form.height_cm) payload.height_cm = parseFloat(form.height_cm);
      if (form.weight_kg) payload.weight_kg = parseFloat(form.weight_kg);
      const res = await axios.post(API_URL, payload);
      if (res.data.error) throw new Error(res.data.error);
      setResult(res.data);
      setActiveDayIndex(0);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Plan generation failed.');
    }
    setLoading(false);
  };

  return (
    <div className="module-container">
      <div className="module-header" style={{ background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 50%, #4ade80 100%)' }}>
        <div className="module-header-icon"><Salad size={28} /></div>
        <div>
          <h2 className="module-header-title">Diet & Exercise Planner</h2>
          <p className="module-header-subtitle">Personalized 7-day meal plans and exercise routines for your condition</p>
        </div>
      </div>

      <div className="module-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Health Condition / Goal</label>
            <select className="form-select" value={form.condition} onChange={e => set('condition', e.target.value)}>
              {CONDITION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
            {[
              { key: 'age', label: 'Age', type: 'number', placeholder: 'e.g., 45' },
              { key: 'sex', label: 'Sex', type: 'select', options: [{ v: '', l: 'Not specified' }, { v: 'male', l: 'Male' }, { v: 'female', l: 'Female' }] },
              { key: 'height_cm', label: 'Height (cm)', type: 'number', placeholder: 'e.g., 170' },
              { key: 'weight_kg', label: 'Weight (kg)', type: 'number', placeholder: 'e.g., 75' },
            ].map(field => (
              <div key={field.key} className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">{field.label} (optional)</label>
                {field.type === 'select' ? (
                  <select className="form-select" value={form[field.key]} onChange={e => set(field.key, e.target.value)}>
                    {field.options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                  </select>
                ) : (
                  <input className="form-input" type="number" placeholder={field.placeholder}
                    value={form[field.key]} onChange={e => set(field.key, e.target.value)} />
                )}
              </div>
            ))}
          </div>

          <button type="submit" disabled={loading} className="btn-primary"
            style={{ background: 'linear-gradient(135deg, #16a34a, #22c55e)', width: '100%' }}>
            {loading ? <><Activity className="spin-icon" size={20} /> Generating Plan...</> : <><Salad size={20} /> Generate My 7-Day Plan</>}
          </button>
        </form>

        {error && <div className="result-error"><AlertTriangle size={20} /><span>{error}</span></div>}

        {result && (
          <div className="results-section" style={{ animation: 'fadeSlideUp 0.5s ease-out' }}>
            {/* Plan Info Header */}
            <div style={{
              padding: '16px 20px', marginBottom: '20px',
              background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)',
              borderRadius: 'var(--radius-lg)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>
                    Personalized Plan
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    {result.meal_plan.diet_name}
                  </h3>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#22c55e' }}>{result.meal_plan.daily_calories}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Daily Caloric Target</div>
                  {result.bmi && <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>BMI: {result.bmi} kg/m²</div>}
                </div>
              </div>
              {result.meal_plan.calorie_note && (
                <div style={{ fontSize: '12px', color: '#16a34a', marginTop: '8px', fontStyle: 'italic' }}>
                  {result.meal_plan.calorie_note}
                </div>
              )}
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
              {[
                { id: 'meals', label: '🍽️ Meal Plan' },
                { id: 'exercise', label: '🏃 Exercise Plan' },
                { id: 'principles', label: '📋 Guidelines' },
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                  padding: '8px 16px', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer',
                  background: activeTab === tab.id ? 'linear-gradient(135deg, #16a34a, #22c55e)' : 'var(--bg-card-hover)',
                  color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
                  fontWeight: 600, fontSize: '13px', fontFamily: 'inherit', transition: 'all 0.2s',
                }}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Meal Plan Tab */}
            {activeTab === 'meals' && (
              <div>
                <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
                  {result.meal_plan.weekly_plan?.map((day, i) => (
                    <button key={i} onClick={() => setActiveDayIndex(i)} style={{
                      padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer',
                      background: activeDayIndex === i ? DAY_COLORS[i] : 'var(--bg-card-hover)',
                      color: activeDayIndex === i ? 'white' : 'var(--text-secondary)',
                      fontWeight: 600, fontSize: '12px', fontFamily: 'inherit', transition: 'all 0.2s',
                    }}>
                      {day.day.slice(0, 3)}
                    </button>
                  ))}
                </div>

                {result.meal_plan.weekly_plan?.[activeDayIndex] && (
                  <div style={{ animation: 'fadeSlideUp 0.3s ease-out' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: 700, color: DAY_COLORS[activeDayIndex], marginBottom: '14px' }}>
                      {result.meal_plan.weekly_plan[activeDayIndex].day}
                    </h4>
                    {['breakfast', 'lunch', 'dinner', 'snacks'].map(meal => (
                      <div key={meal} style={{
                        padding: '12px 16px', marginBottom: '10px',
                        background: 'var(--bg-card-hover)', borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-default)',
                        borderLeft: `3px solid ${DAY_COLORS[activeDayIndex]}`,
                      }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: DAY_COLORS[activeDayIndex], marginBottom: '4px' }}>
                          {meal.charAt(0).toUpperCase() + meal.slice(1)}
                        </div>
                        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                          {result.meal_plan.weekly_plan[activeDayIndex][meal]}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Foods to Emphasize / Avoid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '20px' }}>
                  {[
                    { title: '✅ Foods to Emphasize', items: result.meal_plan.foods_to_emphasize, color: '#10b981' },
                    { title: '❌ Foods to Avoid', items: result.meal_plan.foods_to_avoid, color: '#ef4444' },
                  ].map((section, i) => (
                    <div key={i} style={{
                      padding: '14px', background: `${section.color}08`,
                      border: `1px solid ${section.color}20`, borderRadius: 'var(--radius-md)',
                    }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: section.color, marginBottom: '10px' }}>{section.title}</div>
                      {section.items?.map((item, j) => (
                        <div key={j} style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                          <ChevronRight size={12} style={{ flexShrink: 0, marginTop: '3px', color: section.color }} />
                          {item}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Exercise Plan Tab */}
            {activeTab === 'exercise' && (
              <div>
                <div style={{
                  padding: '14px 16px', marginBottom: '16px',
                  background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)',
                  borderRadius: 'var(--radius-sm)',
                }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#2563eb', marginBottom: '4px' }}>Weekly Goal</div>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>{result.exercise_plan.weekly_goal}</div>
                </div>

                {result.exercise_plan.routine?.map((day, i) => {
                  const typeColor = EXERCISE_TYPE_COLORS[day.type] || '#6366f1';
                  return (
                    <div key={i} style={{
                      padding: '14px 16px', marginBottom: '10px',
                      background: 'var(--bg-card-hover)', borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-default)',
                      animation: `fadeSlideUp 0.3s ease-out ${i * 60}ms both`,
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <div>
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '15px' }}>{day.day}</span>
                          <span style={{
                            marginLeft: '8px', padding: '2px 8px', borderRadius: '10px',
                            background: `${typeColor}18`, color: typeColor, fontSize: '11px', fontWeight: 600,
                          }}>{day.type}</span>
                        </div>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>{day.duration}</span>
                      </div>
                      <div style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '4px' }}>{day.activity}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Intensity: {day.intensity}</div>
                      {day.notes && (
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', fontStyle: 'italic' }}>
                          💡 {day.notes}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Principles Tab */}
            {activeTab === 'principles' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ padding: '16px', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#22c55e', marginBottom: '12px' }}>🥗 Dietary Key Principles</div>
                  {result.meal_plan.key_principles?.map((p, i) => (
                    <div key={i} style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px', display: 'flex', gap: '8px' }}>
                      <span style={{ color: '#22c55e', flexShrink: 0 }}>{i + 1}.</span>{p}
                    </div>
                  ))}
                </div>
                <div style={{ padding: '16px', background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#2563eb', marginBottom: '12px' }}>🏋️ Exercise Key Notes</div>
                  {result.exercise_plan.key_notes?.map((n, i) => (
                    <div key={i} style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px', display: 'flex', gap: '8px' }}>
                      <span style={{ color: '#2563eb', flexShrink: 0 }}>•</span>{n}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="disclaimer-box" style={{ marginTop: '20px' }}>
              <AlertTriangle size={16} /><span>{result.disclaimer}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
