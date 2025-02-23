'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth, SignInButton } from '@clerk/nextjs';
import { UserButton } from '@clerk/nextjs';
import { Search, LayoutDashboard } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Navigation() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  return (
    <nav className="fixed w-full z-50 bg-white border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center space-x-3 group">
            <Image 
              src="/logo.png"
              alt="LaLa Rentals Logo"
              width={220}
              height={120}
              className="object-contain"
            />
          </Link>

          <div className="flex items-center space-x-8">
            <Link href="/properties" className="nav-link">
              <Search className="h-5 w-5" />
              <span>Explore</span>
            </Link>
            
            {isSignedIn ? (
              <>
                <Link href="/dashboard" className="nav-link">
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <div className="relative p-1 w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-sky-600">
                  <div className="p-1 w-12 h-12 rounded-full bg-white/90 backdrop-blur-xl hover:bg-white transition-colors">
                    <UserButton 
                      afterSignOutUrl="/"
                      signOutCallback={() => {
                        router.push('/');
                        router.refresh();
                      }}
                      appearance={{
                        elements: {
                          avatarBox: "w-10 h-10 rounded-full"
                        }
                      }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <SignInButton mode="modal">
                <button className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-500 hover:to-sky-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}