import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, pricePerNight, location } = await request.json();

    const result = await pool.query(
      `INSERT INTO properties (title, description, price_per_night, location, host_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title, description, pricePerNight, location, userId]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Property creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hostId = searchParams.get('hostId');

    const query = hostId
      ? {
          text: 'SELECT * FROM properties WHERE host_id = $1 ORDER BY created_at DESC',
          values: [hostId],
        }
      : {
          text: 'SELECT * FROM properties ORDER BY created_at DESC',
          values: [],
        };

    const result = await pool.query(query);
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}