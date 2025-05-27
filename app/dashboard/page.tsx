'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar,
  Activity,
  PieChart,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Project, Department } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { MOCK_PROJECTS, MOCK_CURRENT_USER } from '@/lib/mock-data';
import { calculateProjectStatus, formatDate } from '@/lib/utils';
import { DEPARTMENTS, PRIORITIES } from '@/lib/constants';

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | 'all'>('all');

  useEffect(() => {
    // Update project statuses
    const updatedProjects = MOCK_PROJECTS.map(project => ({
      ...project,
      status: calculateProjectStatus(project)
    }));
    setProjects(updatedProjects);
  }, []);

  // Filter projects by department
  const filteredProjects = useMemo(() => {
    if (selectedDepartment === 'all') return projects;
    return projects.filter(p => p.department === selectedDepartment);
  }, [projects, selectedDepartment]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = filteredProjects.length;
    const completed = filteredProjects.filter(p => p.status === 'completed').length;
    const delayed = filteredProjects.filter(p => p.status === 'delayed').length;
    const inProgress = filteredProjects.filter(p => p.status === 'in-progress').length;
    const upcoming = filteredProjects.filter(p => p.status === 'upcoming').length;
    
    const avgCompletion = total > 0 
      ? Math.round(filteredProjects.reduce((acc, p) => acc + p.percentComplete, 0) / total)
      : 0;

    const onTimeProjects = filteredProjects.filter(p => 
      p.status !== 'delayed' && p.percentComplete >= 50
    ).length;
    const onTimeRate = total > 0 ? Math.round((onTimeProjects / total) * 100) : 0;

    return {
      total,
      completed,
      delayed,
      inProgress,
      upcoming,
      avgCompletion,
      onTimeRate,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [filteredProjects]);

  // Department breakdown
  const departmentStats = useMemo(() => {
    return DEPARTMENTS.map(dept => {
      const deptProjects = projects.filter(p => p.department === dept.value);
      return {
        ...dept,
        total: deptProjects.length,
        completed: deptProjects.filter(p => p.status === 'completed').length,
        delayed: deptProjects.filter(p => p.status === 'delayed').length,
        avgCompletion: deptProjects.length > 0
          ? Math.round(deptProjects.reduce((acc, p) => acc + p.percentComplete, 0) / deptProjects.length)
          : 0,
      };
    });
  }, [projects]);

  // Priority breakdown
  const priorityStats = useMemo(() => {
    return PRIORITIES.map(priority => {
      const priorityProjects = filteredProjects.filter(p => p.priority === priority.value);
      return {
        ...priority,
        count: priorityProjects.length,
        percentage: filteredProjects.length > 0 
          ? Math.round((priorityProjects.length / filteredProjects.length) * 100)
          : 0,
      };
    });
  }, [filteredProjects]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Comprehensive overview of project performance and metrics
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Department Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Department
          </label>
          <select
            className="block w-full md:w-64 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value as Department | 'all')}
          >
            <option value="all">All Departments</option>
            {DEPARTMENTS.map(dept => (
              <option key={dept.value} value={dept.value}>{dept.label}</option>
            ))}
          </select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {stats.inProgress} in progress
                </p>
              </div>
              <BarChart3 className="h-10 w-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-3xl font-bold text-gray-900">{stats.completionRate}%</p>
                <p className="text-sm text-gray-500 mt-1">
                  {stats.completed} completed
                </p>
              </div>
              <PieChart className="h-10 w-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">On-Time Rate</p>
                <p className="text-3xl font-bold text-gray-900">{stats.onTimeRate}%</p>
                <div className="flex items-center mt-1">
                  {stats.onTimeRate >= 70 ? (
                    <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${stats.onTimeRate >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                    {stats.onTimeRate >= 70 ? 'Good' : 'Needs Improvement'}
                  </span>
                </div>
              </div>
              <TrendingUp className="h-10 w-10 text-indigo-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Delayed Projects</p>
                <p className="text-3xl font-bold text-red-600">{stats.delayed}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Requires attention
                </p>
              </div>
              <Activity className="h-10 w-10 text-red-500" />
            </div>
          </div>
        </div>

        {/* Department Performance */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Department Performance</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {departmentStats.map(dept => (
                <div key={dept.value} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{dept.label}</h3>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-500">{dept.total} projects</span>
                      <Badge variant="success">{dept.completed} completed</Badge>
                      {dept.delayed > 0 && (
                        <Badge variant="danger">{dept.delayed} delayed</Badge>
                      )}
                    </div>
                  </div>
                  <Progress value={dept.avgCompletion} showValue />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Priority Distribution</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {priorityStats.map(priority => (
                  <div key={priority.value} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={
                          priority.color === 'red' ? 'danger' : 
                          priority.color === 'yellow' ? 'warning' : 
                          'success'
                        }
                      >
                        {priority.label}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {priority.count} projects
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            priority.color === 'red' ? 'bg-red-500' :
                            priority.color === 'yellow' ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${priority.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700 w-12 text-right">
                        {priority.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {projects
                  .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                  .slice(0, 5)
                  .map(project => (
                    <div key={project.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{project.projectName}</p>
                        <p className="text-sm text-gray-500">
                          Updated {formatDate(project.updatedAt)}
                        </p>
                      </div>
                      <Badge 
                        variant={
                          project.status === 'completed' ? 'success' :
                          project.status === 'delayed' ? 'danger' :
                          'info'
                        }
                      >
                        {project.status}
                      </Badge>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}