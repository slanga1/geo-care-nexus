import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowRight, Shield, Clock, MapPin, Search, Calendar } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center gap-12 pt-8">
        <div className="flex-1 space-y-6">
          <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight">
            Connect with your <span className="text-primary">Medical Experts</span> instantly.
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Find the nearest hospitals and specialists based on your illness and case severity. 
            Book appointments and message doctors all in one secure platform.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/signup">
              <Button size="lg" className="h-12 px-8 text-base gap-2">
                Get Started Now <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/signin">
              <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                Login
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Secure Data
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              24/7 Access
            </div>
          </div>
        </div>
        <div className="flex-1 w-full relative">
          <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-secondary rounded-full blur-2xl opacity-50"></div>
            <img 
              src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/8eaad459-9c73-4a4f-8c4c-1e3dfa0ec35c/hero-image-a123b2d1-1782728161310.webp" 
              alt="Telemedicine" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border space-y-4">
          <div className="h-12 w-12 bg-secondary rounded-xl flex items-center justify-center text-secondary-foreground mb-2">
            <MapPin className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold">Location-based Matching</h3>
          <p className="text-muted-foreground">
            Automatically find healthcare facilities nearest to you, saving critical time during emergencies.
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border space-y-4">
          <div className="h-12 w-12 bg-secondary rounded-xl flex items-center justify-center text-secondary-foreground mb-2">
            <Search className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold">Specialty Search</h3>
          <p className="text-muted-foreground">
            Search by illness or medical specialty to ensure you get the right care from the right professional.
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border space-y-4">
          <div className="h-12 w-12 bg-secondary rounded-xl flex items-center justify-center text-secondary-foreground mb-2">
            <Calendar className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold">Instant Booking</h3>
          <p className="text-muted-foreground">
            Book appointments directly through the app and receive instant confirmations from the facility.
          </p>
        </div>
      </section>
    </div>
  );
};
