// components/projects/ProjectFilters.tsx
import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { Department, Priority, ProjectStatus } from '@/lib/types';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { DEPARTMENTS, PRIORITIES, PROJECT_STATUSES } from '@/lib/constants';

interface ProjectFiltersProps {
  onFilterChange: (filters: {
    search: string;
    department: Department | '';
    priority: Priority | '';
    status: ProjectStatus | '';
  }) => void;
  initialStatus?: ProjectStatus | null;
}

export function ProjectFilters({
  onFilterChange,
  initialStatus,
}: ProjectFiltersProps) {
  const [filters, setFilters] = useState({
    search: '',
    department: '' as Department | '',
    priority: '' as Priority | '',
    status: (initialStatus || '') as ProjectStatus | '',
  });

  useEffect(() => {
    if (initialStatus) {
      setFilters((prev) => ({ ...prev, status: initialStatus }));
    }
  }, [initialStatus]);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Filters
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            className="pl-10 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        <Select
          placeholder="All Departments"
          options={[{ value: '', label: 'All Departments' }, ...DEPARTMENTS]}
          value={filters.department}
          onChange={(e) => handleFilterChange('department', e.target.value)}
          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />

        <Select
          placeholder="All Priorities"
          options={[
            { value: '', label: 'All Priorities' },
            ...PRIORITIES.map((p) => ({ value: p.value, label: p.label })),
          ]}
          value={filters.priority}
          onChange={(e) => handleFilterChange('priority', e.target.value)}
          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />

        <Select
          placeholder="All Statuses"
          options={[
            { value: '', label: 'All Statuses' },
            ...PROJECT_STATUSES.map((s) => ({
              value: s.value,
              label: s.label,
            })),
          ]}
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>
    </div>
  );
}
