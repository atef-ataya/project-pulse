import { formatDistanceToNow } from 'date-fns';
import {
  AlertTriangle,
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  Bell,
} from 'lucide-react';
import { Notification } from '@/lib/types';
import { Button } from '@/components/ui/Button';

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onActionTaken: (
    notification: Notification,
    action: 'approve' | 'reject'
  ) => void;
}

export function NotificationList({
  notifications,
  onMarkAsRead,
  onActionTaken,
}: NotificationListProps) {
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'deadline-warning':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'project-delayed':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'extension-request':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'extension-approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'extension-rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  if (notifications.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">No notifications</div>
    );
  }

  return (
    <div className="max-h-96 overflow-y-auto">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 border-b hover:bg-gray-50 ${
            !notification.read ? 'bg-blue-50' : ''
          }`}
          onClick={() => !notification.read && onMarkAsRead(notification.id)}
        >
          <div className="flex gap-3">
            <div className="flex-shrink-0 mt-1">
              {getIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {notification.projectName}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {notification.message}
              </p>
              {notification.extensionReason && (
                <p className="text-sm text-gray-500 mt-2 italic">
                  "{notification.extensionReason}"
                </p>
              )}
              <p className="text-xs text-gray-400 mt-2">
                {formatDistanceToNow(new Date(notification.createdAt), {
                  addSuffix: true,
                })}
              </p>
              {notification.actionRequired &&
                notification.type === 'extension-request' && (
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        onActionTaken(notification, 'approve');
                      }}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onActionTaken(notification, 'reject');
                      }}
                    >
                      Reject
                    </Button>
                  </div>
                )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
