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
      `SELECT b.*, p.title as property_title, u.name as guest_name
       FROM bookings b
       JOIN properties p ON b.property_id = p.id
       JOIN users u ON b.renter_id = u.clerk_id
       WHERE p.host_id = $1
       ORDER BY b.created_at DESC`,
      [userId]
    );

    return NextResponse.json(result.rows.map(booking => ({
      id: booking.id,
      propertyTitle: booking.property_title,
      guestName: booking.guest_name,
      checkIn: booking.check_in,
      checkOut: booking.check_out,
      amount: booking.amount,
      status: booking.status
    })));
  } catch (error) {
    console.error('Error fetching host bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}