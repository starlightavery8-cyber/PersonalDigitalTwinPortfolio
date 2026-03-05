import { useFetch } from './useFetch';
import type { Skill } from '../lib/types';

export function useSkills() {
  const { data: skills, loading, error } = useFetch<Skill>('skills', 'level', false);
  return { skills, loading, error };
}
