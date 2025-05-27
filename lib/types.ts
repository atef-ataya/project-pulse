// lib/types.ts

export type ProjectStatus = 'upcoming' | 'in-progress' | 'completed' | 'delayed';
export type Priority = 'high' | 'medium' | 'low';
export type UserRole = 'admin' | 'department' | 'project';
export type Department = 'engineering' | 'marketing' | 'sales' | 'hr' | 'finance' | 'operations';

export interface Project {
  id: string;
  projectName: string;
  projectManager: string;
  department: Department;
  stakeholders: string[];
  startDate: string;
  endDate: string;
  priority: Priority;
  partners: string[];
  percentComplete: number;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: Department;
  assignedProjects?: string[]; // Project IDs
}

export interface Notification {
  id: string;
  type: 'deadline-warning' | 'extension-request' | 'project-delayed' | 'extension-approved' | 'extension-rejected';
  projectId: string;
  projectName: string;
  message: string;
  createdAt: string;
  read: boolean;
  userId: string;
  actionRequired?: boolean;
  extensionReason?: string;
}

export interface ExtensionRequest {
  id: string;
  projectId: string;
  requestedBy: string;
  reason: string;
  newEndDate: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}
