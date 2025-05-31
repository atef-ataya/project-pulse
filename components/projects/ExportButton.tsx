// components/projects/ExportButton.tsx
import { Download } from 'lucide-react';
import { Project } from '@/lib/types';
import { exportToExcel, exportToXLSX } from '@/lib/export-utils';
import { Button } from '@/components/ui/Button';

interface ExportButtonProps {
  projects: Project[];
}

export function ExportButton({ projects }: ExportButtonProps) {
  const handleExport = async (format: 'csv' | 'xlsx') => {
    if (format === 'xlsx') {
      await exportToXLSX(projects);
    } else {
      exportToExcel(projects);
    }
  };

  return (
    <div className="relative group">
      <Button variant="outline" className="flex items-center gap-2">
        <Download className="h-4 w-4" />
        Export
      </Button>

      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
        <div className="py-1">
          <button
            onClick={() => handleExport('csv')}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Export as CSV
          </button>
          <button
            onClick={() => handleExport('xlsx')}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Export as Excel (XLSX)
          </button>
        </div>
      </div>
    </div>
  );
}
