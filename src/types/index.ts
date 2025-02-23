export type Property = {
  id: string;
  title: string;
  description: string;
  pricePerNight: number;
  location: string;
  hostId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Booking = {
  id: string;
  propertyId: string;
  renterId: string;
  checkIn: Date;
  checkOut: Date;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELED';
  createdAt: Date;
  updatedAt: Date;
};

export type User = {
  id: string;
  email: string;
  name: string;
  role: 'RENTER' | 'HOST';
  clerkId: string;
};