'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Edit, Trash2, Home, MapPin, DollarSign, Eye } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  price_per_night: number;
  images: string[];
  total_bookings: number;
  rating: number;
}

export default function HostProperties() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const response = await fetch('/api/properties/host');
        if (!response.ok) throw new Error('Failed to fetch properties');
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProperties();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete property');
      setProperties(properties.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <div key={property.id} className="bg-gradient-to-br from-white to-sky-50 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="relative h-48">
            {property.images[0] ? (
              <Image
                src={property.images[0]}
                alt={property.title}
                fill
                className="object-cover"
              />
            ) : (
              <Image
                src="/placeholder-property.png"
                alt="Property placeholder"
                fill
                className="object-cover"
              />
            )}
          </div>
          
          <div className="p-6 bg-gradient-to-b from-white/80 to-sky-50/80">
            <h3 className="text-xl font-semibold mb-2 text-sky-900">{property.title}</h3>
            <div className="space-y-2 text-sky-700">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{property.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                <span>${property.price_per_night} per night</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-sky-100">
              <div className="flex justify-between items-center">
                <div className="text-sm text-sky-600">
                  {property.total_bookings} bookings
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/properties/${property.id}`)}
                    className="p-2 rounded-lg hover:bg-sky-50 transition-colors"
                    title="View Property"
                  >
                    <Eye className="w-4 h-4 text-sky-600" />
                  </button>
                  <button
                    onClick={() => router.push(`/properties/${property.id}/edit`)}
                    className="p-2 rounded-lg hover:bg-sky-50 transition-colors"
                    title="Edit Property"
                  >
                    <Edit className="w-4 h-4 text-sky-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(property.id)}
                    className="p-2 rounded-lg hover:bg-sky-50 transition-colors"
                    title="Delete Property"
                  >
                    <Trash2 className="w-4 h-4 text-sky-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}