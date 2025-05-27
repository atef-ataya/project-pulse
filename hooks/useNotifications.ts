
import { useState, useEffect, useCallback } from 'react';
import { Notification, Project } from '@/lib/types';
import { MOCK_NOTIFICATIONS, MOCK_PROJECTS } from '@/lib/mock-data';
import { shouldShowDeadlineWarning, generateId, calculateProjectStatus } from '@/lib/utils';

export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Initialize with mock notifications
    setNotifications(MOCK_NOTIFICATIONS);

    // Check for deadline warnings
    const checkDeadlines = () => {
      const projects = MOCK_PROJECTS.map(p => ({
        ...p,
        status: calculateProjectStatus(p)
      }));

      projects.forEach(project => {
        if (shouldShowDeadlineWarning(project.endDate, project.percentComplete)) {
          const existingWarning = notifications.find(
            n => n.projectId === project.id && n.type === 'deadline-warning'
          );

          if (!existingWarning) {
            const newNotification: Notification = {
              id: generateId(),
              type: 'deadline-warning',
              projectId: project.id,
              projectName: project.projectName,
              message: `${project.projectName} deadline is in 3 days or less`,
              createdAt: new Date().toISOString(),
              read: false,
              userId,
              actionRequired: false,
            };

            setNotifications(prev => [newNotification, ...prev]);
          }
        }

        if (project.status === 'delayed') {
          const existingDelayNotification = notifications.find(
            n => n.projectId === project.id && n.type === 'project-delayed'
          );

          if (!existingDelayNotification) {
            const newNotification: Notification = {
              id: generateId(),
              type: 'project-delayed',
              projectId: project.id,
              projectName: project.projectName,
              message: `${project.projectName} is delayed. Currently at ${project.percentComplete}% completion.`,
              createdAt: new Date().toISOString(),
              read: false,
              userId,
              actionRequired: true,
            };

            setNotifications(prev => [newNotification, ...prev]);
          }
        }
      });
    };

    checkDeadlines();
    
    // Check for deadlines every minute
    const interval = setInterval(checkDeadlines, 60000);

    return () => clearInterval(interval);
  }, [userId]);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const createExtensionRequest = useCallback((projectId: string, projectName: string, reason: string) => {
    const notification: Notification = {
      id: generateId(),
      type: 'extension-request',
      projectId,
      projectName,
      message: `Extension requested for ${projectName}`,
      extensionReason: reason,
      createdAt: new Date().toISOString(),
      read: false,
      userId: '1', // Admin user ID
      actionRequired: true,
    };

    setNotifications(prev => [notification, ...prev]);
  }, []);

  const handleExtensionAction = useCallback((notification: Notification, action: 'approve' | 'reject') => {
    // Create response notification
    const responseNotification: Notification = {
      id: generateId(),
      type: action === 'approve' ? 'extension-approved' : 'extension-rejected',
      projectId: notification.projectId,
      projectName: notification.projectName,
      message: `Extension request for ${notification.projectName} was ${action}d`,
      createdAt: new Date().toISOString(),
      read: false,
      userId: notification.userId,
      actionRequired: false,
    };

    // Remove the original request and add the response
    setNotifications(prev => [
      responseNotification,
      ...prev.filter(n => n.id !== notification.id)
    ]);
  }, []);

  return {
    notifications,
    unreadCount: notifications.filter(n => !n.read).length,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createExtensionRequest,
    handleExtensionAction,
  };
}