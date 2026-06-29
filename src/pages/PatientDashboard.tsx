import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Facility } from '../types';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Search, MapPin, Star, Activity, Navigation } from 'lucide-react';
import { useGeolocation } from '../hooks/useGeolocation';
import { calculateDistance } from '../lib/utils';

export const PatientDashboard: React.FC = () => {
  const { location: userLocation } = useGeolocation();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [allSpecialties, setAllSpecialties] = useState<string[]>([]);
  const [activeSpecialty, setActiveSpecialty] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialFetch = async () => {
      setLoading(true);
      const [facilitiesRes, specialtiesRes] = await Promise.all([
        api.facilities.getAll(),
        api.facilities.getSpecialties(),
      ]);

      if (facilitiesRes.success && facilitiesRes.data) {
        setFacilities(facilitiesRes.data);
      }
      if (specialtiesRes.success && specialtiesRes.data) {
        setAllSpecialties(specialtiesRes.data);
      }
      setLoading(false);
    };
    initialFetch();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    let query = searchQuery;
    if (activeSpecialty) {
      query = `${searchQuery} ${activeSpecialty}`.trim();
    }
    const res = await api.facilities.search(query);
    if (res.success && res.data) {
      setFacilities(res.data);
    }
    setLoading(false);
  };

  const handleSpecialtyClick = (specialty: string | null) => {
    setActiveSpecialty(specialty);
    // Trigger search after state update
    setTimeout(handleSearch, 0);
  };

  const sortedFacilities = [...facilities].map(f => {
    if (userLocation) {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        f.location.lat,
        f.location.lng
      );
      return { ...f, distance };
    }
    return f;
  }).sort((a, b) => {
    if (a.distance && b.distance) return a.distance - b.distance;
    return 0;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Find Care</h1>
          <p className="text-muted-foreground text-lg">
            Search for the nearest hospitals and clinics.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by illness, hospital name, or specialty..." 
            className="pl-10 h-11 text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch} className="h-11 px-8">Search</Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
        <Button 
          variant={activeSpecialty === null ? 'default' : 'outline'}
          onClick={() => handleSpecialtyClick(null)}
          className="whitespace-nowrap"
        >
          All Specialties
        </Button>
        {allSpecialties.map(specialty => (
          <Button 
            key={specialty}
            variant={activeSpecialty === specialty ? 'default' : 'outline'}
            onClick={() => handleSpecialtyClick(specialty)}
            className="whitespace-nowrap"
          >
            {specialty}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 rounded-xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedFacilities.map(facility => (
            <Card key={facility.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={facility.imageUrl} 
                  alt={facility.name} 
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-2 right-2 bg-white/90 text-primary hover:bg-white">
                  <Star className="h-3 w-3 fill-current mr-1" /> {facility.rating}
                </Badge>
              </div>
              <CardHeader className="p-4">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{facility.name}</CardTitle>
                </div>
                <CardDescription className="flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" /> {facility.address}
                </CardDescription>
                {facility.distance !== undefined && (
                  <CardDescription className="flex items-center gap-1 mt-1 text-primary font-medium">
                    <Navigation className="h-3 w-3" /> {facility.distance.toFixed(1)} km away
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3">
                <div className="flex flex-wrap gap-2">
                  {facility.specialties.slice(0, 3).map(s => (
                    <Badge key={s} variant="secondary" className="font-normal">
                      {s}
                    </Badge>
                  ))}
                  {facility.specialties.length > 3 && (
                    <span className="text-xs text-muted-foreground">+{facility.specialties.length - 3} more</span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground line-clamp-2">
                  {facility.description}
                </div>
              </CardContent>
              <CardFooter className="p-4 border-t bg-slate-50/50">
                <Link to={`/facility/${facility.id}`} className="w-full">
                  <Button className="w-full gap-2">
                    <Activity className="h-4 w-4" /> View & Book
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
          {facilities.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              No medical facilities found matching your search.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
