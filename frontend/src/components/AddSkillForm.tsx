import { useState } from 'react';
import { skillsAPI } from '../api/career';
import type { UserSkill } from '../api/career';

interface AddSkillFormProps {
  onSkillAdded: (skill: UserSkill) => void;
}

export default function AddSkillForm({ onSkillAdded }: AddSkillFormProps) {
  const [formData, setFormData] = useState({
    skill_name: '',
    level: 'intermediate' as const,
    years_experience: 0,
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const skill = await skillsAPI.add({
        skill_name: formData.skill_name,
        level: formData.level,
        years_experience: Number(formData.years_experience),
        description: formData.description || undefined,
      });

      onSkillAdded(skill);
      setFormData({
        skill_name: '',
        level: 'intermediate',
        years_experience: 0,
        description: '',
      });
      setShowForm(false);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error adding skill');
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
        ➕ Add Skill
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
      <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>🎯 Add New Skill</h3>

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
          {/* Skill Name */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Skill Name *
            </label>
            <input
              type="text"
              value={formData.skill_name}
              onChange={(e) => setFormData({ ...formData, skill_name: e.target.value })}
              placeholder="e.g., Python, React, Docker"
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

          {/* Level */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Level *
            </label>
            <select
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem',
              }}
            >
              <option value="beginner">🌱 Beginner</option>
              <option value="elementary">📚 Elementary</option>
              <option value="intermediate">⭐ Intermediate</option>
              <option value="advanced">🚀 Advanced</option>
              <option value="expert">👑 Expert</option>
            </select>
          </div>

          {/* Years Experience */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Years of Experience *
            </label>
            <input
              type="number"
              min="0"
              max="50"
              step="0.5"
              value={formData.years_experience}
              onChange={(e) =>
                setFormData({ ...formData, years_experience: Number(e.target.value) })
              }
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '1rem',
              }}
            />
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Description (optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Where did you use this skill? Any projects?"
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
              {loading ? '💾 Adding...' : '✅ Add Skill'}
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
