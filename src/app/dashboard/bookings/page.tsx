import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import pool from '@/lib/db';
import HostBookings from '@/components/dashboard/bookings/HostBookings';
import RenterBookings from '@/components/dashboard/bookings/RenterBookings';

async function getUserRole(userId: string) {
  const result = await pool.query(
    'SELECT role FROM users WHERE clerk_id = $1',
    [userId]
  );
  return result.rows[0]?.role || 'RENTER';
}

export default async function BookingsPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const userRole = await getUserRole(userId);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
      {userRole === 'HOST' ? <HostBookings /> : <RenterBookings />}
    </main>
  );
}