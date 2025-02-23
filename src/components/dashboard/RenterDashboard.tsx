'use client';

import { useState, useEffect } from 'react';
import { Home, Calendar, DollarSign } from 'lucide-react';
import StatsCard from './StatsCard';
import BookingChart from './BookingChart';

interface Booking {
  id: string;
  propertyTitle: string;
  location: string;
  checkIn: string;
  checkOut: string;
  amount: number;
  status: string;
}

export default function RenterDashboard() {
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
        console.error('Error fetching bookings:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBookings();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  const stats = [
    {
      title: "Places Visited",
      value: new Set(bookings.map(b => b.location)).size,
      icon: <Home className="h-6 w-6" />,
      trend: "up",
      percentage: "15%",
      color: "blue"
    },
    {
      title: "Total Spent",
      value: `$${bookings.reduce((sum, b) => sum + b.amount, 0)}`,
      icon: <DollarSign className="h-6 w-6" />,
      trend: "up",
      percentage: "23%",
      color: "green"
    },
    {
      title: "Total Bookings",
      value: bookings.length,
      icon: <Calendar className="h-6 w-6" />,
      trend: "up",
      percentage: "18%",
      color: "purple"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatsCard 
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend as 'up' | 'down'}
            percentage={stat.percentage}
            color={stat.color as 'blue' | 'green' | 'purple' | 'orange'}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4">Booking History</h2>
          <BookingChart />
        </div>
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4">Spending Analytics</h2>
          <BookingChart type="spending" />
        </div>
      </div>
    </div>
  );
}