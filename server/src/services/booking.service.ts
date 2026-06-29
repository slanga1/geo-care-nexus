import { AppointmentModel } from '../models/appointment.model.js';
import { Appointment, AppointmentStatus, CaseSeverity } from '../types/index.js';
import { AppError } from '../middleware/errorHandler.js';

export const BookingService = {
  createAppointment: (data: {
    patientId: string;
    patientName: string;
    facilityId: string;
    facilityName: string;
    date: string;
    time: string;
    reason: string;
    severity: CaseSeverity;
  }): Appointment => {
    // Validate date is in the future
    const appointmentDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (appointmentDate < today) {
      throw new AppError('Appointment date cannot be in the past.', 400);
    }

    // Validate reason length
    if (data.reason.trim().length < 10) {
      throw new AppError('Please provide a more detailed reason for your visit (at least 10 characters).', 400);
    }

    return AppointmentModel.create(data);
  },

  getPatientAppointments: (patientId: string): Appointment[] => {
    return AppointmentModel.findByPatientId(patientId);
  },

  getFacilityAppointments: (facilityId: string): Appointment[] => {
    return AppointmentModel.findByFacilityId(facilityId);
  },

  updateAppointmentStatus: (
    appointmentId: string,
    status: AppointmentStatus,
    userId: string,
    userRole: string
  ): Appointment => {
    const appointment = AppointmentModel.findById(appointmentId);
    if (!appointment) {
      throw new AppError('Appointment not found.', 404);
    }

    // Verify ownership
    if (userRole === 'patient' && appointment.patientId !== userId) {
      throw new AppError('You can only update your own appointments.', 403);
    }
    if (userRole === 'facility' && appointment.facilityId !== userId) {
      throw new AppError('You can only update appointments for your facility.', 403);
    }

    // Validate status transitions
    const validTransitions: Record<string, AppointmentStatus[]> = {
      pending: ['confirmed', 'declined', 'cancelled'],
      confirmed: ['completed', 'cancelled'],
      declined: [],
      completed: [],
      cancelled: [],
    };

    if (!validTransitions[appointment.status]?.includes(status)) {
      throw new AppError(
        `Cannot change status from '${appointment.status}' to '${status}'.`,
        400
      );
    }

    const updated = AppointmentModel.updateStatus(appointmentId, status);
    if (!updated) {
      throw new AppError('Failed to update appointment.', 500);
    }

    return updated;
  },

  getAppointmentById: (id: string): Appointment => {
    const appointment = AppointmentModel.findById(id);
    if (!appointment) {
      throw new AppError('Appointment not found.', 404);
    }
    return appointment;
  },
};
