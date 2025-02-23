import Image from 'next/image';
import Link from 'next/link';
import { Property } from '@/types';
import { MapPinIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

export default function PropertyCard({ property }: { property: Property }) {
  return (
    <Link href={`/properties/${property.id}`}>
      <div className="group px-5 py-2 bg-white/60 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-white/20">
        <div className="relative h-45 overflow-hidden">
          <Image
            src="/placeholder-property.png"
            alt={property.title}
            width={300}
            height={300}
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-sky-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <div className="p-5 space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 group-hover:text-sky-600 transition-colors">
            {property.title}
          </h3>
          
          <div className="flex items-center space-x-2 text-gray-600">
            <MapPinIcon className="h-4 w-4 text-sky-500" />
            <p className="text-sm">{property.location}</p>
          </div>
          
          <div className="flex items-baseline space-x-1 text-sky-600">
            <CurrencyDollarIcon className="h-5 w-5" />
            <span className="text-2xl font-bold">
              {property.price_per_night}
            </span>
            <span className="text-gray-500 text-sm">/ night</span>
          </div>
        </div>
      </div>
    </Link>
  );
}