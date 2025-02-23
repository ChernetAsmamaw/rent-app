'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HomeIcon, UserIcon } from '@heroicons/react/24/outline';

export default function RoleSelectionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRoleSelection = async (role: 'HOST' | 'RENTER') => {
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch('/api/users/role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to set role');
      }

      await response.json();
      await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay to ensure DB update
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      console.error('Error setting role:', error);
      setError(error instanceof Error ? error.message : 'Failed to set role');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <button
        onClick={() => handleRoleSelection('HOST')}
        disabled={isSubmitting}
        className="relative group bg-white p-6 focus:outline-none rounded-lg shadow-md hover:shadow-lg transition-shadow"
      >
        <div className="flex flex-col items-center">
          <HomeIcon className="h-12 w-12 text-blue-500 group-hover:text-blue-600" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Host</h3>
          <p className="mt-2 text-sm text-gray-500 text-center">
            List your properties and earn money by hosting guests
          </p>
        </div>
      </button>

      <button
        onClick={() => handleRoleSelection('RENTER')}
        disabled={isSubmitting}
        className="relative group bg-white p-6 focus:outline-none rounded-lg shadow-md hover:shadow-lg transition-shadow"
      >
        <div className="flex flex-col items-center">
          <UserIcon className="h-12 w-12 text-green-500 group-hover:text-green-600" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Renter</h3>
          <p className="mt-2 text-sm text-gray-500 text-center">
            Find and book amazing properties for your stays
          </p>
        </div>
      </button>
    </div>
  );
}