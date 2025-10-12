import api from './client';

export interface Job {
  job_id: string;
  title: string;
  company: string;
  location: string | null;
  salary_min: number | null;
  salary_max: number | null;
  currency: string;
  description: string | null;
  required_skills: string[];
  match_percentage?: number;
  source: string | null;
  external_url: string | null;
}

export interface SavedJob extends Job {
  id: number;
  saved_at: string;
}

export interface JobSearchParams {
  skills: string[];
  location?: string;
  min_match_percentage?: number;
}

export const jobsAPI = {
  searchJobs: async (params: JobSearchParams): Promise<Job[]> => {
    const response = await api.post('/jobs/search', {
      skills: params.skills,
      location: params.location || 'Germany',
      min_match_percentage: params.min_match_percentage || 0,
    });
    return response.data;
  },

  saveJob: async (job: Job): Promise<SavedJob> => {
    const response = await api.post('/jobs/saved', job);
    return response.data;
  },

  getSavedJobs: async (): Promise<SavedJob[]> => {
    const response = await api.get('/jobs/saved');
    return response.data;
  },

  unsaveJob: async (jobId: number): Promise<void> => {
    await api.delete(`/jobs/saved/${jobId}`);
  },

  getStats: async (skills: string[], location?: string) => {
    const response = await api.get('/jobs/stats', {
      params: {
        skills,
        location: location || 'Germany',
      },
    });
    return response.data;
  },
};