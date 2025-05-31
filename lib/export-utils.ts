// lib/export-utils.ts
import { Project } from './types';
import { formatDate } from './utils';

export function exportToExcel(
  projects: Project[],
  filename: string = 'projects'
) {
  // Create CSV content
  const headers = [
    'Project Name',
    'Project Manager',
    'Department',
    'Priority',
    'Status',
    'Start Date',
    'End Date',
    'Progress (%)',
    'Stakeholders',
    'Partners',
  ];

  const rows = projects.map((project) => [
    project.projectName,
    project.projectManager,
    project.department,
    project.priority,
    project.status,
    formatDate(project.startDate),
    formatDate(project.endDate),
    project.percentComplete.toString(),
    project.stakeholders.join('; '),
    project.partners.join('; '),
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `${filename}_${new Date().toISOString().split('T')[0]}.csv`
  );
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Advanced Excel export using XLSX format (requires xlsx library)
export async function exportToXLSX(projects: Project[]) {
  try {
    // Dynamically import xlsx library
    const XLSX = await import('xlsx');

    // Prepare data
    const worksheetData = projects.map((project) => ({
      'Project Name': project.projectName,
      'Project Manager': project.projectManager,
      Department: project.department,
      Priority: project.priority,
      Status: project.status,
      'Start Date': formatDate(project.startDate),
      'End Date': formatDate(project.endDate),
      'Progress (%)': project.percentComplete,
      Stakeholders: project.stakeholders.join('; '),
      Partners: project.partners.join('; '),
      'Created At': formatDate(project.createdAt),
      'Updated At': formatDate(project.updatedAt),
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Projects');

    // Generate Excel file
    XLSX.writeFile(
      workbook,
      `project_pulse_export_${new Date().toISOString().split('T')[0]}.xlsx`
    );
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    // Fallback to CSV export
    exportToExcel(projects, 'project_pulse_export');
  }
}
