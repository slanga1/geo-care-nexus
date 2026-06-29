import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { User, UserResponse, UserRole } from '../types/index.js';

// In-memory user store (simulates database table)
const users: Map<string, User> = new Map();

// Fixed IDs for seeded facility users (linked to facility model)
const FACILITY_USER_IDS = [
  'facility-user-1',
  'facility-user-2',
  'facility-user-3',
  'facility-user-4',
  'facility-user-5',
];

// Seed demo facility accounts
const seedFacilities = () => {
  const facilities = [
    {
      id: FACILITY_USER_IDS[0],
      email: 'city.general@hospital.com',
      name: 'City General Hospital',
      role: 'facility' as UserRole,
    },
    {
      id: FACILITY_USER_IDS[1],
      email: 'kids.care@clinic.com',
      name: 'Kids Care Pediatrics',
      role: 'facility' as UserRole,
    },
    {
      id: FACILITY_USER_IDS[2],
      email: 'ortho.specialist@med.com',
      name: 'Orthopedic Specialists Center',
      role: 'facility' as UserRole,
    },
    {
      id: FACILITY_USER_IDS[3],
      email: 'derma.care@clinic.com',
      name: 'DermaCare Clinic',
      role: 'facility' as UserRole,
    },
    {
      id: FACILITY_USER_IDS[4],
      email: 'mindwell@health.com',
      name: 'MindWell Mental Health',
      role: 'facility' as UserRole,
    },
  ];

  facilities.forEach(f => {
    const hash = bcrypt.hashSync('password123', 10);
    const now = new Date().toISOString();
    users.set(f.id, {
      id: f.id,
      email: f.email,
      name: f.name,
      role: f.role,
      passwordHash: hash,
      createdAt: now,
      updatedAt: now,
    });
  });
};

seedFacilities();

export const UserModel = {
  findByEmail: (email: string): User | undefined => {
    for (const user of users.values()) {
      if (user.email === email) return user;
    }
    return undefined;
  },

  findById: (id: string): User | undefined => {
    return users.get(id);
  },

  create: async (data: {
    email: string;
    password: string;
    name: string;
    role: UserRole;
  }): Promise<User> => {
    const id = uuidv4();
    const passwordHash = await bcrypt.hash(data.password, 10);
    const now = new Date().toISOString();

    const user: User = {
      id,
      email: data.email,
      name: data.name,
      role: data.role,
      passwordHash,
      createdAt: now,
      updatedAt: now,
    };

    users.set(id, user);
    return user;
  },

  toResponse: (user: User): UserResponse => {
    const { passwordHash: _, ...response } = user;
    return response;
  },

  getAllByRole: (role: UserRole): User[] => {
    return Array.from(users.values()).filter(u => u.role === role);
  },
};
