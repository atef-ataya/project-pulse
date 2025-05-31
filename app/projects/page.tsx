// app/projects/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Project, Department, Priority, ProjectStatus } from '@/lib/types';
import { ProjectList } from '@/components/projects/ProjectList';
import { ProjectFilters } from '@/components/projects/ProjectFilters';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { ExportButton } from '@/components/projects/ExportButton';
import { useProjects } from '@/hooks/useProjects';

export default function ProjectsPage() {
  const searchParams = useSearchParams();
  const statusFromUrl = searchParams.get('status') as ProjectStatus | null;
  const { projects, loading, error } = useProjects();

  const [filters, setFilters] = useState({
    search: '',
    department: '' as Department | '',
    priority: '' as Priority | '',
    status: statusFromUrl || ('' as ProjectStatus | ''),
  });

  // Update filters when URL changes
  useEffect(() => {
    if (statusFromUrl) {
      setFilters((prev) => ({ ...prev, status: statusFromUrl }));
    }
  }, [statusFromUrl]);

  // Apply filters
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (
        filters.search &&
        !project.projectName
          .toLowerCase()
          .includes(filters.search.toLowerCase()) &&
        !project.projectManager
          .toLowerCase()
          .includes(filters.search.toLowerCase())
      ) {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-lg text-gray-600 dark:text-gray-400">
          Loading projects...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-lg text-red-600 dark:text-red-400">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link
                href="/"
                className="text-2xl font-bold text-gray-900 dark:text-white"
              >
                Project Pulse
              </Link>
              <span className="ml-3 text-lg text-gray-600 dark:text-gray-400">
                / Projects
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <ExportButton projects={filteredProjects} />
              <ThemeToggle />
              <Link href="/projects/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Projects
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            View and manage all projects across the organization
          </p>
        </div>

        <ProjectFilters
          onFilterChange={setFilters}
          initialStatus={statusFromUrl}
        />

        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredProjects.length} of {projects.length} projects
          {statusFromUrl && (
            <span className="ml-2 text-blue-600 dark:text-blue-400">
              (Filtered by status: {statusFromUrl})
            </span>
          )}
        </div>

        <ProjectList
          projects={filteredProjects}
          emptyMessage="No projects match your filters"
        />
      </main>
    </div>
  );
}
