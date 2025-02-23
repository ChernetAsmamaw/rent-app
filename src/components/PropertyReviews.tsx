'use client';

import { useState, useEffect } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { format } from 'date-fns';

type Review = {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user: {
    name: string;
  };
};

type Props = {
  propertyId: string;
};

export default function PropertyReviews({ propertyId }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/properties/${propertyId}/reviews`);
        const data = await response.json();
        setReviews(data.reviews);
        setStats(data.stats);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [propertyId]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Reviews Summary</h3>
        <div className="flex items-center space-x-2">
          <span className="text-3xl font-bold">{stats.averageRating.toFixed(1)}</span>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                className={`h-5 w-5 ${
                  star <= Math.round(stats.averageRating)
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-gray-600">({stats.totalReviews} reviews)</span>
        </div>

        <div className="mt-4 space-y-2">
          {Object.entries(stats.ratingDistribution).reverse().map(([rating, count]) => (
            <div key={rating} className="flex items-center space-x-2">
              <span className="w-12 text-sm">{rating} stars</span>
              <div className="flex-1 h-2 bg-gray-200 rounded">
                <div
                  className="h-full bg-yellow-400 rounded"
                  style={{
                    width: `${(count / stats.totalReviews) * 100}%`
                  }}
                />
              </div>
              <span className="text-sm text-gray-600">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`h-4 w-4 ${
                      star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">by {review.user.name}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">
                {format(new Date(review.created_at), 'PP')}
              </span>
            </div>
            <p className="text-gray-700">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}