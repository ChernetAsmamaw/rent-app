import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import RoleSelectionForm from '@/components/RoleSelectionForm';
import Navigation from '@/components/Navigation';
import pool from '@/lib/db';

async function checkUserRole(userId: string) {
  const result = await pool.query('SELECT role FROM users WHERE clerk_id = $1', [userId]);
  return result.rows[0]?.role;
}

export default async function SelectRolePage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const existingRole = await checkUserRole(userId);
  if (existingRole) redirect('/dashboard');

  return (
    <>
      <Navigation />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Welcome to LaLa Rentals
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Please choose how you want to use our platform
            </p>
          </div>
          <RoleSelectionForm />
        </div>
      </div>
    </>
  );
}