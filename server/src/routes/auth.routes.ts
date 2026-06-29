import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { z } from 'zod';

const router = Router();

// Validation schemas
const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['patient', 'facility'], { errorMap: () => ({ message: 'Role must be patient or facility' }) }),
});

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// POST /api/auth/signup
router.post('/signup', validate(signUpSchema), AuthController.signUp);

// POST /api/auth/signin
router.post('/signin', validate(signInSchema), AuthController.signIn);

// GET /api/auth/profile
router.get('/profile', authenticate, AuthController.getProfile);

export default router;
