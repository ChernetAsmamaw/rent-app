import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import HostProperties from '@/components/dashboard/properties/HostProperties';
import pool from '@/lib/db';

async function getUserRole(userId: string) {
  const result = await pool.query('SELECT role FROM users WHERE clerk_id = $1', [userId]);
  return result.rows[0]?.role;
}

export default async function PropertiesPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const userRole = await getUserRole(userId);
  if (userRole !== 'HOST') redirect('/dashboard');

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Properties</h1>
        <a 
          href="/properties/new" 
          className="btn-primary flex items-center gap-2"
        >
          Add New Property
        </a>
      </div>
      <HostProperties />
    </main>
  );
}