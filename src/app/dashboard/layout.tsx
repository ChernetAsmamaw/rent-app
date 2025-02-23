import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import pool from '@/lib/db';

async function getUserRole(userId: string) {
  const result = await pool.query('SELECT role FROM users WHERE clerk_id = $1', [userId]);
  return result.rows[0]?.role;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const userRole = await getUserRole(userId);
  if (!userRole) redirect('/select-role');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="flex">
        <DashboardSidebar userRole={userRole} />
        <div className="flex-1">
          <DashboardHeader />
          <main className="p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}