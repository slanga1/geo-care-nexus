import { Request, Response, NextFunction } from 'express';
import { FacilityService } from '../services/facility.service.js';

export const FacilityController = {
  getAll: (_req: Request, res: Response, next: NextFunction) => {
    try {
      const facilities = FacilityService.getAll();
      res.json({
        success: true,
        data: facilities,
      });
    } catch (error) {
      next(error);
    }
  },

  getById: (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const facility = FacilityService.getById(id);

      res.json({
        success: true,
        data: facility,
      });
    } catch (error) {
      next(error);
    }
  },

  search: (req: Request, res: Response, next: NextFunction) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        res.json({ success: true, data: FacilityService.getAll() });
        return;
      }

      const results = FacilityService.search(q);
      res.json({
        success: true,
        data: results,
      });
    } catch (error) {
      next(error);
    }
  },

  findBySpecialty: (req: Request, res: Response, next: NextFunction) => {
    try {
      const specialty = req.params.specialty as string;
      const results = FacilityService.findBySpecialty(specialty);

      res.json({
        success: true,
        data: results,
      });
    } catch (error) {
      next(error);
    }
  },

  findByProximity: (req: Request, res: Response, next: NextFunction) => {
    try {
      const { lat, lng, radius } = req.query;

      if (!lat || !lng) {
        res.status(400).json({
          success: false,
          error: 'Latitude and longitude are required.',
        });
        return;
      }

      const results = FacilityService.findByProximity(
        parseFloat(lat as string),
        parseFloat(lng as string),
        radius ? parseFloat(radius as string) : undefined
      );

      res.json({
        success: true,
        data: results,
      });
    } catch (error) {
      next(error);
    }
  },

  getSpecialties: (_req: Request, res: Response, next: NextFunction) => {
    try {
      const specialties = FacilityService.getAllSpecialties();
      res.json({
        success: true,
        data: specialties,
      });
    } catch (error) {
      next(error);
    }
  },
};
