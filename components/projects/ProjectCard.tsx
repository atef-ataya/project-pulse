import Link from 'next/link';
import { Calendar, Users, AlertTriangle } from 'lucide-react';
import { Project } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { formatDate, shouldShowDeadlineWarning } from '@/lib/utils';
import { PRIORITIES, PROJECT_STATUSES } from '@/lib/constants';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const priority = PRIORITIES.find(p => p.value === project.priority);
  const status = PROJECT_STATUSES.find(s => s.value === project.status);
  const showWarning = shouldShowDeadlineWarning(project.endDate, project.percentComplete);

  return (
    <Link href={`/projects/${project.id}`}>
      <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 cursor-pointer">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{project.projectName}</h3>
            <p className="text-sm text-gray-500 mt-1">{project.department}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={priority?.color === 'red' ? 'danger' : priority?.color === 'yellow' ? 'warning' : 'success'}>
              {priority?.label}
            </Badge>
            <Badge variant={status?.color === 'red' ? 'danger' : status?.color === 'green' ? 'success' : 'info'}>
              {status?.label}
            </Badge>
          </div>
        </div>

        {/* Warning */}
        {showWarning && (
          <div className="flex items-center gap-2 p-2 bg-yellow-50 text-yellow-800 rounded-md mb-4">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">Deadline in 3 days or less</span>
          </div>
        )}

        {/* Project Manager */}
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
          <Users className="h-4 w-4" />
          <span>{project.projectManager}</span>
        </div>

        {/* Dates */}
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(project.startDate)} - {formatDate(project.endDate)}</span>
        </div>

        {/* Progress */}
        <Progress value={project.percentComplete} label="Progress" />

        {/* Stakeholders */}
        <div className="mt-4">
          <p className="text-xs text-gray-500 mb-1">Stakeholders</p>
          <div className="flex flex-wrap gap-1">
            {project.stakeholders.slice(0, 3).map((stakeholder, index) => (
              <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                {stakeholder}
              </span>
            ))}
            {project.stakeholders.length > 3 && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                +{project.stakeholders.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}