import { useState } from 'react';
import { experienceAPI } from '../api/career';
import type { UserExperience } from '../api/career';

interface AddExperienceFormProps {
  onExperienceAdded: (exp: UserExperience) => void;
}

export default function AddExperienceForm({ onExperienceAdded }: AddExperienceFormProps) {
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    description: '',
    start_date: '',
    end_date: '',
    level_at_position: 'junior' as const,
    technologies: '',
    current_job: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const exp = await experienceAPI.add({
        company: formData.company,
        position: formData.position,
        description: formData.description || undefined,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: formData.current_job ? undefined : new Date(formData.end_date).toISOString(),
        level_at_position: formData.level_at_position,
        technologies: formData.technologies || undefined,
      });

      onExperienceAdded(exp);
      setFormData({
        company: '',
        position: '',
        description: '',
        start_date: '',
        end_date: '',
        level_at_position: 'junior',
        technologies: '',
        current_job: false,
      });
      setShowForm(false);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error adding experience');
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: '500',
          marginBottom: '1rem',
        }}
      >
        ➕ Add Experience
      </button>
    );
  }

  return (
    <div
      style={{
        background: '#f8f9fa',
        border: '2px solid #e0e0e0',
        borderRadius: '8px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>💼 Add Work Experience</h3>

      {error && (
        <div
          style={{
            background: '#f8d7da',
            color: '#721c24',
            padding: '0.75rem',
            borderRadius: '8px',
            marginBottom: '1rem',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Company */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Company *
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="e.g., Google, Microsoft"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem',
              }}
            />
          </div>

          {/* Position */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Position *
            </label>
            <input
              type="text"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              placeholder="e.g., Senior Developer, Product Manager"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem',
              }}
            />
          </div>

          {/* Level at Position */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Your Level at This Position
            </label>
            <select
              value={formData.level_at_position}
              onChange={(e) => setFormData({ ...formData, level_at_position: e.target.value as any })}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem',
              }}
            >
              <option value="junior">🌱 Junior</option>
              <option value="middle">⭐ Middle</option>
              <option value="senior">🚀 Senior</option>
              <option value="team_lead">👑 Team Lead</option>
            </select>
          </div>

          {/* Technologies */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Technologies Used
            </label>
            <input
              type="text"
              value={formData.technologies}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
              placeholder="e.g., Python, React, PostgreSQL, Docker"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem',
              }}
            />
          </div>

          {/* Start Date */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Start Date *
            </label>
            <input
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem',
              }}
            />
          </div>

          {/* Current Job Checkbox */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              id="current_job"
              checked={formData.current_job}
              onChange={(e) => setFormData({ ...formData, current_job: e.target.checked })}
              style={{ cursor: 'pointer' }}
            />
            <label htmlFor="current_job" style={{ cursor: 'pointer', fontWeight: '500' }}>
              I currently work here
            </label>
          </div>

          {/* End Date */}
          {!formData.current_job && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                End Date *
              </label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                required={!formData.current_job}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '1rem',
                }}
              />
            </div>
          )}

          {/* Description */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Description (optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What did you accomplish? Key projects?"
              rows={3}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical',
              }}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '0.75rem',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? '💾 Adding...' : '✅ Add Experience'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              style={{
                flex: 1,
                background: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '0.75rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
              }}
            >
              ❌ Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
