import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  Calendar, 
  FolderOpen, 
  Home, 
  Settings,
  Users,
  TrendingUp,
  Clock
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Projects', href: '/projects', icon: FolderOpen },
    { name: 'Analytics', href: '/dashboard', icon: BarChart3 },
    { name: 'Timeline', href: '/timeline', icon: Calendar },
    { name: 'Team', href: '/team', icon: Users },
    { name: 'Reports', href: '/reports', icon: TrendingUp },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const stats = [
    { label: 'Active Projects', value: '12' },
    { label: 'Team Members', value: '24' },
    { label: 'Avg. Completion', value: '68%' },
  ];

  return (
    <aside className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex-1 flex flex-col min-h-0 bg-gray-800">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <Clock className="h-8 w-8 text-white" />
              <span className="ml-2 text-xl font-semibold text-white">Project Pulse</span>
            </div>
            <nav className="mt-8 flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      pathname === item.href
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  >
                    <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          <div className="flex-shrink-0 flex bg-gray-700 p-4">
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Quick Stats
              </p>
              <div className="space-y-2">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex justify-between text-sm">
                    <span className="text-gray-300">{stat.label}</span>
                    <span className="text-white font-medium">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}