export type UserRole = 'patient' | 'facility';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface Facility {
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
  distance?: number;
}

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
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage?: string;
  updatedAt: string;
}

// API Request/Response types

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

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

export interface CreateAppointmentRequest {
  facilityId: string;
  date: string;
  time: string;
  reason: string;
  severity: CaseSeverity;
}

export interface SendMessageRequest {
  receiverId: string;
  text: string;
}