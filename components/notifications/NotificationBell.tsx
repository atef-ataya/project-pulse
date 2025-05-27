import { useState } from 'react';
import { Bell } from 'lucide-react';
import { Notification } from '@/lib/types';
import { NotificationList } from './NotificationList';

interface NotificationBellProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onActionTaken: (notification: Notification, action: 'approve' | 'reject') => void;
}

export function NotificationBell({ notifications, onMarkAsRead, onActionTaken }: NotificationBellProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button
        className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-20">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            </div>
            <NotificationList 
              notifications={notifications}
              onMarkAsRead={onMarkAsRead}
              onActionTaken={onActionTaken}
            />
          </div>
        </>
      )}
    </div>
  );
}


