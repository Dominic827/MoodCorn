import { create } from 'zustand';
import type { ContentType, Filters, RecommendResult } from '../types';

interface SelectionState {
  contentType: ContentType;
  moods: string[];
  moodWeights: Record<string, number>;
  useCustomWeights: boolean;
  selectedGenre: string | null;
  filters: Filters;
  recommendations: RecommendResult[];
  isLoading: boolean;
  error: string | null;

  setContentType: (type: ContentType) => void;
  addMood: (mood: string) => void;
  removeMood: (mood: string) => void;
  updateMood: (index: number, mood: string) => void;
  setMoodWeight: (mood: string, weight: number) => void;
  setUseCustomWeights: (val: boolean) => void;
  setSelectedGenre: (genre: string | null) => void;
  setFilters: (filters: Partial<Filters>) => void;
  setRecommendations: (recs: RecommendResult[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetFilters: () => void;
}

const defaultFilters: Filters = {
  minRating: 0,
  yearMin: 1970,
  yearMax: 2025,
  runtimeMin: 0,
  runtimeMax: 300,
  language: '',
  country: '',
};

export const useSelectionStore = create<SelectionState>((set, get) => ({
  contentType: 'movie',
  moods: ['Happy'],
  moodWeights: { Happy: 100 },
  useCustomWeights: false,
  selectedGenre: null,
  filters: defaultFilters,
  recommendations: [],
  isLoading: false,
  error: null,

  setContentType: (type) => set({ contentType: type }),

  addMood: (mood) => {
    const { moods } = get();
    if (moods.includes(mood) || moods.length >= 4) return;
    const newMoods = [...moods, mood];
    const equalWeight = Math.floor(100 / newMoods.length);
    const remainder = 100 - equalWeight * newMoods.length;
    const newWeights: Record<string, number> = {};
    newMoods.forEach((m, i) => {
      newWeights[m] = equalWeight + (i === 0 ? remainder : 0);
    });
    set({ moods: newMoods, moodWeights: newWeights });
  },

  removeMood: (mood) => {
    const { moods } = get();
    if (moods.length <= 1) return;
    const newMoods = moods.filter((m) => m !== mood);
    const equalWeight = Math.floor(100 / newMoods.length);
    const remainder = 100 - equalWeight * newMoods.length;
    const newWeights: Record<string, number> = {};
    newMoods.forEach((m, i) => {
      newWeights[m] = equalWeight + (i === 0 ? remainder : 0);
    });
    set({ moods: newMoods, moodWeights: newWeights });
  },

  updateMood: (index, mood) => {
    const { moods, moodWeights } = get();
    if (moods.includes(mood)) return;
    const newMoods = [...moods];
    const oldMood = newMoods[index];
    newMoods[index] = mood;
    const newWeights = { ...moodWeights };
    if (oldMood in newWeights) {
      newWeights[mood] = newWeights[oldMood];
      delete newWeights[oldMood];
    }
    set({ moods: newMoods, moodWeights: newWeights });
  },

  setMoodWeight: (mood, weight) => {
    const { moods, moodWeights } = get();
    const otherMoods = moods.filter((m) => m !== mood);
    const remaining = 100 - weight;
    const newWeights: Record<string, number> = { ...moodWeights, [mood]: weight };
    if (otherMoods.length > 0) {
      const perOther = Math.floor(remaining / otherMoods.length);
      const rem = remaining - perOther * otherMoods.length;
      otherMoods.forEach((m, i) => {
        newWeights[m] = perOther + (i === 0 ? rem : 0);
      });
    }
    set({ moodWeights: newWeights });
  },

  setUseCustomWeights: (val) => set({ useCustomWeights: val }),
  setSelectedGenre: (genre) => set({ selectedGenre: genre }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  setRecommendations: (recs) => set({ recommendations: recs }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  resetFilters: () => set({ filters: defaultFilters }),
}));
