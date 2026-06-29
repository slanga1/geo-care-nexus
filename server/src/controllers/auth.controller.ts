import { Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { AuthRequest } from '../types/index.js';

export const AuthController = {
  signUp: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { email, password, name, role } = req.body;
      const result = await AuthService.signUp({ email, password, name, role });

      res.status(201).json({
        success: true,
        data: result,
        message: 'Account created successfully.',
      });
    } catch (error) {
      next(error);
    }
  },

  signIn: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await AuthService.signIn(email, password);

      res.json({
        success: true,
        data: result,
        message: 'Signed in successfully.',
      });
    } catch (error) {
      next(error);
    }
  },

  getProfile: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Not authenticated.' });
        return;
      }

      const user = AuthService.getProfile(req.user.userId);

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },
};
