import { useFetch } from './useFetch';
import type { Project } from '../lib/types';

export function useProjects() {
  const { data: projects, loading, error } = useFetch<Project>('projects', 'sort_order', true);
  return { projects, loading, error };
}
