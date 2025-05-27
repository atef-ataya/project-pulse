'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, BarChart3, Bell, Calendar, CheckCircle, Clock, TrendingUp, Users } from 'lucide-react';
import { MOCK_PROJECTS, MOCK_CURRENT_USER, MOCK_NOTIFICATIONS } from '@/lib/mock-data';
import { calculateProjectStatus, shouldShowDeadlineWarning } from '@/lib/utils';
import { Project } from '@/lib/types';
import './globals.css';

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  useEffect(() => {
    // Update project statuses based on current date
    const updatedProjects = MOCK_PROJECTS.map(project => ({
      ...project,
      status: calculateProjectStatus(project)
    }));
    setProjects(updatedProjects);
  }, []);

  // Calculate statistics
  const stats = {
    total: projects.length,
    inProgress: projects.filter(p => p.status === 'in-progress').length,
    completed: projects.filter(p => p.status === 'completed').length,
    delayed: projects.filter(p => p.status === 'delayed').length,
    upcoming: projects.filter(p => p.status === 'upcoming').length,
    highPriority: projects.filter(p => p.priority === 'high').length,
    avgCompletion: Math.round(projects.reduce((acc, p) => acc + p.percentComplete, 0) / projects.length),
    unreadNotifications: notifications?.filter((n: { read: any; }) => !n.read).length ?? 0,
  };

  // Get recent projects
  const recentProjects = projects
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  // Get projects needing attention (delayed or deadline approaching)
  const projectsNeedingAttention = projects.filter(p => 
    p.status === 'delayed' || shouldShowDeadlineWarning(p.endDate, p.percentComplete)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Project Pulse</h1>
              <span className="ml-3 text-sm text-gray-500">Welcome back, {MOCK_CURRENT_USER?.name ?? 'Guest'}</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-500">
                <Bell className="h-6 w-6" />
                {stats.unreadNotifications > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                    {stats.unreadNotifications}
                  </span>
                )}
              </button>
              <Link
                href="/projects/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                New Project
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
          <p className="text-gray-600">Track your projects and stay on top of deadlines</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
              </div>
              <Clock className="h-8 w-8 text-indigo-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Completion</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgCompletion}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Alerts Section */}
        {projectsNeedingAttention.length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <Bell className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {projectsNeedingAttention.length} project{projectsNeedingAttention.length > 1 ? 's' : ''} need attention
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <ul className="list-disc list-inside">
                    {projectsNeedingAttention.map(project => (
                      <li key={project.id}>
                        <Link href={`/projects/${project.id}`} className="font-medium hover:underline">
                          {project.projectName}
                        </Link>
                        {' - '}
                        {project.status === 'delayed' ? 'Delayed' : 'Deadline approaching'}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Projects */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Projects</h3>
            <Link href="/projects" className="text-sm text-blue-600 hover:text-blue-500 flex items-center">
              View all projects
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentProjects.map(project => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-lg font-medium text-gray-900">{project.projectName}</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${project.priority === 'high' ? 'bg-red-100 text-red-800' : 
                        project.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'}`}>
                      {project.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">{project.department}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      {project.projectManager}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(project.endDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{project.percentComplete}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${project.percentComplete}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/projects/new"
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow text-center"
          >
            <div className="text-blue-600 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Create New Project</h3>
            <p className="text-sm text-gray-500 mt-1">Start tracking a new project</p>
          </Link>
          
          <Link
            href="/projects"
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow text-center"
          >
            <div className="text-indigo-600 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">View All Projects</h3>
            <p className="text-sm text-gray-500 mt-1">Browse and manage projects</p>
          </Link>
          
          <Link
            href="/dashboard"
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow text-center"
          >
            <div className="text-purple-600 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Analytics Dashboard</h3>
            <p className="text-sm text-gray-500 mt-1">View detailed analytics</p>
          </Link>
        </div>
      </main>
    </div>
  );
}