// components/projects/ProjectForm.tsx
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Project } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { DEPARTMENTS, PRIORITIES } from '@/lib/constants';
import { generateId } from '@/lib/utils';

interface ProjectFormProps {
  project?: Project;
  onSubmit: (project: any) => void;
  isSubmitting?: boolean;
}

export function ProjectForm({
  project,
  onSubmit,
  isSubmitting = false,
}: ProjectFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    projectName: project?.projectName || '',
    projectManager: project?.projectManager || '',
    department: project?.department || 'engineering',
    stakeholders: project?.stakeholders.join(', ') || '',
    startDate: project?.startDate || '',
    endDate: project?.endDate || '',
    priority: project?.priority || 'medium',
    partners: project?.partners.join(', ') || '',
    percentComplete: project?.percentComplete || 0,
    status: project?.status || 'upcoming',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Project Name"
          required
          value={formData.projectName}
          onChange={(e) =>
            setFormData({ ...formData, projectName: e.target.value })
          }
          className="dark:bg-gray-700 dark:text-white"
        />

        <Input
          label="Project Manager"
          required
          value={formData.projectManager}
          onChange={(e) =>
            setFormData({ ...formData, projectManager: e.target.value })
          }
          className="dark:bg-gray-700 dark:text-white"
        />

        <Select
          label="Department"
          required
          options={DEPARTMENTS}
          value={formData.department}
          onChange={(e) =>
            setFormData({ ...formData, department: e.target.value as any })
          }
          className="dark:bg-gray-700 dark:text-white"
        />

        <Select
          label="Priority"
          required
          options={PRIORITIES.map((p) => ({ value: p.value, label: p.label }))}
          value={formData.priority}
          onChange={(e) =>
            setFormData({ ...formData, priority: e.target.value as any })
          }
          className="dark:bg-gray-700 dark:text-white"
        />

        <Input
          label="Start Date"
          type="date"
          required
          value={formData.startDate}
          onChange={(e) =>
            setFormData({ ...formData, startDate: e.target.value })
          }
          className="dark:bg-gray-700 dark:text-white"
        />

        <Input
          label="End Date"
          type="date"
          required
          value={formData.endDate}
          onChange={(e) =>
            setFormData({ ...formData, endDate: e.target.value })
          }
          className="dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div className="space-y-4">
        <Input
          label="Stakeholders (comma-separated)"
          placeholder="John Doe, Jane Smith, Marketing Team"
          value={formData.stakeholders}
          onChange={(e) =>
            setFormData({ ...formData, stakeholders: e.target.value })
          }
          className="dark:bg-gray-700 dark:text-white"
        />

        <Input
          label="Partners (comma-separated)"
          placeholder="Agency X, Vendor Y"
          value={formData.partners}
          onChange={(e) =>
            setFormData({ ...formData, partners: e.target.value })
          }
          className="dark:bg-gray-700 dark:text-white"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Completion Percentage: {formData.percentComplete}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={formData.percentComplete}
            onChange={(e) =>
              setFormData({
                ...formData,
                percentComplete: parseInt(e.target.value),
              })
            }
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? 'Creating...'
            : project
            ? 'Update Project'
            : 'Create Project'}
        </Button>
      </div>
    </form>
  );
}
