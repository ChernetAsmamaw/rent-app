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
      `SELECT 
        p.*,
        COUNT(DISTINCT b.id) as total_bookings
       FROM properties p
       LEFT JOIN bookings b ON p.id = b.property_id
       WHERE p.host_id = $1
       GROUP BY p.id
       ORDER BY p.created_at DESC`,
      [userId]
    );

    return NextResponse.json(result.rows.map(property => ({
      id: property.id,
      title: property.title,
      description: property.description,
      location: property.location,
      price_per_night: property.price_per_night,
      images: property.images || [],
      total_bookings: parseInt(property.total_bookings) || 0
    })));
  } catch (error) {
    console.error('Error fetching host properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}