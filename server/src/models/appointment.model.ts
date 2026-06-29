import { v4 as uuidv4 } from 'uuid';
import { Appointment, AppointmentStatus, CaseSeverity } from '../types/index.js';

// In-memory appointment store
const appointments: Map<string, Appointment> = new Map();

export const AppointmentModel = {
  findAll: (): Appointment[] => {
    return Array.from(appointments.values());
  },

  findById: (id: string): Appointment | undefined => {
    return appointments.get(id);
  },

  findByPatientId: (patientId: string): Appointment[] => {
    return Array.from(appointments.values())
      .filter(a => a.patientId === patientId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  findByFacilityId: (facilityId: string): Appointment[] => {
    return Array.from(appointments.values())
      .filter(a => a.facilityId === facilityId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  findByStatus: (status: AppointmentStatus): Appointment[] => {
    return Array.from(appointments.values()).filter(a => a.status === status);
  },

  create: (data: {
    patientId: string;
    patientName: string;
    facilityId: string;
    facilityName: string;
    date: string;
    time: string;
    reason: string;
    severity: CaseSeverity;
  }): Appointment => {
    const id = uuidv4();
    const now = new Date().toISOString();
    const appointment: Appointment = {
      id,
      ...data,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };
    appointments.set(id, appointment);
    return appointment;
  },

  updateStatus: (id: string, status: AppointmentStatus): Appointment | undefined => {
    const existing = appointments.get(id);
    if (!existing) return undefined;
    existing.status = status;
    existing.updatedAt = new Date().toISOString();
    appointments.set(id, existing);
    return existing;
  },

  delete: (id: string): boolean => {
    return appointments.delete(id);
  },
};
