'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar, User, DollarSign, Check, X } from 'lucide-react';

interface Booking {
  id: string;
  propertyTitle: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  amount: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELED';
}

export default function HostBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    try {
      const response = await fetch('/api/bookings/host');
      if (!response.ok) throw new Error('Failed to fetch bookings');
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleStatusUpdate(bookingId: string, status: 'CONFIRMED' | 'CANCELED') {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (!response.ok) throw new Error('Failed to update booking');
      fetchBookings(); // Refresh the list
    } catch (error) {
      console.error('Error:', error);
    }
  }

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {bookings.map((booking) => (
          <div key={booking.id} 
               className="glass-card p-6 flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{booking.propertyTitle}</h3>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{booking.guestName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(new Date(booking.checkIn), 'MMM d')} - {format(new Date(booking.checkOut), 'MMM d')}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span>${booking.amount}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-sm ${
                booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {booking.status}
              </span>
              
              {booking.status === 'PENDING' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusUpdate(booking.id, 'CONFIRMED')}
                    className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(booking.id, 'CANCELED')}
                    className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}