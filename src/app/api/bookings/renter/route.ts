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
        b.id,
        b.check_in,
        b.check_out,
        b.status,
        p.title as property_title,
        p.location,
        p.price_per_night as amount
       FROM bookings b
       JOIN properties p ON b.property_id = p.id
       WHERE b.renter_id = $1
       ORDER BY b.check_in DESC`,
      [userId]
    );

    return NextResponse.json(result.rows.map(booking => ({
      id: booking.id,
      propertyTitle: booking.property_title,
      location: booking.location,
      checkIn: booking.check_in,
      checkOut: booking.check_out,
      amount: booking.amount,
      status: booking.status
    })));
  } catch (error) {
    console.error('Error fetching renter bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}