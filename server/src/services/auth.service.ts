import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config/index.js';
import { UserModel } from '../models/user.model.js';
import { UserResponse, UserRole, JwtPayload, SignUpRequest } from '../types/index.js';
import { AppError } from '../middleware/errorHandler.js';

export const AuthService = {
  signUp: async (data: SignUpRequest): Promise<{ user: UserResponse; token: string }> => {
    // Check if user already exists
    const existing = UserModel.findByEmail(data.email);
    if (existing) {
      throw new AppError('An account with this email already exists.', 409);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new AppError('Invalid email format.', 400);
    }

    // Validate password strength
    if (data.password.length < 6) {
      throw new AppError('Password must be at least 6 characters long.', 400);
    }

    // Create user
    const user = await UserModel.create({
      email: data.email,
      password: data.password,
      name: data.name,
      role: data.role,
    });

    // Generate JWT token
    const token = AuthService.generateToken(user.id, user.email, user.role);

    return {
      user: UserModel.toResponse(user),
      token,
    };
  },

  signIn: async (email: string, password: string): Promise<{ user: UserResponse; token: string }> => {
    const user = UserModel.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid email or password.', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password.', 401);
    }

    const token = AuthService.generateToken(user.id, user.email, user.role);

    return {
      user: UserModel.toResponse(user),
      token,
    };
  },

  generateToken: (userId: string, email: string, role: UserRole): string => {
    const payload: JwtPayload = {
      userId,
      email,
      role,
    };

    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    } as jwt.SignOptions);
  },

  verifyToken: (token: string): JwtPayload => {
    return jwt.verify(token, config.jwt.secret) as JwtPayload;
  },

  getProfile: (userId: string): UserResponse => {
    const user = UserModel.findById(userId);
    if (!user) {
      throw new AppError('User not found.', 404);
    }
    return UserModel.toResponse(user);
  },
};
