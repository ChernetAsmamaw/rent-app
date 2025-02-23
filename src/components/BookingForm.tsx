'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarDaysIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default function BookingForm({ property }: { property: any }) {
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: property.id,
          checkIn: checkIn.toISOString(),
          checkOut: checkOut.toISOString(),
        }),
      });

      if (!response.ok) throw new Error('Failed to book property');
      router.push('/dashboard');
    } catch (error) {
      console.error('Booking error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTotal = () => {
    if (!checkIn || !checkOut) return 0;
    const days = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    return days * property.price_per_night;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="glass-card space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold gradient-text">Book Your Stay</h3>
          <div className="flex items-center text-blue-600">
            <CurrencyDollarIcon className="h-5 w-5" />
            <span className="text-xl font-bold">{property.price_per_night}</span>
            <span className="text-gray-500 text-sm ml-1">/ night</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Check-in</label>
            <div className="relative">
              <DatePicker
                selected={checkIn}
                onChange={date => setCheckIn(date)}
                selectsStart
                startDate={checkIn}
                endDate={checkOut}
                minDate={new Date()}
                placeholderText="Select date"
                className="input-field pl-10"
              />
              <CalendarDaysIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Check-out</label>
            <div className="relative">
              <DatePicker
                selected={checkOut}
                onChange={date => setCheckOut(date)}
                selectsEnd
                startDate={checkIn}
                endDate={checkOut}
                minDate={checkIn || new Date()}
                placeholderText="Select date"
                className="input-field pl-10"
              />
              <CalendarDaysIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        {checkIn && checkOut && (
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Total ({Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))} nights)</span>
              <span className="font-semibold">${calculateTotal()}</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={!checkIn || !checkOut || isSubmitting}
          className={`btn-primary w-full ${(!checkIn || !checkOut || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? 'Booking...' : 'Book Now'}
        </button>
      </div>
    </form>
  );
}