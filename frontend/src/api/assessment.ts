import api from './client';

export interface AssessmentQuestion {
  id: number;
  assessment_type: string;
  category: string;
  question_text: string;
  difficulty: string;
  options: Array<{
    id: string;
    text: string;
  }>;
}

export interface AssessmentAnswer {
  question_id: number;
  user_answer: string;
}

export interface AssessmentSubmission {
  assessment_type: string;
  answers: AssessmentAnswer[];
  time_taken_seconds?: number;
}

export interface AssessmentResult {
  id: number;
  user_id: number;
  assessment_type: string;
  total_questions: number;
  correct_answers: number;
  total_score: number;
  determined_level: string;
  recommendations?: string;
  strengths?: string[];
  weaknesses?: string[];
  time_taken_seconds?: number;
  xp_earned: number;
  completed_at: string;
}

export interface UserProgress {
  id: number;
  user_id: number;
  total_xp: number;
  current_level: number;
  xp_to_next_level: number;
  current_streak: number;
  longest_streak: number;
  achievements: Array<{
    id: string;
    name: string;
    description?: string;
    earned_at: string;
  }>;
  assessments_completed: number;
  skills_mastered: number;
  career_paths_completed: number;
}

export const assessmentAPI = {
  getQuestions: async (assessmentType: string = 'general'): Promise<AssessmentQuestion[]> => {
    const response = await api.get(`/assessment/questions?assessment_type=${assessmentType}`);
    return response.data;
  },

  submitAssessment: async (submission: AssessmentSubmission): Promise<AssessmentResult> => {
    const response = await api.post('/assessment/submit', submission);
    return response.data;
  },

  getResults: async (): Promise<AssessmentResult[]> => {
    const response = await api.get('/assessment/results');
    return response.data;
  },

  getProgress: async (): Promise<UserProgress> => {
    const response = await api.get('/assessment/progress');
    return response.data;
  },
};