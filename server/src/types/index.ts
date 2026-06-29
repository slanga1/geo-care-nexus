import { Request } from 'express';

// User Types
export type UserRole = 'patient' | 'facility';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  passwordHash: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

// Facility Types
export interface Facility {
  id: string;
  userId: string;
  address: string;
  specialties: string[];
  location: {
    lat: number;
    lng: number;
  };
  rating: number;
  description: string;
  imageUrl: string;
  availability: string[];
  phone?: string;
  website?: string;
}

export interface FacilityResponse {
  id: string;
  name: string;
  email: string;
  address: string;
  specialties: string[];
  location: { lat: number; lng: number };
  rating: number;
  description: string;
  imageUrl: string;
  availability: string[];
  phone?: string;
}

// Appointment Types
export type AppointmentStatus = 'pending' | 'confirmed' | 'declined' | 'completed' | 'cancelled';
export type CaseSeverity = 'low' | 'medium' | 'high' | 'emergency';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  facilityId: string;
  facilityName: string;
  date: string;
  time: string;
  reason: string;
  severity: CaseSeverity;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
}

// Message Types
export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface ChatContact {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}

// JWT Payload
export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

// Extend Express Request
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Auth Request Bodies
export interface SignUpRequest {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface SignInRequest {
  email: string;
  password: string;
}

// Booking Request
export interface CreateAppointmentRequest {
  facilityId: string;
  date: string;
  time: string;
  reason: string;
  severity: CaseSeverity;
}

// Message Request
export interface SendMessageRequest {
  receiverId: string;
  text: string;
}
