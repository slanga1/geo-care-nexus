import { ApiResponse, User, Facility, Appointment, Message, CreateAppointmentRequest, SendMessageRequest, SignUpRequest, SignInRequest } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

const getAuthToken = () => localStorage.getItem('telemedic_token');

const api = {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData: ApiResponse = await response.json();
        throw new Error(errorData.error || 'An API error occurred');
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        return {
          success: false,
          error: error.message,
        };
      } 
      return {
        success: false,
        error: 'An unknown error occurred',
      };
    }
  },

  // Auth Service
  auth: {
    signUp: (data: SignUpRequest) => api.request<{ user: User; token: string }>('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
    signIn: (data: SignInRequest) => api.request<{ user: User; token: string }>('/auth/signin', { method: 'POST', body: JSON.stringify(data) }),
    getProfile: () => api.request<User>('/auth/profile'),
  },

  // Facility Service
  facilities: {
    getAll: () => api.request<Facility[]>('/facilities'),
    getById: (id: string) => api.request<Facility>(`/facilities/${id}`),
    search: (query: string) => api.request<Facility[]>(`/facilities/search?q=${query}`),
    getSpecialties: () => api.request<string[]>('/facilities/specialties'),
  },

  // Booking Service
  bookings: {
    create: (data: CreateAppointmentRequest) => api.request<Appointment>('/bookings', { method: 'POST', body: JSON.stringify(data) }),
    getMy: () => api.request<Appointment[]>('/bookings'),
    updateStatus: (id: string, status: Appointment['status']) => api.request<Appointment>(`/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  },
  
  // Message Service
  messages: {
    getContacts: () => api.request<User[]>('/messages/contacts'),
    getConversation: (contactId: string) => api.request<Message[]>(`/messages/${contactId}`),
    send: (data: SendMessageRequest) => api.request<Message>('/messages', { method: 'POST', body: JSON.stringify(data) }),
  },
};

export default api;
