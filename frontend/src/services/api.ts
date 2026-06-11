import axios from 'axios';
import type { RecommendRequest, RecommendResult, Title } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const apiService = {
  async getMoods() {
    const { data } = await api.get('/api/moods');
    return data;
  },

  async getGenres(): Promise<string[]> {
    const { data } = await api.get<{ genres: string[] }>('/api/genres');
    return data.genres;
  },

  async getRecommendations(req: RecommendRequest): Promise<RecommendResult[]> {
    const { data } = await api.post<RecommendResult[]>('/api/recommend', req);
    return data;
  },

  async getTitle(imdbId: string): Promise<Title> {
    const { data } = await api.get<Title>(`/api/title/${imdbId}`);
    return data;
  },

  async getTrending(contentType: string = 'movie', limit: number = 20): Promise<Title[]> {
    const { data } = await api.get<Title[]>('/api/trending', {
      params: { content_type: contentType, limit }
    });
    return data;
  },

  async getTopRated(contentType: string = 'movie', limit: number = 20): Promise<Title[]> {
    const { data } = await api.get<Title[]>('/api/top-rated', {
      params: { content_type: contentType, limit }
    });
    return data;
  },

  async healthCheck() {
    const { data } = await api.get('/api/health');
    return data;
  },
};

export default apiService;
