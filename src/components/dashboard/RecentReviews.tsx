import { Star } from 'lucide-react';
import Image from 'next/image';

interface Review {
  id: string;
  propertyTitle: string;
  guestName: string;
  guestImage: string;
  rating: number;
  comment: string;
  date: string;
}

export default function RecentReviews({ reviews }: { reviews: Review[] }) {
  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-semibold mb-6">Recent Reviews</h2>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="p-4 rounded-xl bg-white/50 hover:bg-white/80 transition-colors">
            <div className="flex items-start gap-4">
              <div className="relative h-10 w-10 rounded-full overflow-hidden">
                <Image
                  src={review.guestImage}
                  alt={review.guestName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{review.guestName}</h3>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{review.propertyTitle}</p>
                <p className="mt-2 text-gray-700">{review.comment}</p>
                <p className="text-sm text-gray-500 mt-2">{review.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}