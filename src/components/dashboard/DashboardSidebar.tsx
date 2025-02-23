'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Home, 
  CalendarDays, 
  MessageSquare, 
  Settings,
  Plus,
  History,
  Users
} from 'lucide-react';

export default function DashboardSidebar({ userRole }: { userRole: string }) {
  const pathname = usePathname();

  const menuItems = userRole === 'HOST' ? [
    { icon: <LayoutDashboard />, label: 'Overview', href: '/dashboard' },
    { icon: <Home />, label: 'My Properties', href: '/dashboard/properties' },
    { icon: <Plus />, label: 'Add Property', href: '/properties/new' },
    { icon: <CalendarDays />, label: 'Bookings', href: '/dashboard/bookings' },
    { icon: <MessageSquare />, label: 'Messages', href: '/dashboard/messages' },
  ] : [
    { icon: <LayoutDashboard />, label: 'Overview', href: '/dashboard' },
    { icon: <History />, label: 'My Bookings', href: '/dashboard/bookings' },
    { icon: <MessageSquare />, label: 'Messages', href: '/dashboard/messages' },
  ];

  return (
    <div className="w-64 h-screen sticky top-0 bg-white/80 backdrop-blur-xl border-r border-gray-200/50">
      <div className="flex flex-col h-full">
        <div className="p-6">
        <Link href="/" className="flex items-center space-x-3 group">
            <Image 
              src="/logo.png"
              alt="LaLa Rentals Logo"
              width={180}
              height={100}
              className="object-contain"
            />
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                ${pathname === item.href 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200/50">
          <Link
            href="/dashboard/settings"
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-all duration-200"
          >
            <Settings />
            <span>Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}