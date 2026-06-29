import { Response, NextFunction } from 'express';
import { BookingService } from '../services/booking.service.js';
import { AuthRequest, AppointmentStatus } from '../types/index.js';

export const BookingController = {
  createAppointment: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Not authenticated.' });
        return;
      }

      const { facilityId, date, time, reason, severity } = req.body;

      const appointment = BookingService.createAppointment({
        patientId: req.user.userId,
        patientName: req.user.email,
        facilityId,
        facilityName: '',
        date,
        time,
        reason,
        severity,
      });

      res.status(201).json({
        success: true,
        data: appointment,
        message: 'Appointment request created successfully.',
      });
    } catch (error) {
      next(error);
    }
  },

  getMyAppointments: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Not authenticated.' });
        return;
      }

      let appointments;
      if (req.user.role === 'patient') {
        appointments = BookingService.getPatientAppointments(req.user.userId);
      } else {
        appointments = BookingService.getFacilityAppointments(req.user.userId);
      }

      res.json({
        success: true,
        data: appointments,
      });
    } catch (error) {
      next(error);
    }
  },

  updateStatus: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Not authenticated.' });
        return;
      }

      const id = req.params.id as string;
      const { status } = req.body;

      const appointment = BookingService.updateAppointmentStatus(
        id,
        status as AppointmentStatus,
        req.user.userId,
        req.user.role
      );

      res.json({
        success: true,
        data: appointment,
        message: `Appointment ${status} successfully.`,
      });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const appointment = BookingService.getAppointmentById(id);

      res.json({
        success: true,
        data: appointment,
      });
    } catch (error) {
      next(error);
    }
  },
};
