// hooks/useProjects.ts
import { useState, useEffect } from 'react';
import { Project } from '@/lib/types';
import { calculateProjectStatus } from '@/lib/utils';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/projects');
      if (!response.ok) throw new Error('Failed to fetch projects');

      const data = await response.json();

      // Update project statuses based on current date
      const projectsWithStatus = data.map((project: Project) => ({
        ...project,
        status: calculateProjectStatus(project),
      }));

      setProjects(projectsWithStatus);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (
    project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });

      if (!response.ok) throw new Error('Failed to create project');

      const newProject = await response.json();
      await fetchProjects(); // Refresh the list
      return newProject;
    } catch (err) {
      throw new Error('Failed to create project');
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update project');

      await fetchProjects(); // Refresh the list
    } catch (err) {
      throw new Error('Failed to update project');
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete project');

      await fetchProjects(); // Refresh the list
    } catch (err) {
      throw new Error('Failed to delete project');
    }
  };

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  };
}
