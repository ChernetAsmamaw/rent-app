'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Slider } from '@/components/ui/slider';
import { 
  Home,
  Wifi,
  Car,
  GlassWater,
  Tv,
  Bath,
  CookingPot,
  Snowflake
} from 'lucide-react';

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [priceRange, setPriceRange] = useState([0, 1000]);

  const amenities = [
    { icon: <Wifi className="w-5 h-5" />, label: 'WiFi' },
    { icon: <Car className="w-5 h-5" />, label: 'Parking' },
    { icon: <GlassWater className="w-5 h-5" />, label: 'Pool' },
    { icon: <Tv className="w-5 h-5" />, label: 'TV' },
    { icon: <Bath className="w-5 h-5" />, label: 'Private Bath' },
    { icon: <CookingPot className="w-5 h-5" />, label: 'Kitchen' },
    { icon: <Snowflake className="w-5 h-5" />, label: 'AC' },
  ];

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set('minPrice', value[0].toString());
    params.set('maxPrice', value[1].toString());
    router.push(`/properties?${params.toString()}`);
  };

  const handleAmenityChange = (amenity: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentAmenities = params.get('amenities')?.split(',') || [];
    
    if (currentAmenities.includes(amenity)) {
      params.set('amenities', currentAmenities.filter(a => a !== amenity).join(','));
    } else {
      params.set('amenities', [...currentAmenities, amenity].join(','));
    }
    
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="glass-card space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Price Range</h3>
        <Slider
          defaultValue={[0, 1000]}
          min={0}
          max={1000}
          step={50}
          value={priceRange}
          onValueChange={handlePriceChange}
          className="mt-2"
        />
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Amenities</h3>
        <div className="space-y-2">
          {amenities.map((amenity) => (
            <label
              key={amenity.label}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                onChange={() => handleAmenityChange(amenity.label)}
              />
              <div className="flex items-center space-x-2">
                {amenity.icon}
                <span>{amenity.label}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Property Type</h3>
        <div className="space-y-2">
          {['House', 'Apartment', 'Villa', 'Cottage'].map((type) => (
            <label
              key={type}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="radio"
                name="propertyType"
                className="text-blue-600 focus:ring-blue-500"
                onChange={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set('type', type);
                  router.push(`/properties?${params.toString()}`);
                }}
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}