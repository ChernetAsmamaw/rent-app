import { Suspense } from 'react';
import Navigation from '@/components/Navigation';
import PropertyCard from '@/components/PropertyCard';
import FilterSidebar from '@/components/FilterSidebar';
import { FunnelIcon, Squares2X2Icon, ListBulletIcon } from '@heroicons/react/24/outline';
import pool from '@/lib/db';

async function getProperties(searchParams: { [key: string]: string } = {}) {
  let query = 'SELECT * FROM properties WHERE 1=1';
  const values: any[] = [];
  let paramIndex = 1;
  
  const { location, minPrice, maxPrice, sortBy } = searchParams;
  
  if (location) {
    query += ` AND LOWER(location) LIKE LOWER($${paramIndex})`;
    values.push(`%${location}%`);
    paramIndex++;
  }
  
  if (minPrice) {
    query += ` AND price_per_night >= $${paramIndex}`;
    values.push(minPrice);
    paramIndex++;
  }
  
  if (maxPrice) {
    query += ` AND price_per_night <= $${paramIndex}`;
    values.push(maxPrice);
    paramIndex++;
  }
  
  switch (sortBy) {
    case 'price_asc':
      query += ' ORDER BY price_per_night ASC';
      break;
    case 'price_desc':
      query += ' ORDER BY price_per_night DESC';
      break;
    default:
      query += ' ORDER BY created_at DESC';
  }
  
  const result = await pool.query(query, values);
  return result.rows;
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string };
}) {
  const properties = await getProperties(searchParams);
  const sortBy = searchParams?.sortBy || 'newest';

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-sky-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-8 mt-12">
          <div className="md:w-64 flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar />
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">
                  {properties.length} Properties Found
                </h1>
                <div className="flex items-center justify-end space-x-4">
                  <select 
                    className="min-w-[180px] h-10 border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 
                    focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-300 
                    shadow-sm transition-all duration-200 ease-in-out
                    appearance-none cursor-pointer hover:border-gray-400"
                    defaultValue={sortBy}
                  >
                    <option value="newest">Newest First</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                  </select>
                  
                  <div className="flex gap-2">
                    {/* <button className="p-2 rounded-lg hover:bg-sky-50 transition-colors">
                      <Squares2X2Icon className="h-5 w-5 text-gray-600" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-sky-50 transition-colors">
                      <ListBulletIcon className="h-5 w-5 text-gray-600" />
                    </button> */}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Suspense fallback={<div>Loading...</div>}>
                {properties.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </Suspense>
            </div>

            {properties.length === 0 && (
              <div className="bg-white shadow-sm rounded-lg p-12 text-center">
                <FunnelIcon className="h-12 w-12 mx-auto text-sky-200 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No properties found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search filters
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}