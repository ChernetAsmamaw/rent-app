import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Navigation from '@/components/Navigation';
import PropertyForm from '@/components/PropertyForm';
import pool from '@/lib/db';

async function getUserRole(userId: string) {
  const result = await pool.query('SELECT role FROM users WHERE clerk_id = $1', [userId]);
  return result.rows[0]?.role;
}

export default async function NewPropertyPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const userRole = await getUserRole(userId);
  if (userRole !== 'HOST') redirect('/dashboard');

  return (
    <div>
      <Navigation />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Add New Property</h1>
        <PropertyForm />
      </main>
    </div>
  );
}