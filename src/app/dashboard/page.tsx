import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import RenterDashboard from '@/components/dashboard/RenterDashboard';
import HostDashboard from '@/components/dashboard/HostDashboard';
import pool from '@/lib/db';

async function getUserRole(userId: string) {
  const result = await pool.query(
    'SELECT role FROM users WHERE clerk_id = $1',
    [userId]
  );
  return result.rows[0]?.role || 'RENTER';
}

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const userRole = await getUserRole(userId);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {userRole === 'HOST' ? 'Host Dashboard' : 'Renter Dashboard'}
      </h1>
      {userRole === 'HOST' ? <HostDashboard /> : <RenterDashboard />}
    </main>
  );
}