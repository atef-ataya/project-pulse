// lib/utils.ts

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Project, ProjectStatus } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Calculate if a project is delayed based on end date and completion percentage
export function calculateProjectStatus(project: Project): ProjectStatus {
  const today = new Date();
  const endDate = new Date(project.endDate);
  const daysUntilDeadline = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  // If project is marked as completed, keep that status
  if (project.status === 'completed') return 'completed';
  
  // If end date has passed and project is not 100% complete
  if (daysUntilDeadline < 0 && project.percentComplete < 100) {
    return 'delayed';
  }
  
  // If project hasn't started yet
  const startDate = new Date(project.startDate);
  if (startDate > today) {
    return 'upcoming';
  }
  
  // Otherwise it's in progress
  return 'in-progress';
}

// Check if a deadline warning should be shown (3 days before end date)
export function shouldShowDeadlineWarning(endDate: string, percentComplete: number): boolean {
  if (percentComplete === 100) return false;
  
  const end = new Date(endDate);
  const today = new Date();
  const daysUntilDeadline = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  return daysUntilDeadline <= 3 && daysUntilDeadline >= 0;
}

// Format date for display
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

// Generate a unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
