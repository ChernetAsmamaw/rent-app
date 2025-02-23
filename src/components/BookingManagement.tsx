'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import DeleteConfirmationModal from './DeleteConfirmationModal';

type Booking = {
  id: string;
  check_in: string;
  check_out: string;
  status: string;
  property: {
    title: string;
    location: string;
  };
};

export default function BookingManagement({ booking }: { booking: Booking }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const handleCancel = async () => {
    try {
      const response = await fetch(`/api/bookings/${booking.id}/cancel`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to cancel booking');
      window.location.reload();
    } catch (error) {
      console.error('Error canceling booking:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold">{booking.property.title}</h3>
      <p className="text-gray-600">{booking.property.location}</p>
      
      <div className="mt-4">
        <p>Check-in: {format(new Date(booking.check_in), 'PPP')}</p>
        <p>Check-out: {format(new Date(booking.check_out), 'PPP')}</p>
        <p className="mt-2">
          <span className={`inline-block px-2 py-1 rounded text-sm ${
            booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
            booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {booking.status}
          </span>
        </p>
      </div>

      <div className="mt-4 space-x-4">
        {booking.status !== 'CANCELED' && (
          <button
            onClick={() => setIsDeleting(true)}
            className="text-red-600 hover:text-red-800"
          >
            Cancel Booking
          </button>
        )}
        {booking.status === 'CONFIRMED' && (
          <button
            onClick={() => setShowReview(true)}
            className="text-blue-600 hover:text-blue-800"
          >
            Leave Review
          </button>
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        onConfirm={handleCancel}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
      />
    </div>
  );
}