import { Department, Priority, ProjectStatus } from "./types";

export const DEPARTMENTS: { value: Department; label: string }[] = [
  { value: 'engineering', label: 'Engineering' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'finance', label: 'Finance' },
  { value: 'operations', label: 'Operations' },
];

export const PRIORITIES: { value: Priority; label: string; color: string }[] = [
  { value: 'high', label: 'High', color: 'red' },
  { value: 'medium', label: 'Medium', color: 'yellow' },
  { value: 'low', label: 'Low', color: 'green' },
];

export const PROJECT_STATUSES: { value: ProjectStatus; label: string; color: string }[] = [
  { value: 'upcoming', label: 'Upcoming', color: 'blue' },
  { value: 'in-progress', label: 'In Progress', color: 'indigo' },
  { value: 'completed', label: 'Completed', color: 'green' },
  { value: 'delayed', label: 'Delayed', color: 'red' },
];