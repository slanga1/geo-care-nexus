# TeleMedic Backend API

A robust Node.js/Express backend for the TeleMedic telemedicine platform, built with TypeScript and MVC architecture.

## 🏗️ Architecture

This backend follows the **MVC (Model-View-Controller)** pattern with a service layer:

```
server/
├── src/
│   ├── config/          # Environment configuration
│   ├── controllers/     # HTTP request handlers
│   ├── middleware/      # Auth, validation, error handling
│   ├── models/          # Data models (in-memory store)
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic layer
│   ├── types/           # TypeScript type definitions
│   └── index.ts         # Application entry point
├── package.json
├── tsconfig.json
└── .env
```

## 🚀 Features

- **Authentication**: JWT-based auth with bcrypt password hashing
- **Facility Discovery**: Search, filter by specialty, and proximity-based search
- **Appointment Booking**: Create, manage, and track appointments
- **Messaging**: Real-time messaging between patients and facilities
- **Security**: CORS, rate limiting, input validation with Zod
- **Type Safety**: Full TypeScript implementation

## 📦 Installation

```bash
cd server
bun install
```

## 🔧 Configuration

Create a `.env` file (already provided):

```env
PORT=5000
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🏃 Running the Server

### Development
```bash
bun run dev
```

### Production
```bash
bun run build
bun run start
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login
- `GET /api/auth/profile` - Get current user profile (requires auth)

### Facilities
- `GET /api/facilities` - Get all facilities (requires auth)
- `GET /api/facilities/:id` - Get facility by ID
- `GET /api/facilities/search?q=query` - Search facilities
- `GET /api/facilities/specialty/:specialty` - Filter by specialty
- `GET /api/facilities/nearby?lat=x&lng=y&radius=z` - Find nearby facilities
- `GET /api/facilities/specialties` - Get all available specialties

### Appointments
- `POST /api/bookings` - Create appointment (patients only)
- `GET /api/bookings` - Get my appointments
- `GET /api/bookings/:id` - Get appointment by ID
- `PATCH /api/bookings/:id/status` - Update appointment status

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages/contacts` - Get all contacts
- `GET /api/messages/unread` - Get unread count
- `GET /api/messages/:contactId` - Get conversation

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 🧪 Demo Accounts

Pre-seeded facility accounts (password: `password123`):
- `city.general@hospital.com` - City General Hospital
- `kids.care@clinic.com` - Kids Care Pediatrics
- `ortho.specialist@med.com` - Orthopedic Specialists Center
- `derma.care@clinic.com` - DermaCare Clinic
- `mindwell@health.com` - MindWell Mental Health

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: 100 requests per 15 minutes
- **CORS**: Configured for frontend origin
- **Input Validation**: Zod schemas for all inputs
- **Error Handling**: Centralized error handling middleware

## 📊 Data Persistence

Currently uses in-memory storage (Maps and Arrays) for development. Ready for database integration:
- User model → PostgreSQL `users` table
- Facility model → PostgreSQL `facilities` table
- Appointment model → PostgreSQL `appointments` table
- Message model → PostgreSQL `messages` table

## 🧰 Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: Zod
- **Security**: express-rate-limit, cors
- **UUID Generation**: uuid

## 📝 API Response Format

All endpoints return responses in this format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

Error responses:

```json
{
  "success": false,
  "error": "Error description"
}
```

## 🔄 Status Transitions (Appointments)

- `pending` → `confirmed`, `declined`, `cancelled`
- `confirmed` → `completed`, `cancelled`
- `declined`, `completed`, `cancelled` → (terminal states)

## 📍 Proximity Search

Uses the Haversine formula to calculate distances between coordinates:

```
GET /api/facilities/nearby?lat=40.7128&lng=-74.0060&radius=50
```

Returns facilities within the specified radius (in kilometers), sorted by distance.

## 🚧 Future Enhancements

- Database integration (PostgreSQL/Supabase)
- File upload for medical records
- Email notifications
- Video consultation integration
- Payment processing
- Admin dashboard
- Analytics and reporting

## 📄 License

MIT
