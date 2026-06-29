import { Router } from 'express';
import authRoutes from './auth.routes.js';
import facilityRoutes from './facility.routes.js';
import bookingRoutes from './booking.routes.js';
import messageRoutes from './message.routes.js';

const router = Router();

// Mount all route modules
router.use('/auth', authRoutes);
router.use('/facilities', facilityRoutes);
router.use('/bookings', bookingRoutes);
router.use('/messages', messageRoutes);

export { router as routes };
