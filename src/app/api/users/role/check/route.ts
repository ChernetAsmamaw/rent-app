import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await pool.query(
      'SELECT role FROM users WHERE clerk_id = $1',
      [userId]
    );

    if (!result.rows[0]?.role) {
      return NextResponse.json({ error: 'No role set' }, { status: 404 });
    }

    return NextResponse.json({ role: result.rows[0].role });
  } catch (error) {
    console.error('Error checking user role:', error);
    return NextResponse.json(
      { error: 'Failed to check user role' },
      { status: 500 }
    );
  }
}