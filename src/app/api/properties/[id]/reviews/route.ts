import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const reviews = await pool.query(
      `SELECT r.*, u.name as user_name
       FROM reviews r
       JOIN bookings b ON r.booking_id = b.id
       JOIN users u ON r.user_id = u.id
       WHERE b.property_id = $1
       ORDER BY r.created_at DESC`,
      [params.id]
    );

    const stats = await pool.query(
      `SELECT 
        COUNT(*) as total_reviews,
        AVG(rating) as average_rating,
        COUNT(CASE WHEN rating = 1 THEN 1 END) as rating_1,
        COUNT(CASE WHEN rating = 2 THEN 1 END) as rating_2,
        COUNT(CASE WHEN rating = 3 THEN 1 END) as rating_3,
        COUNT(CASE WHEN rating = 4 THEN 1 END) as rating_4,
        COUNT(CASE WHEN rating = 5 THEN 1 END) as rating_5
       FROM reviews r
       JOIN bookings b ON r.booking_id = b.id
       WHERE b.property_id = $1`,
      [params.id]
    );

    const ratingDistribution = {
      1: parseInt(stats.rows[0].rating_1),
      2: parseInt(stats.rows[0].rating_2),
      3: parseInt(stats.rows[0].rating_3),
      4: parseInt(stats.rows[0].rating_4),
      5: parseInt(stats.rows[0].rating_5),
    };

    return NextResponse.json({
      reviews: reviews.rows,
      stats: {
        totalReviews: parseInt(stats.rows[0].total_reviews),
        averageRating: parseFloat(stats.rows[0].average_rating) || 0,
        ratingDistribution,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}