import api from './client';

export interface UserSkill {
  id: number;
  skill_name: string;
  level: string;
}

export interface UserExperience {
  id: number;
  company: string;
  position: string;
}

export const skillsAPI = {
  getAll: async () => {
    const response = await api.get('/career/skills');
    return response.data;
  },
};

export const experienceAPI = {
  getAll: async () => {
    const response = await api.get('/career/experience');
    return response.data;
  },
};
