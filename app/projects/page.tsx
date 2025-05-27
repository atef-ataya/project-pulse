'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Project, Department, Priority, ProjectStatus } from '@/lib/types';
import { ProjectList } from '@/components/projects/ProjectList';
import { ProjectFilters } from '@/components/projects/ProjectFilters';
import { Button } from '@/components/ui/Button';
import { MOCK_PROJECTS, MOCK_CURRENT_USER } from '@/lib/mock-data';
import { calculateProjectStatus } from '@/lib/utils';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filters, setFilters] = useState({
    search: '',
    department: '' as Department | '',
    priority: '' as Priority | '',
    status: '' as ProjectStatus | '',
  });

  useEffect(() => {
    // Update project statuses and filter based on user role
    let updatedProjects = MOCK_PROJECTS.map(project => ({
      ...project,
      status: calculateProjectStatus(project)
    }));

    // Filter based on user role
    if (MOCK_CURRENT_USER.role === 'department' && MOCK_CURRENT_USER.department) {
      updatedProjects = updatedProjects.filter(p => p.department === MOCK_CURRENT_USER.department);
    } else if (MOCK_CURRENT_USER.role === 'project' && MOCK_CURRENT_USER.assignedProjects) {
      updatedProjects = updatedProjects.filter(p => MOCK_CURRENT_USER.assignedProjects?.includes(p.id));
    }

    setProjects(updatedProjects);
  }, []);

  // Apply filters
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      if (filters.search && !project.projectName.toLowerCase().includes(filters.search.toLowerCase()) &&
          !project.projectManager.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.department && project.department !== filters.department) {
        return false;
      }
      if (filters.priority && project.priority !== filters.priority) {
        return false;
      }
      if (filters.status && project.status !== filters.status) {
        return false;
      }
      return true;
    });
  }, [projects, filters]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                Project Pulse
              </Link>
              <span className="ml-3 text-lg text-gray-600">/ Projects</span>
            </div>
            <Link href="/projects/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-2">
            {MOCK_CURRENT_USER.role === 'admin' 
              ? 'View and manage all projects across the organization'
              : MOCK_CURRENT_USER.role === 'department'
              ? `Projects in ${MOCK_CURRENT_USER.department} department`
              : 'Your assigned projects'}
          </p>
        </div>

        <ProjectFilters onFilterChange={setFilters} />
        
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredProjects.length} of {projects.length} projects
        </div>

        <ProjectList 
          projects={filteredProjects} 
          emptyMessage="No projects match your filters"
        />
      </main>
    </div>
  );
}