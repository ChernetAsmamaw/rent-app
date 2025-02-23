import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's properties
    const properties = await pool.query(
      `SELECT p.*, 
        COUNT(DISTINCT b.id) as total_bookings,
        COUNT(DISTINCT r.id) as total_reviews,
        AVG(r.rating) as average_rating
       FROM properties p
       LEFT JOIN bookings b ON p.id = b.property_id
       LEFT JOIN reviews r ON b.id = r.booking_id
       WHERE p.host_id = $1
       GROUP BY p.id`,
      [userId]
    );

    // Get user's bookings
    const bookings = await pool.query(
      `SELECT b.*, p.title, p.location
       FROM bookings b
       JOIN properties p ON b.property_id = p.id
       WHERE b.renter_id = $1
       ORDER BY b.check_in DESC`,
      [userId]
    );

    return NextResponse.json({
      properties: properties.rows,
      bookings: bookings.rows
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}