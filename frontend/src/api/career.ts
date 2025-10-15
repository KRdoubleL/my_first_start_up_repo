import api from './client';

// ============ SKILLS ============

export interface UserSkill {
  id: number;
  skill_name: string;
  level: string;
  years_experience: number;
  description?: string;
  last_used?: string;
  created_at: string;
}

export interface SkillCreateData {
  skill_name: string;
  level: string;
  years_experience: number;
  description?: string;
}

export const skillsAPI = {
  add: async (data: SkillCreateData) => {
    const response = await api.post('/career/skills', data);
    return response.data;
  },
  getAll: async () => {
    const response = await api.get('/career/skills');
    return response.data;
  },
  delete: async (skillId: number) => {
    await api.delete(`/career/skills/${skillId}`);
  },
};

// ============ EXPERIENCE ============

export interface UserExperience {
  id: number;
  company: string;
  position: string;
  description?: string;
  start_date: string;
  end_date?: string;
  level_at_position?: string;
  technologies?: string;
  created_at: string;
}

export interface ExperienceCreateData {
  company: string;
  position: string;
  description?: string;
  start_date: string;
  end_date?: string;
  level_at_position?: string;
  technologies?: string;
}

export const experienceAPI = {
  add: async (data: ExperienceCreateData) => {
    const response = await api.post('/career/experience', data);
    return response.data;
  },
  getAll: async () => {
    const response = await api.get('/career/experience');
    return response.data;
  },
  delete: async (expId: number) => {
    await api.delete(`/career/experience/${expId}`);
  },
};
