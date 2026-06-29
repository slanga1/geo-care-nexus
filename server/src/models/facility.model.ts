import { v4 as uuidv4 } from 'uuid';
import { Facility } from '../types/index.js';

// In-memory facility store
const facilities: Map<string, Facility> = new Map();

// These userIds must match the FACILITY_USER_IDS in user.model.ts
const FACILITY_USER_IDS = [
  'facility-user-1',
  'facility-user-2',
  'facility-user-3',
  'facility-user-4',
  'facility-user-5',
];

// Seed demo facilities with detailed data
const seedFacilities = () => {
  const demoFacilities: Omit<Facility, 'id'>[] = [
    {
      userId: FACILITY_USER_IDS[0],
      address: '123 Health Ave, Central City',
      specialties: ['Cardiology', 'Neurology', 'Emergency', 'General Medicine'],
      location: { lat: 40.7128, lng: -74.0060 },
      rating: 4.8,
      description: 'Providing world-class healthcare for over 50 years. Specialists in cardiac and neurological cases with state-of-the-art equipment and experienced medical staff.',
      imageUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=400&fit=crop',
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      phone: '+1 (555) 123-4567',
      website: 'https://citygeneral.hospital.com',
    },
    {
      userId: FACILITY_USER_IDS[1],
      address: '456 Family Lane, Suburbia',
      specialties: ['Pediatrics', 'Vaccination', 'Neonatology'],
      location: { lat: 40.7306, lng: -73.9352 },
      rating: 4.9,
      description: 'A friendly environment for your children. We specialize in pediatric care, routine vaccinations, and neonatal intensive care with compassionate staff.',
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=400&fit=crop',
      availability: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
      phone: '+1 (555) 234-5678',
      website: 'https://kidscare.clinic.com',
    },
    {
      userId: FACILITY_USER_IDS[2],
      address: '789 Bone St, Uptown',
      specialties: ['Orthopedics', 'Physiotherapy', 'Sports Medicine'],
      location: { lat: 40.7580, lng: -73.9855 },
      rating: 4.7,
      description: 'Expert care for bones and joints. Rehabilitation services available on-site. We treat fractures, joint replacements, and sports injuries.',
      imageUrl: 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=800&h=400&fit=crop',
      availability: ['Tuesday', 'Thursday', 'Saturday'],
      phone: '+1 (555) 345-6789',
      website: 'https://orthospecialist.med.com',
    },
    {
      userId: FACILITY_USER_IDS[3],
      address: '321 Wellness Blvd, Downtown',
      specialties: ['Dermatology', 'Cosmetology', 'Allergy'],
      location: { lat: 40.7489, lng: -73.9680 },
      rating: 4.6,
      description: 'Advanced dermatological care for all skin conditions. From acne treatment to cosmetic procedures, our team provides comprehensive skin health solutions.',
      imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&h=400&fit=crop',
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      phone: '+1 (555) 456-7890',
      website: 'https://dermacare.clinic.com',
    },
    {
      userId: FACILITY_USER_IDS[4],
      address: '555 Mental Health Ave, Midtown',
      specialties: ['Psychiatry', 'Psychology', 'Counseling'],
      location: { lat: 40.7549, lng: -73.9840 },
      rating: 4.8,
      description: 'Comprehensive mental health services including therapy, counseling, and psychiatric care. We provide a safe and confidential environment for healing.',
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=400&fit=crop',
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      phone: '+1 (555) 567-8901',
      website: 'https://mindwell.health.com',
    },
  ];

  demoFacilities.forEach(f => {
    const id = uuidv4();
    facilities.set(id, { id, ...f });
  });
};

seedFacilities();

export const FacilityModel = {
  findAll: (): Facility[] => {
    return Array.from(facilities.values());
  },

  findById: (id: string): Facility | undefined => {
    return facilities.get(id);
  },

  findBySpecialty: (specialty: string): Facility[] => {
    return Array.from(facilities.values()).filter(f =>
      f.specialties.some(s => s.toLowerCase().includes(specialty.toLowerCase()))
    );
  },

  search: (query: string): Facility[] => {
    const q = query.toLowerCase();
    return Array.from(facilities.values()).filter(f =>
      f.specialties.some(s => s.toLowerCase().includes(q)) ||
      f.description.toLowerCase().includes(q) ||
      f.address.toLowerCase().includes(q)
    );
  },

  create: (data: Omit<Facility, 'id'>): Facility => {
    const id = uuidv4();
    const facility: Facility = { id, ...data };
    facilities.set(id, facility);
    return facility;
  },

  update: (id: string, data: Partial<Facility>): Facility | undefined => {
    const existing = facilities.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...data };
    facilities.set(id, updated);
    return updated;
  },

  // Calculate distance between two coordinates (Haversine formula)
  calculateDistance: (
    lat1: number, lng1: number,
    lat2: number, lng2: number
  ): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },

  findByProximity: (lat: number, lng: number, radiusKm: number = 50): Facility[] => {
    return Array.from(facilities.values())
      .map(f => ({
        ...f,
        distance: FacilityModel.calculateDistance(lat, lng, f.location.lat, f.location.lng),
      }))
      .filter(f => f.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);
  },
};
