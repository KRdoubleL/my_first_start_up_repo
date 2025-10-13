import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../api/auth';
import { skillsAPI, experienceAPI} from '../api/career';
import type { UserSkill } from '../api/career';
import type { UserExperience } from '../api/career';
import Header from '../components/Header';
import AddSkillForm from '../components/AddSkillForm';
import AddExperienceForm from '../components/AddExperienceForm';

type Tab = 'profile' | 'skills' | 'experience';

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    bio: user?.bio || '',
    location: user?.location || '',
    skills: user?.skills?.join(', ') || '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Skills & Experience
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [experience, setExperience] = useState<UserExperience[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [expLoading, setExpLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        bio: user.bio || '',
        location: user.location || '',
        skills: user.skills?.join(', ') || '',
      });
    }
  }, [user]);

  // Load skills when tab changes
  useEffect(() => {
    if (activeTab === 'skills') {
      loadSkills();
    }
  }, [activeTab]);

  // Load experience when tab changes
  useEffect(() => {
    if (activeTab === 'experience') {
      loadExperience();
    }
  }, [activeTab]);

  const loadSkills = async () => {
    setSkillsLoading(true);
    try {
      const data = await skillsAPI.getAll();
      setSkills(data);
    } catch (error) {
      console.error('Error loading skills:', error);
    } finally {
      setSkillsLoading(false);
    }
  };

  const loadExperience = async () => {
    setExpLoading(true);
    try {
      const data = await experienceAPI.getAll();
      setExperience(data);
    } catch (error) {
      console.error('Error loading experience:', error);
    } finally {
      setExpLoading(false);
    }
  };

  const handleDeleteSkill = async (skillId: number) => {
    if (!window.confirm('Delete this skill?')) return;
    try {
      await skillsAPI.delete(skillId);
      setSkills(skills.filter(s => s.id !== skillId));
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };

  const handleDeleteExperience = async (expId: number) => {
    if (!window.confirm('Delete this experience?')) return;
    try {
      await experienceAPI.delete(expId);
      setExperience(experience.filter(e => e.id !== expId));
    } catch (error) {
      console.error('Error deleting experience:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await authAPI.updateProfile({
        full_name: formData.full_name || null,
        bio: formData.bio || null,
        location: formData.location || null,
      });

      setMessage('✅ Profile updated successfully!');
      setIsEditing(false);
      window.location.reload();
    } catch (error: any) {
      setMessage('❌ Error: ' + (error.response?.data?.detail || 'Failed to update profile'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        bio: user.bio || '',
        location: user.location || '',
        skills: user.skills?.join(', ') || '',
      });
    }
    setMessage('');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <Header />

      <div style={{
        maxWidth: '900px',
        margin: '3rem auto',
        padding: '0 1rem',
      }}>
        {/* Tabs Navigation */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          borderBottom: '2px solid #e0e0e0',
        }}>
          {(['profile', 'skills', 'experience'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '1rem 1.5rem',
                background: activeTab === tab ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                color: activeTab === tab ? 'white' : '#666',
                border: 'none',
                borderBottom: activeTab === tab ? '3px solid #667eea' : 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: activeTab === tab ? 'bold' : '500',
                transition: 'all 0.2s',
              }}
            >
              {tab === 'profile' && '👤 Profile'}
              {tab === 'skills' && '🎯 Skills'}
              {tab === 'experience' && '💼 Experience'}
            </button>
          ))}
        </div>

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
            padding: '2rem',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem',
              paddingBottom: '1rem',
              borderBottom: '2px solid #f0f0f0',
            }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333', margin: 0 }}>
                👤 My Profile
              </h1>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '500',
                  }}
                >
                  ✏️ Edit Profile
                </button>
              )}
            </div>

            {message && (
              <div style={{
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                background: message.includes('✅') ? '#d4edda' : '#f8d7da',
                color: message.includes('✅') ? '#155724' : '#721c24',
                border: `1px solid ${message.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
              }}>
                {message}
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#555' }}>
                      📧 Email
                    </label>
                    <input
                      type="email"
                      value={user?.email}
                      disabled
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        background: '#f5f5f5',
                        color: '#999',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#555' }}>
                      👤 Username
                    </label>
                    <input
                      type="text"
                      value={user?.username}
                      disabled
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        background: '#f5f5f5',
                        color: '#999',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#555' }}>
                      🏷️ Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      placeholder="John Doe"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '1rem',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#555' }}>
                      📍 Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="San Francisco, CA"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '1rem',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#555' }}>
                      📝 Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                      rows={4}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontFamily: 'inherit',
                        resize: 'vertical',
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
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
                      {loading ? '💾 Saving...' : '💾 Save Changes'}
                    </button>

                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={loading}
                      style={{
                        flex: 1,
                        background: '#6c757d',
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
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.9rem', color: '#888', marginBottom: '0.25rem' }}>📧 Email</div>
                  <div style={{ fontSize: '1.1rem', color: '#333', fontWeight: '500' }}>{user?.email}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.9rem', color: '#888', marginBottom: '0.25rem' }}>👤 Username</div>
                  <div style={{ fontSize: '1.1rem', color: '#333', fontWeight: '500' }}>{user?.username}</div>
                </div>

                {user?.full_name && (
                  <div>
                    <div style={{ fontSize: '0.9rem', color: '#888', marginBottom: '0.25rem' }}>🏷️ Full Name</div>
                    <div style={{ fontSize: '1.1rem', color: '#333', fontWeight: '500' }}>{user.full_name}</div>
                  </div>
                )}

                {user?.location && (
                  <div>
                    <div style={{ fontSize: '0.9rem', color: '#888', marginBottom: '0.25rem' }}>📍 Location</div>
                    <div style={{ fontSize: '1.1rem', color: '#333', fontWeight: '500' }}>{user.location}</div>
                  </div>
                )}

                {user?.bio && (
                  <div>
                    <div style={{ fontSize: '0.9rem', color: '#888', marginBottom: '0.25rem' }}>📝 Bio</div>
                    <div style={{ fontSize: '1rem', color: '#555', lineHeight: '1.6' }}>{user.bio}</div>
                  </div>
                )}

                <div>
                  <div style={{ fontSize: '0.9rem', color: '#888', marginBottom: '0.25rem' }}>📅 Member Since</div>
                  <div style={{ fontSize: '1rem', color: '#555' }}>
                    {new Date(user?.created_at || '').toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SKILLS TAB */}
        {activeTab === 'skills' && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
            padding: '2rem',
          }}>
            <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>🎯 My Skills</h2>

            <AddSkillForm onSkillAdded={(skill) => {
              setSkills([...skills, skill]);
            }} />

            {skillsLoading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>Loading skills...</div>
            ) : skills.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                No skills yet. Add your first skill! 👆
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {skills.map(skill => (
                  <div
                    key={skill.id}
                    style={{
                      background: '#f8f9fa',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      padding: '1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{skill.skill_name}</h4>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: '#666' }}>
                        <span>Level: {skill.level}</span>
                        <span>Experience: {skill.years_experience} years</span>
                      </div>
                      {skill.description && (
                        <p style={{ margin: '0.5rem 0 0 0', color: '#555' }}>{skill.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteSkill(skill.id)}
                      style={{
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* EXPERIENCE TAB */}
        {activeTab === 'experience' && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
            padding: '2rem',
          }}>
            <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>💼 Work Experience</h2>

            <AddExperienceForm onExperienceAdded={(exp) => {
              setExperience([...experience, exp]);
            }} />

            {expLoading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>Loading experience...</div>
            ) : experience.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                No work experience yet. Add your first job! 👆
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {experience.map(exp => (
                  <div
                    key={exp.id}
                    style={{
                      background: '#f8f9fa',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      padding: '1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>{exp.position}</h4>
                      <p style={{ margin: '0 0 0.5rem 0', color: '#666' }}>@ {exp.company}</p>
                      <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                        {new Date(exp.start_date).toLocaleDateString()} 
                        {' - '}
                        {exp.end_date ? new Date(exp.end_date).toLocaleDateString() : 'Present'}
                      </div>
                      {exp.level_at_position && (
                        <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                          Level: {exp.level_at_position}
                        </div>
                      )}
                      {exp.technologies && (
                        <div style={{ fontSize: '0.9rem', color: '#555' }}>
                          Tech: {exp.technologies}
                        </div>
                      )}
                      {exp.description && (
                        <p style={{ margin: '0.5rem 0 0 0', color: '#555' }}>{exp.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteExperience(exp.id)}
                      style={{
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}