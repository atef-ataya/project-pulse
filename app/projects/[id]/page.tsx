'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Users,
  Building,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { Project } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { MOCK_CURRENT_USER } from '@/lib/mock-data';
import {
  formatDate,
  calculateProjectStatus,
  shouldShowDeadlineWarning,
} from '@/lib/utils';
import { PRIORITIES, PROJECT_STATUSES, DEPARTMENTS } from '@/lib/constants';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showExtensionModal, setShowExtensionModal] = useState(false);
  const [extensionData, setExtensionData] = useState({
    newEndDate: '',
    reason: '',
  });

  useEffect(() => {
    if (!id) return;
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);

      const response = await fetch(`/api/projects/${id}`);
      if (!response.ok) throw new Error('Project not found');

      const data = await response.json();
      setProject({
        ...data,
        status: calculateProjectStatus(data),
      });

      setError(null);
    } catch (err) {
      console.error('Error fetching project:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete project');

      alert('Project deleted successfully!');
      router.push('/projects');
    } catch (err) {
      alert('Failed to delete project');
    }
  };

  const handleExtensionRequest = () => {
    console.log('Extension request:', extensionData);
    alert('Extension request sent to admin for approval!');
    setShowExtensionModal(false);
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-lg text-gray-600 dark:text-gray-400">
          Loading project...
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Project not found
          </h2>
          <Link href="/projects">
            <Button variant="outline">Back to Projects</Button>
          </Link>
        </div>
      </div>
    );
  }

  const priority = PRIORITIES.find((p) => p.value === project.priority);
  const status = PROJECT_STATUSES.find((s) => s.value === project.status);
  const department = DEPARTMENTS.find((d) => d.value === project.department);
  const showWarning = shouldShowDeadlineWarning(
    project.endDate,
    project.percentComplete
  );

  const canEdit =
    MOCK_CURRENT_USER.role === 'admin' ||
    (MOCK_CURRENT_USER.role === 'project' &&
      MOCK_CURRENT_USER.assignedProjects?.includes(project.id));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/projects">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Projects
              </Button>
            </Link>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              {canEdit && (
                <div className="flex gap-2">
                  <Link href={`/projects/${project.id}/edit`}>
                    <Button variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          {/* Project Header */}
          <div className="p-6 border-b dark:border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {project.projectName}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
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
                <Badge
                  variant={
                    priority?.color === 'red'
                      ? 'danger'
                      : priority?.color === 'yellow'
                      ? 'warning'
                      : 'success'
                  }
                >
                  {priority?.label} Priority
                </Badge>
                <Badge
                  variant={
                    status?.color === 'red'
                      ? 'danger'
                      : status?.color === 'green'
                      ? 'success'
                      : 'info'
                  }
                >
                  {status?.label}
                </Badge>
              </div>
            </div>
          </div>

          {/* Warning Banner */}
          {(showWarning || project.status === 'delayed') && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-100 dark:border-yellow-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-yellow-800 dark:text-yellow-200 font-medium">
                    {project.status === 'delayed'
                      ? 'This project is delayed'
                      : 'Deadline approaching in 3 days or less'}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowExtensionModal(true)}
                >
                  Request Extension
                </Button>
              </div>
            </div>
          )}

          {/* Project Details */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Timeline */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Timeline
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Start Date
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatDate(project.startDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    End Date
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatDate(project.endDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Duration
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {Math.ceil(
                      (new Date(project.endDate).getTime() -
                        new Date(project.startDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}{' '}
                    days
                  </span>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Progress
              </h3>
              <Progress value={project.percentComplete} className="mb-4" />
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Clock className="h-4 w-4" />
                <span>Last updated: {formatDate(project.updatedAt)}</span>
              </div>
            </div>

            {/* Stakeholders */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Stakeholders
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.stakeholders.map((stakeholder, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                  >
                    {stakeholder}
                  </span>
                ))}
              </div>
            </div>

            {/* Partners */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Partners
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.partners.map((partner, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                  >
                    {partner}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Timeline (placeholder) */}
          <div className="p-6 border-t dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Project updated
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(project.updatedAt)}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Project created
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(project.createdAt)}
                  </p>
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
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Are you sure you want to delete "{project.projectName}"? This action
          cannot be undone.
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
            onChange={(e) =>
              setExtensionData({ ...extensionData, newEndDate: e.target.value })
            }
            min={project.endDate}
            className="dark:bg-gray-700 dark:text-white"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Reason for Extension
            </label>
            <textarea
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              rows={4}
              required
              value={extensionData.reason}
              onChange={(e) =>
                setExtensionData({ ...extensionData, reason: e.target.value })
              }
              placeholder="Please explain why an extension is needed..."
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => setShowExtensionModal(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleExtensionRequest}>Submit Request</Button>
        </div>
      </Modal>
    </div>
  );
}
