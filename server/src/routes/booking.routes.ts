import { Router } from 'express';
import { BookingController } from '../controllers/booking.controller.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { z } from 'zod';

const router = Router();

// Validation schemas
const createAppointmentSchema = z.object({
  facilityId: z.string().min(1, 'Facility ID is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  reason: z.string().min(10, 'Reason must be at least 10 characters'),
  severity: z.enum(['low', 'medium', 'high', 'emergency'], {
    errorMap: () => ({ message: 'Severity must be low, medium, high, or emergency' }),
  }),
});

const updateStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'declined', 'completed', 'cancelled'], {
    errorMap: () => ({ message: 'Invalid status value' }),
  }),
});

// All routes require authentication
router.use(authenticate);

// POST /api/bookings - Create appointment (patients only)
router.post('/', authorizeRoles('patient'), validate(createAppointmentSchema), BookingController.createAppointment);

// GET /api/bookings - Get my appointments
router.get('/', BookingController.getMyAppointments);

// GET /api/bookings/:id - Get appointment by ID
router.get('/:id', BookingController.getById);

// PATCH /api/bookings/:id/status - Update appointment status
router.patch('/:id/status', validate(updateStatusSchema), BookingController.updateStatus);

export default router;
