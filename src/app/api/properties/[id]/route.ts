import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import pool from '@/lib/db';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, pricePerNight, location } = await request.json();

    // Verify ownership
    const property = await pool.query(
      'SELECT * FROM properties WHERE id = $1 AND host_id = $2',
      [params.id, userId]
    );

    if (property.rows.length === 0) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    const result = await pool.query(
      `UPDATE properties 
       SET title = $1, description = $2, price_per_night = $3, location = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 AND host_id = $6
       RETURNING *`,
      [title, description, pricePerNight, location, params.id, userId]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update property' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify ownership
    const property = await pool.query(
      'SELECT host_id FROM properties WHERE id = $1',
      [params.id]
    );

    if (!property.rows[0]) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    if (property.rows[0].host_id !== userId) {
      return NextResponse.json(
        { error: 'Not authorized to delete this property' },
        { status: 403 }
      );
    }

    // Delete the property
    await pool.query('DELETE FROM properties WHERE id = $1', [params.id]);

    return NextResponse.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    );
  }
}