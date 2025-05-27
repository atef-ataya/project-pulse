'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit, Trash2, Calendar, Users, Building, AlertTriangle, Clock } from 'lucide-react';
import { Project } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { MOCK_PROJECTS, MOCK_CURRENT_USER } from '@/lib/mock-data';
import { formatDate, calculateProjectStatus, shouldShowDeadlineWarning } from '@/lib/utils';
import { PRIORITIES, PROJECT_STATUSES, DEPARTMENTS } from '@/lib/constants';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showExtensionModal, setShowExtensionModal] = useState(false);
  const [extensionData, setExtensionData] = useState({
    newEndDate: '',
    reason: '',
  });

  useEffect(() => {
    // Find the project (in a real app, this would be an API call)
    const foundProject = MOCK_PROJECTS.find(p => p.id === params.id);
    if (foundProject) {
      setProject({
        ...foundProject,
        status: calculateProjectStatus(foundProject)
      });
    }
  }, [params.id]);

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Project not found</h2>
          <Link href="/projects">
            <Button variant="outline">Back to Projects</Button>
          </Link>
        </div>
      </div>
    );
  }

  const priority = PRIORITIES.find(p => p.value === project.priority);
  const status = PROJECT_STATUSES.find(s => s.value === project.status);
  const department = DEPARTMENTS.find(d => d.value === project.department);
  const showWarning = shouldShowDeadlineWarning(project.endDate, project.percentComplete);

  const handleDelete = () => {
    // In a real app, this would delete from the database
    console.log('Deleting project:', project.id);
    alert('Project deleted successfully!');
    router.push('/projects');
  };

  const handleExtensionRequest = () => {
    // In a real app, this would create an extension request
    console.log('Extension request:', extensionData);
    alert('Extension request sent to admin for approval!');
    setShowExtensionModal(false);
  };

  const canEdit = MOCK_CURRENT_USER.role === 'admin' || 
    (MOCK_CURRENT_USER.role === 'project' && MOCK_CURRENT_USER.assignedProjects?.includes(project.id));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/projects">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Projects
              </Button>
            </Link>
            {canEdit && (
              <div className="flex gap-2">
                <Link href={`/projects/${project.id}/edit`}>
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          {/* Project Header */}
          <div className="p-6 border-b">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.projectName}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{project.projectManager}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Building className="h-4 w-4" />
                    <span>{department?.label}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge variant={priority?.color === 'red' ? 'danger' : priority?.color === 'yellow' ? 'warning' : 'success'}>
                  {priority?.label} Priority
                </Badge>
                <Badge variant={status?.color === 'red' ? 'danger' : status?.color === 'green' ? 'success' : 'info'}>
                  {status?.label}
                </Badge>
              </div>
            </div>
          </div>

          {/* Warning Banner */}
          {(showWarning || project.status === 'delayed') && (
            <div className="p-4 bg-yellow-50 border-b border-yellow-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <span className="text-yellow-800 font-medium">
                    {project.status === 'delayed' 
                      ? 'This project is delayed' 
                      : 'Deadline approaching in 3 days or less'}
                  </span>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowExtensionModal(true)}>
                  Request Extension
                </Button>
              </div>
            </div>
          )}

          {/* Project Details */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Timeline */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Start Date</span>
                  <span className="font-medium">{formatDate(project.startDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">End Date</span>
                  <span className="font-medium">{formatDate(project.endDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">
                    {Math.ceil((new Date(project.endDate).getTime() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                  </span>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress</h3>
              <Progress value={project.percentComplete} className="mb-4" />
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Last updated: {formatDate(project.updatedAt)}</span>
              </div>
            </div>

            {/* Stakeholders */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Stakeholders</h3>
              <div className="flex flex-wrap gap-2">
                {project.stakeholders.map((stakeholder, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {stakeholder}
                  </span>
                ))}
              </div>
            </div>

            {/* Partners */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Partners</h3>
              <div className="flex flex-wrap gap-2">
                {project.partners.map((partner, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {partner}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Timeline (placeholder) */}
          <div className="p-6 border-t">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Project updated</p>
                  <p className="text-sm text-gray-500">{formatDate(project.updatedAt)}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Project created</p>
                  <p className="text-sm text-gray-500">{formatDate(project.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Project"
      >
        <p className="text-gray-600 mb-4">
          Are you sure you want to delete "{project.projectName}"? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Project
          </Button>
        </div>
      </Modal>

      {/* Extension Request Modal */}
      <Modal
        isOpen={showExtensionModal}
        onClose={() => setShowExtensionModal(false)}
        title="Request Deadline Extension"
      >
        <div className="space-y-4">
          <Input
            label="New End Date"
            type="date"
            required
            value={extensionData.newEndDate}
            onChange={(e) => setExtensionData({ ...extensionData, newEndDate: e.target.value })}
            min={project.endDate}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Extension
            </label>
            <textarea
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              rows={4}
              required
              value={extensionData.reason}
              onChange={(e) => setExtensionData({ ...extensionData, reason: e.target.value })}
              placeholder="Please explain why an extension is needed..."
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => setShowExtensionModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleExtensionRequest}>
            Submit Request
          </Button>
        </div>
      </Modal>
    </div>
  );
}