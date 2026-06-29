import { FacilityModel } from '../models/facility.model.js';
import { UserModel } from '../models/user.model.js';
import { Facility, FacilityResponse } from '../types/index.js';
import { AppError } from '../middleware/errorHandler.js';

export const FacilityService = {
  getAll: (): FacilityResponse[] => {
    const facilities = FacilityModel.findAll();
    return facilities.map(f => FacilityService.toResponse(f));
  },

  getById: (id: string): FacilityResponse => {
    const facility = FacilityModel.findById(id);
    if (!facility) {
      throw new AppError('Facility not found.', 404);
    }
    return FacilityService.toResponse(facility);
  },

  search: (query: string): FacilityResponse[] => {
    const results = FacilityModel.search(query);
    return results.map(f => FacilityService.toResponse(f));
  },

  findBySpecialty: (specialty: string): FacilityResponse[] => {
    const results = FacilityModel.findBySpecialty(specialty);
    return results.map(f => FacilityService.toResponse(f));
  },

  findByProximity: (lat: number, lng: number, radiusKm?: number): (FacilityResponse & { distance: number })[] => {
    const results = FacilityModel.findByProximity(lat, lng, radiusKm);
    return results.map(f => ({
      ...FacilityService.toResponse(f),
      distance: Math.round(FacilityModel.calculateDistance(lat, lng, f.location.lat, f.location.lng) * 10) / 10,
    }));
  },

  getAllSpecialties: (): string[] => {
    const facilities = FacilityModel.findAll();
    const allSpecialties = new Set<string>();
    facilities.forEach(f => f.specialties.forEach(s => allSpecialties.add(s)));
    return Array.from(allSpecialties).sort();
  },

  toResponse: (facility: Facility): FacilityResponse => {
    // Look up the user associated with this facility
    const user = UserModel.findById(facility.userId);
    return {
      id: facility.id,
      name: user?.name || 'Unknown Facility',
      email: user?.email || '',
      address: facility.address,
      specialties: facility.specialties,
      location: facility.location,
      rating: facility.rating,
      description: facility.description,
      imageUrl: facility.imageUrl,
      availability: facility.availability,
      phone: facility.phone,
    };
  },
};
