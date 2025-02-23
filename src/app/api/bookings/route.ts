import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { propertyId, checkIn, checkOut } = await request.json();

    // Check if the dates are available
    const conflictingBookings = await pool.query(
      `SELECT * FROM bookings 
       WHERE property_id = $1 
       AND status != 'CANCELED'
       AND (
         (check_in <= $2 AND check_out >= $2)
         OR (check_in <= $3 AND check_out >= $3)
         OR (check_in >= $2 AND check_out <= $3)
       )`,
      [propertyId, checkIn, checkOut]
    );

    if (conflictingBookings.rows.length > 0) {
      return NextResponse.json(
        { error: 'Property is not available for these dates' },
        { status: 400 }
      );
    }

    // Create the booking
    const result = await pool.query(
      `INSERT INTO bookings (property_id, renter_id, check_in, check_out, status)
       VALUES ($1, $2, $3, $4, 'PENDING')
       RETURNING *`,
      [propertyId, userId, checkIn, checkOut]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Booking creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await pool.query(
      `SELECT b.*, p.title as property_title, p.location as property_location,
              u.name as renter_name, u.email as renter_email
       FROM bookings b
       JOIN properties p ON b.property_id = p.id
       JOIN users u ON b.renter_id = u.clerk_id
       WHERE p.host_id = $1
       ORDER BY b.created_at DESC`,
      [userId]
    );

    return NextResponse.json(result.rows.map(booking => ({
      id: booking.id,
      check_in: booking.check_in,
      check_out: booking.check_out,
      status: booking.status,
      renter: {
        name: booking.renter_name,
        email: booking.renter_email
      },
      property: {
        title: booking.property_title,
        location: booking.property_location
      }
    })));
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}