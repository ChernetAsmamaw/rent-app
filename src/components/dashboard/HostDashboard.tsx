'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Users, Calendar, DollarSign, House } from 'lucide-react';
import StatsCard from './StatsCard';
import BookingChart from './BookingChart';
import RecentBookings from './RecentBookings';
import RecentReviews from './RecentReviews';

interface Property {
  id: string;
  title: string;
  price_per_night: number;
}

interface Booking {
  id: string;
  propertyTitle: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  amount: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELED';
}

export default function HostDashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [propertiesRes, bookingsRes] = await Promise.all([
          fetch('/api/properties'),
          fetch('/api/bookings')
        ]);

        if (!propertiesRes.ok || !bookingsRes.ok) throw new Error('Failed to fetch data');

        const propertiesData = await propertiesRes.json();
        const bookingsData = await bookingsRes.json();

        setProperties(propertiesData);
        // Transform the booking data to match the expected format
        const transformedBookings = bookingsData.map((booking: any) => ({
          id: booking.id,
          propertyTitle: booking.property.title,
          guestName: booking.renter.name,
          checkIn: booking.check_in,
          checkOut: booking.check_out,
          amount: booking.property.price_per_night,
          status: booking.status
        }));
        setBookings(transformedBookings);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const totalRevenue = properties.reduce((sum, property) => sum + property.price_per_night, 0);
  const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED').length;

  const stats = [
    {
      title: "Total Properties",
      value: properties.length,
      icon: <House className="h-6 w-6" />,
      trend: "up",
      percentage: "15%",
      color: "blue"
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue}`,
      icon: <DollarSign className="h-6 w-6" />,
      trend: "up",
      percentage: "23%",
      color: "green"
    },
    {
      title: "Confirmed Bookings",
      value: confirmedBookings,
      icon: <Calendar className="h-6 w-6" />,
      trend: "up",
      percentage: "18%",
      color: "purple"
    },
    {
      title: "Total Guests",
      value: bookings.length,
      icon: <Users className="h-6 w-6" />,
      trend: "up",
      percentage: "12%",
      color: "orange"
    }
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          <h2 className="text-xl font-semibold mb-4">Booking Trends</h2>
          <BookingChart />
        </div>
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4">Revenue Analytics</h2>
          <BookingChart type="revenue" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentBookings bookings={bookings.slice(0, 5).map(booking => ({

          ...booking,
          status: booking.status === 'CANCELED' ? 'CANCELLED' : booking.status
        }))} />
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Properties</h2>
          <div className="space-y-4">
            {properties.slice(0, 5).map((property) => (
              <div key={property.id} className="p-4 bg-white/50 rounded-xl hover:bg-white/80 transition-colors">
                <h3 className="font-semibold">{property.title}</h3>
                <p className="text-sm text-gray-600">${property.price_per_night} per night</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}