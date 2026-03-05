import { useFetch } from './useFetch';
import type { Experience } from '../lib/types';

export function useExperience() {
  const { data: experience, loading, error } = useFetch<Experience>('experience', 'year_start', false);
  return { experience, loading, error };
}
