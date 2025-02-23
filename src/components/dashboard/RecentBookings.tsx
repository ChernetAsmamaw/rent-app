import { format } from 'date-fns';
import { Calendar, User, DollarSign } from 'lucide-react';

interface Booking {
  id: string;
  propertyTitle: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  amount: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELED';
}

export default function RecentBookings({ bookings }: { bookings: Booking[] }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CANCELED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-semibold mb-6">Recent Bookings</h2>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="flex items-center p-4 rounded-xl bg-white/50 hover:bg-white/80 transition-colors">
            <div className="flex-1">
              <h3 className="font-semibold">{booking.propertyTitle}</h3>
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
            <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(booking.status)}`}>
              {booking.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}