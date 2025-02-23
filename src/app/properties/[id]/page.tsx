import { auth } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Navigation from '@/components/Navigation';
import BookingForm from '@/components/BookingForm';
import pool from '@/lib/db';

async function getProperty(id: string) {
  const result = await pool.query(
    `SELECT p.*, u.name as host_name 
     FROM properties p
     JOIN users u ON p.host_id = u.clerk_id
     WHERE p.id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

async function getUserRole(userId: string) {
  const result = await pool.query(
    'SELECT role FROM users WHERE clerk_id = $1',
    [userId]
  );
  return result.rows[0]?.role;
}

export default async function PropertyPage({
  params,
}: {
  params: { id: string };
}) {
  // Await all async operations together
  const [{ userId }, property, userRole] = await Promise.all([
    auth(),
    getProperty(params.id),
    auth().then(({ userId }) => userId ? getUserRole(userId) : null)
  ]);

  if (!property) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8 mt-12">
            <div className="rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="relative">
                <Image
                  src="/placeholder-property.png"
                  alt={property.title}
                  width={600}
                  height={600}
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            
            <div className="backdrop-blur-md bg-white/70 rounded-2xl p-8 shadow-lg">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {property.title}
              </h1>
              <p className="text-gray-600 mt-2 flex items-center">
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {property.location}
              </p>
              <p className="text-2xl font-semibold text-blue-600 mt-4 flex items-center">
                <span className="text-3xl">${property.price_per_night}</span>
                <span className="text-gray-500 text-base ml-2">/ night</span>
              </p>
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">About this place</h2>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </div>
            </div>
          </div>

          <div className="md:sticky md:top-24 h-fit">
            <div className="backdrop-blur-md bg-white/70 rounded-2xl p-8 shadow-lg">
              {userRole === 'RENTER' ? (
                <BookingForm property={property} />
              ) : (
                <div className="bg-yellow-50/80 backdrop-blur-sm border border-yellow-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                    Booking Restricted
                  </h3>
                  <p className="text-yellow-700">
                    {userId ? 
                      "Only renters can make bookings. Please switch to a renter account to book this property." :
                      "Please sign in as a renter to book this property."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}