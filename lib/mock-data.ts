import { Project, User, Notification } from './types';
import { generateId } from './utils';

// Mock current user (we'll rotate through these for demo)
export const MOCK_CURRENT_USER: User = {
  id: '1',
  name: 'John Admin',
  email: 'john@company.com',
  role: 'admin',
};

// Mock users
export const MOCK_USERS: User[] = [
  MOCK_CURRENT_USER,
  {
    id: '2',
    name: 'Sarah Engineer',
    email: 'sarah@company.com',
    role: 'department',
    department: 'engineering',
  },
  {
    id: '3',
    name: 'Mike Manager',
    email: 'mike@company.com',
    role: 'project',
    assignedProjects: ['1', '3'],
  },
];

// Mock projects with various states
export const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    projectName: 'Website Redesign',
    projectManager: 'Sarah Johnson',
    department: 'marketing',
    stakeholders: ['John Doe', 'Jane Smith', 'Marketing Team'],
    startDate: '2025-05-01',
    endDate: '2025-05-30',
    priority: 'high',
    partners: ['Design Agency X', 'Content Team'],
    percentComplete: 75,
    status: 'in-progress',
    createdAt: '2025-04-15',
    updatedAt: '2025-05-25',
  },
  {
    id: '2',
    projectName: 'Mobile App Development',
    projectManager: 'Mike Chen',
    department: 'engineering',
    stakeholders: ['Product Team', 'QA Team', 'Design Team'],
    startDate: '2025-05-15',
    endDate: '2025-08-15',
    priority: 'high',
    partners: ['AWS', 'Stripe'],
    percentComplete: 30,
    status: 'in-progress',
    createdAt: '2025-05-01',
    updatedAt: '2025-05-24',
  },
  {
    id: '3',
    projectName: 'Q3 Sales Campaign',
    projectManager: 'Lisa Park',
    department: 'sales',
    stakeholders: ['Sales Team', 'Marketing Team'],
    startDate: '2025-06-01',
    endDate: '2025-08-31',
    priority: 'medium',
    partners: ['Ad Agency Y', 'Social Media Consultants'],
    percentComplete: 0,
    status: 'upcoming',
    createdAt: '2025-05-20',
    updatedAt: '2025-05-20',
  },
  {
    id: '4',
    projectName: 'Employee Training Program',
    projectManager: 'David Brown',
    department: 'hr',
    stakeholders: ['All Departments', 'External Trainers'],
    startDate: '2025-04-01',
    endDate: '2025-05-15',
    priority: 'medium',
    partners: ['Training Corp', 'Online Learning Platform'],
    percentComplete: 60,
    status: 'delayed', // This should be delayed since end date passed
    createdAt: '2025-03-15',
    updatedAt: '2025-05-20',
  },
  {
    id: '5',
    projectName: 'Financial System Upgrade',
    projectManager: 'Emma Wilson',
    department: 'finance',
    stakeholders: ['Finance Team', 'IT Team', 'Auditors'],
    startDate: '2025-05-10',
    endDate: '2025-05-29',
    priority: 'high',
    partners: ['SAP Consultants', 'Data Migration Team'],
    percentComplete: 85,
    status: 'in-progress',
    createdAt: '2025-04-20',
    updatedAt: '2025-05-26',
  },
];

// Mock notifications
export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'deadline-warning',
    projectId: '1',
    projectName: 'Website Redesign',
    message: 'Website Redesign project deadline is in 3 days',
    createdAt: new Date().toISOString(),
    read: false,
    userId: '1',
    actionRequired: false,
  },
  {
    id: '2',
    type: 'project-delayed',
    projectId: '4',
    projectName: 'Employee Training Program',
    message: 'Employee Training Program is delayed. Currently at 60% completion.',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    read: false,
    userId: '1',
    actionRequired: true,
  },
  {
    id: '3',
    type: 'extension-request',
    projectId: '5',
    projectName: 'Financial System Upgrade',
    message: 'Extension requested for Financial System Upgrade',
    extensionReason: 'Additional testing required for compliance',
    createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    read: false,
    userId: '1',
    actionRequired: true,
  },
];