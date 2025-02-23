'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Wifi, Car, Bath, LucideMicrowave, Tv, Snowflake, 
  Upload, Loader2, Home, MapPin, DollarSign 
} from 'lucide-react';

interface PropertyFormData {
  id?: string;
  title: string;
  description: string;
  pricePerNight: number;
  location: string;
  amenities: string[];
  images: File[];
}

const amenitiesList = [
  { icon: <Wifi className="w-5 h-5" />, label: 'WiFi', value: 'wifi' },
  { icon: <Car className="w-5 h-5" />, label: 'Parking', value: 'parking' },
  { icon: <Bath className="w-5 h-5" />, label: 'Private Bath', value: 'private_bath' },
  { icon: <LucideMicrowave className="w-5 h-5" />, label: 'Kitchen', value: 'kitchen' },
  { icon: <Tv className="w-5 h-5" />, label: 'TV', value: 'tv' },
  { icon: <Snowflake className="w-5 h-5" />, label: 'AC', value: 'ac' },
];

export default function PropertyForm({ property }: { property?: PropertyFormData }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<PropertyFormData>({
    title: property?.title || '',
    description: property?.description || '',
    pricePerNight: property?.pricePerNight || 0,
    location: property?.location || '',
    amenities: property?.amenities || [],
    images: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(property ? `/api/properties/${property.id}` : '/api/properties', {
        method: property ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save property');
      router.push('/dashboard/properties');
      router.refresh();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-sky-50 to-white rounded-2xl shadow-lg p-8 transition-all hover:shadow-xl">
        <h2 className="text-2xl font-semibold mb-6 text-sky-900">Basic Information</h2>
        <div className="space-y-6">
          <div>
            <label className="flex items-center gap-2 text-sky-700 font-medium mb-2">
              <Home className="w-5 h-5" />
              Property Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-sky-100 focus:border-sky-300 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sky-700 font-medium mb-2">
              <MapPin className="w-5 h-5" />
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-sky-100 focus:border-sky-300 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sky-700 font-medium mb-2">
              <DollarSign className="w-5 h-5" />
              Price per Night
            </label>
            <input
              type="number"
              value={formData.pricePerNight}
              onChange={e => setFormData({ ...formData, pricePerNight: Number(e.target.value) })}
              className="w-full px-4 py-3 rounded-xl border border-sky-100 focus:border-sky-300 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
              required
              min="0"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sky-700 font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-sky-100 focus:border-sky-300 focus:ring-2 focus:ring-sky-200 outline-none transition-all resize-none"
              rows={4}
              required
            />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-sky-50 to-white rounded-2xl shadow-lg p-8 transition-all hover:shadow-xl">
        <h2 className="text-2xl font-semibold mb-6 text-sky-900">Amenities</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {amenitiesList.map((amenity) => (
            <label
              key={amenity.value}
              className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all
                ${formData.amenities.includes(amenity.value)
                  ? 'bg-gradient-to-r from-sky-100 to-sky-50 border-sky-200 text-sky-700 shadow-md'
                  : 'bg-white border-gray-100 hover:bg-gray-50'
                } border shadow-sm hover:shadow-md`}
            >
              <input
                type="checkbox"
                checked={formData.amenities.includes(amenity.value)}
                onChange={(e) => {
                  const newAmenities = e.target.checked
                    ? [...formData.amenities, amenity.value]
                    : formData.amenities.filter(a => a !== amenity.value);
                  setFormData({ ...formData, amenities: newAmenities });
                }}
                className="hidden"
              />
              {amenity.icon}
              <span className="font-medium">{amenity.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-sky-50 to-white rounded-2xl shadow-lg p-8 transition-all hover:shadow-xl">
        <h2 className="text-2xl font-semibold mb-6 text-sky-900">Images</h2>
        <div className="grid grid-cols-1 gap-4">
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-sky-200 rounded-xl p-4 cursor-pointer hover:bg-sky-50 transition-all">
            <Upload className="w-10 h-10 text-sky-400 mb-3" />
            <span className="text-sm text-sky-600 font-medium">Drop images here or click to upload</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={e => setFormData({ ...formData, images: Array.from(e.target.files || []) })}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white hover:from-sky-600 hover:to-sky-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
              Saving...
            </>
          ) : (
            'Save Property'
          )}
        </button>
      </div>
    </form>
  );
}