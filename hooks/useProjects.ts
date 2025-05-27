import { useState, useEffect } from 'react';
import { Project } from '@/lib/types';
import { MOCK_PROJECTS } from '@/lib/mock-data';
import { calculateProjectStatus } from '@/lib/utils';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Update project statuses
        const updatedProjects = MOCK_PROJECTS.map(project => ({
          ...project,
          status: calculateProjectStatus(project)
        }));
        
        setProjects(updatedProjects);
        setError(null);
      } catch (err) {
        setError('Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const createProject = async (project: Project) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      setProjects([...projects, project]);
      return project;
    } catch (err) {
      throw new Error('Failed to create project');
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      setProjects(projects.map(p => 
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      ));
    } catch (err) {
      throw new Error('Failed to update project');
    }
  };

  const deleteProject = async (id: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      setProjects(projects.filter(p => p.id !== id));
    } catch (err) {
      throw new Error('Failed to delete project');
    }
  };

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
  };
}

