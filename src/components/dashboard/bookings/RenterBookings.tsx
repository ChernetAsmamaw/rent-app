'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar, MapPin, DollarSign, Home } from 'lucide-react';

interface Booking {
  id: string;
  propertyTitle: string;
  location: string;
  checkIn: string;
  checkOut: string;
  amount: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELED';
}

export default function RenterBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await fetch('/api/bookings/renter');
        if (!response.ok) throw new Error('Failed to fetch bookings');
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBookings();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  const upcomingBookings = bookings.filter(b => 
    ['CONFIRMED', 'PENDING'].includes(b.status) && 
    new Date(b.checkIn) >= new Date()
  );
  
  const pastBookings = bookings.filter(b => 
    new Date(b.checkOut) < new Date() || b.status === 'CANCELED'
  );

  return (
    <div className="space-y-8">
      {/* Upcoming Bookings */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Upcoming Stays</h2>
        <div className="grid grid-cols-1 gap-4">
          {upcomingBookings.map((booking) => (
            <div key={booking.id} className="glass-card p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Home className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-lg">{booking.propertyTitle}</h3>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{booking.location}</span>
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
                <span className={`px-3 py-1 rounded-full text-sm ${
                  booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                  booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {booking.status}
                </span>
              </div>
            </div>
          ))}
          {upcomingBookings.length === 0 && (
            <p className="text-gray-500 text-center py-8">No upcoming bookings</p>
          )}
        </div>
      </section>

      {/* Past Bookings */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Past Stays</h2>
        <div className="grid grid-cols-1 gap-4">
          {pastBookings.map((booking) => (
            <div key={booking.id} className="glass-card p-6 opacity-75">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Home className="h-5 w-5 text-gray-600" />
                    <h3 className="font-semibold text-lg">{booking.propertyTitle}</h3>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{booking.location}</span>
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
                <span className={`px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800`}>
                  Completed
                </span>
              </div>
            </div>
          ))}
          {pastBookings.length === 0 && (
            <p className="text-gray-500 text-center py-8">No past bookings</p>
          )}
        </div>
      </section>
    </div>
  );
}