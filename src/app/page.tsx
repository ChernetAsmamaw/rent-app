import { Suspense } from 'react';
import Navigation from '@/components/Navigation';
import PropertyCard from '@/components/PropertyCard';
import SearchBar from '@/components/SearchBar';
import FeaturedSection from '@/components/';
import pool from '@/lib/db';
import {Calendar1Icon, Clock, House, Key, MapIcon, Search, VerifiedIcon} from 'lucide-react' 

async function getProperties() {
  const result = await pool.query('SELECT * FROM properties ORDER BY created_at DESC LIMIT 6');
  return result.rows;
}

export default async function Home() {
  const properties = await getProperties();

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center">
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-sky-100/40 to-sky-200/50 " />
        
        <div className="relative max-w-7xlmt-10  mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-6xl md:text-7xl font-extrabold text-sky-600 mb-6 mt-10 animate-fade-in">
            Find Your Perfect Stay
          </h1>
          <p className="text-2xl text-gray-500 mb-8 animate-slide-up">
            Discover unique homes and experiences around the world
          </p>
          <SearchBar />
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-10 bg-gradient-to-b from-sky-200/50 to-sky-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-sky-100 mb-12 text-sky-600 text-center">Featured Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Suspense fallback={<div>Loading...</div>}>
              {properties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </Suspense>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-b from-sky-300 to-white backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-sky-800 text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {steps.map((step, index) => (
              <div key={index} className="glass-card text-center p-8 hover:shadow-xl transition-all duration-300 rounded-xl bg-white/80">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-sky-400 to-sky-600 flex items-center justify-center transform hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-sky-900">{step.title}</h3>
                <p className="text-sky-700">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and Company Info */}
            <div className="col-span-1 md:col-span-2">
              <img 
                src="/logo.png" 
                alt="Company Logo" 
                className="h-24 w-auto mb-4"
              />
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-sky-600">About Us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-sky-600">Properties</a></li>
                <li><a href="#" className="text-gray-600 hover:text-sky-600">Contact</a></li>
                <li><a href="#" className="text-gray-600 hover:text-sky-600">Support</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Contact Us</h3>
              <ul className="space-y-3">
                <li className="text-gray-600">Email: info@rental.com</li>
                <li className="text-gray-600">Phone: +1 (555) 123-4567</li>
                <li className="text-gray-600">Address: 123 Rental Street, City, Country</li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-center text-gray-500 text-sm">
              © {new Date().getFullYear()} Rental. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}


const steps = [
  {
    icon: <Search className="w-8 h-8 text-white" />,
    title: "Search",
    description: "Browse through our extensive collection of premium properties"
  },
  {
    icon: < Calendar1Icon className="w-8 h-8 text-white" />,
    title: "Book",
    description: "Select your dates and book your stay with instant confirmation"
  },
  {
    icon: <House className="w-8 h-8 text-white" />,
    title: "Stay",
    description: "Enjoy your comfortable stay with our 24/7 customer support"
  }
];

// Add features section
const features = [
  {
    icon: <MapIcon className="w-8 h-8 text-blue-600" />,
    title: "Prime Locations",
    description: "Properties in the most sought-after destinations"
  },
  {
    icon: <VerifiedIcon className="w-8 h-8 text-blue-600" />,
    title: "Verified Hosts",
    description: "All our hosts are carefully vetted for quality service"
  },
  {
    icon: <Clock className="w-8 h-8 text-blue-600" />,
    title: "Instant Booking",
    description: "Quick and easy booking process with instant confirmation"
  }
];

// Add a new Features section after How It Works
<section className="py-16 bg-gradient-to-b from-blue-50 to-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-3xl font-bold gradient-text text-center mb-12">Why Choose Us</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <div key={index} className="glass-card hover:scale-105 transition-transform duration-300">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-50 flex items-center justify-center">
            {feature.icon}
          </div>
          <h3 className="text-xl font-semibold mb-4 text-center">{feature.title}</h3>
          <p className="text-gray-600 text-center">{feature.description}</p>
        </div>
      ))}
    </div>
  </div>
</section>

const stats = [
  { value: "1000+", label: "Properties" },
  { value: "50k+", label: "Happy Guests" },
  { value: "100+", label: "Cities" },
  { value: "24/7", label: "Support" }
];