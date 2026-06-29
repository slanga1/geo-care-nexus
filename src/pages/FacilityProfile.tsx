import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Facility, CaseSeverity } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { MapPin, Star, Clock, Calendar as CalendarIcon, ChevronLeft, Send, Navigation } from 'lucide-react';
import { useGeolocation } from '../hooks/useGeolocation';
import { calculateDistance } from '../lib/utils';

export const FacilityProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { location: userLocation } = useGeolocation();
  const [facility, setFacility] = useState<Facility | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Booking Form State
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  const [severity, setSeverity] = useState<CaseSeverity>('low');
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchFacility = async () => {
      if (id) {
        const res = await api.facilities.getById(id);
        if (res.success && res.data) {
          setFacility(res.data);
        }
        setLoading(false);
      }
    };
    fetchFacility();
  }, [id]);

  const distance = facility && userLocation ? calculateDistance(
    userLocation.lat,
    userLocation.lng,
    facility.location.lat,
    facility.location.lng
  ) : null;

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !facility) return;

    setBookingLoading(true);
    try {
      const res = await api.bookings.create({ facilityId: facility.id, date, time, reason, severity });

      if (res.success) {
        toast.success('Appointment request sent successfully!');
        navigate('/dashboard');
      } else {
        toast.error(res.error || 'Failed to book appointment.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast.error(`Booking failed: ${errorMessage}`);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="py-20 text-center">Loading facility profile...</div>;
  if (!facility) return <div className="py-20 text-center">Facility not found.</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 px-4 sm:px-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 mb-4">
        <ChevronLeft className="h-4 w-4" /> Back to Search
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-lg">
            <img 
              src={facility.imageUrl} 
              alt={facility.name} 
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold">{facility.name}</h1>
                {distance !== null && (
                  <p className="text-primary font-medium flex items-center gap-1 mt-1">
                    <Navigation className="h-4 w-4" /> {distance.toFixed(1)} km from your location
                  </p>
                )}
                <p className="text-muted-foreground flex items-center gap-1 mt-2 text-lg">
                  <MapPin className="h-5 w-5" /> {facility.address}
                </p>
              </div>
              <div className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full font-bold self-start">
                <Star className="h-5 w-5 fill-current" /> {facility.rating}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {facility.specialties.map(s => (
                <Badge key={s} variant="secondary" className="px-3 py-1 text-sm">
                  {s}
                </Badge>
              ))}
            </div>

            <div className="prose max-w-none pt-4">
              <h3 className="text-xl font-bold mb-2">About the Facility</h3>
              <p className="text-muted-foreground leading-relaxed">
                {facility.description}
              </p>
            </div>

            <div className="pt-4">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5" /> Availability
              </h3>
              <div className="flex flex-wrap gap-3">
                {facility.availability.map(day => (
                  <div key={day} className="bg-slate-100 px-4 py-2 rounded-lg text-sm font-medium">
                    {day}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Booking Form */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-primary/20 lg:sticky lg:top-24">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <CalendarIcon className="h-6 w-6 text-primary" /> Book Appointment
            </h3>
            
            <form onSubmit={handleBooking} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Appointment Date</Label>
                <Input 
                  id="date" 
                  type="date" 
                  required 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time">Preferred Time</Label>
                <Select onValueChange={setTime} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00 AM">09:00 AM</SelectItem>
                    <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                    <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                    <SelectItem value="02:00 PM">02:00 PM</SelectItem>
                    <SelectItem value="03:00 PM">03:00 PM</SelectItem>
                    <SelectItem value="04:00 PM">04:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="severity">Case Severity</Label>
                <Select onValueChange={(v) => setSeverity(v as CaseSeverity)} defaultValue="low">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (Routine checkup)</SelectItem>
                    <SelectItem value="medium">Medium (Moderate pain/symptoms)</SelectItem>
                    <SelectItem value="high">High (Severe pain/fever)</SelectItem>
                    <SelectItem value="emergency">Emergency (Immediate attention)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for visit / Symptoms</Label>
                <Textarea 
                  id="reason" 
                  placeholder="Please describe your condition..."
                  className="min-h-[100px]"
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full h-12 text-base" disabled={bookingLoading}>
                {bookingLoading ? 'Requesting...' : 'Request Appointment'}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t">
              <Button variant="outline" className="w-full gap-2" onClick={() => navigate(`/messages?to=${facility.id}`)}>
                <Send className="h-4 w-4" /> Message Facility
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
