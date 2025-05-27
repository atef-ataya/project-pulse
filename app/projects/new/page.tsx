'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Project } from '@/lib/types';
import { ProjectForm } from '@/components/projects/ProjectForm';
import { Button } from '@/components/ui/Button';

export default function NewProjectPage() {
  const router = useRouter();

  const handleSubmit = (project: Project) => {
    // In a real app, this would save to a database
    // For now, we'll just redirect back to the projects page
    console.log('Creating project:', project);
    
    // Show success message (in a real app, you'd use a toast notification)
    alert('Project created successfully!');
    
    // Redirect to projects page
    router.push('/projects');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/projects">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Projects
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Project</h1>
          <ProjectForm onSubmit={handleSubmit} />
        </div>
      </main>
    </div>
  );
}