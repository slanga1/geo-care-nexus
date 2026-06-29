import { Router } from 'express';
import { FacilityController } from '../controllers/facility.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// GET /api/facilities - Get all facilities
router.get('/', authenticate, FacilityController.getAll);

// GET /api/facilities/search?q=query - Search facilities
router.get('/search', authenticate, FacilityController.search);

// GET /api/facilities/specialties - Get all available specialties
router.get('/specialties', authenticate, FacilityController.getSpecialties);

// GET /api/facilities/nearby?lat=x&lng=y&radius=z - Find nearby facilities
router.get('/nearby', authenticate, FacilityController.findByProximity);

// GET /api/facilities/specialty/:specialty - Filter by specialty
router.get('/specialty/:specialty', authenticate, FacilityController.findBySpecialty);

// GET /api/facilities/:id - Get facility by ID
router.get('/:id', authenticate, FacilityController.getById);

export default router;
