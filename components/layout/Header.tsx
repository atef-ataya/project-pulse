import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { Button } from '@/components/ui/Button';
import { useNotifications } from '@/hooks/useNotifications';
import { MOCK_CURRENT_USER } from '@/lib/mock-data';

interface HeaderProps {
  onMenuClick: () => void;
  isMobileMenuOpen: boolean;
}

export function Header({ onMenuClick, isMobileMenuOpen }: HeaderProps) {
  const pathname = usePathname();
  const { notifications, markAsRead, handleExtensionAction } = useNotifications(MOCK_CURRENT_USER.id);

  const navigation = [
    { name: 'Dashboard', href: '/' },
    { name: 'Projects', href: '/projects' },
    { name: 'Analytics', href: '/dashboard' },
  ];

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              onClick={onMenuClick}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            
            <Link href="/" className="flex items-center">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Project Pulse</h1>
            </Link>

            <nav className="hidden md:flex md:ml-10 space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    pathname === item.href
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <span className="hidden md:block text-sm text-gray-500">
              {MOCK_CURRENT_USER.name} ({MOCK_CURRENT_USER.role})
            </span>
            
            <NotificationBell
              notifications={notifications}
              onMarkAsRead={markAsRead}
              onActionTaken={handleExtensionAction}
            />
            
            <Link href="/projects/new" className="hidden md:block">
              <Button size="sm">New Project</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  pathname === item.href
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                onClick={onMenuClick}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/projects/new"
              className="block pl-3 pr-4 py-2 text-base font-medium text-blue-600 hover:bg-gray-50"
              onClick={onMenuClick}
            >
              Create New Project
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}