import { auth } from '@clerk/nextjs/server';
import { redirect, notFound } from 'next/navigation';
import Navigation from '@/components/Navigation';
import PropertyForm from '@/components/PropertyForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import pool from '@/lib/db';

async function getProperty(id: string, userId: string) {
  try {
    const result = await pool.query(
      `SELECT 
        p.*,
        COUNT(DISTINCT b.id) as total_bookings
       FROM properties p
       LEFT JOIN bookings b ON p.id = b.property_id
       WHERE p.id = $1 AND p.host_id = $2
       GROUP BY p.id`,
      [id, userId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching property:', error);
    return null;
  }
}

export default async function EditPropertyPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  // Ensure params is awaited
  const id = await Promise.resolve(params.id);
  const property = await getProperty(id, userId);
  
  if (!property) notFound();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-sky-50">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 p-4 border-b border-gray-200">
          <Link 
            href="/dashboard/properties" 
            className="inline-flex items-center px-4 py-2 mt-12 border border-gray-300 rounded-md text-gray-600 hover:text-gray-900 hover:border-gray-400 transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Properties
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="border-b border-gray-200 p-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Edit Property
            </h1>
            <p className="mt-2 text-gray-600">
              Update your property information below
            </p>
          </div>

          <div className="p-6">
            <PropertyForm 
              property={{
                id: property.id,
                title: property.title,
                description: property.description,
                location: property.location,
                pricePerNight: property.price_per_night,
                amenities: property.amenities || [],
                images: property.images || []
              }} 
            />
          </div>
        </div>

        <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200 text-center">
          <span className="text-sm text-gray-500">
            This property has {property.total_bookings || 0} bookings
          </span>
        </div>
      </main>
    </div>
  );
}