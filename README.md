# 🏨 HotelPro - Smart Hotel Booking & Management Platform

A production-grade, full-stack hotel booking SaaS platform built with **Spring Boot** (backend) and **React.js** (frontend).

![Java](https://img.shields.io/badge/Java-17-orange) ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green) ![React](https://img.shields.io/badge/React-18-blue) ![MySQL](https://img.shields.io/badge/MySQL-8.0-blue) ![Redis](https://img.shields.io/badge/Redis-7-red) ![Docker](https://img.shields.io/badge/Docker-ready-blue)

---

## 🌟 Features

### 👤 Roles
| Role | Capabilities |
|------|-------------|
| **Admin** | Full dashboard, hotel/room CRUD, user management, analytics |
| **Staff** | Check-in/check-out, booking management, room status |
| **Customer** | Search hotels, book rooms, payments, reviews |

### ✅ Core Modules
- **Authentication** — JWT + Refresh Tokens, BCrypt passwords
- **Hotel Management** — CRUD, star ratings, amenities, images
- **Room Management** — Types, dynamic pricing, availability tracking
- **Booking System** — Real-time availability, conflict detection
- **Payment System** — Simulated UPI/Card/Net Banking (Razorpay-ready)
- **Email Notifications** — Async confirmation/cancellation emails
- **Reviews & Ratings** — Post-stay reviews with star ratings
- **Analytics Dashboard** — Revenue charts, occupancy rate, booking trends
- **Dynamic Pricing** — Auto price adjustment based on demand (scheduled)
- **Redis Caching** — Hotels, rooms, analytics cached for performance

---

## 🚀 Quick Start

### Option 1 — Docker (Recommended)
```bash
git clone <repo>
cd hotel-platform
cp .env.example .env          # Edit .env with your values
docker-compose up --build -d
```
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- API Docs: http://localhost:8080/swagger-ui.html

### Option 2 — Manual Setup

**Prerequisites:** Java 17+, Node 18+, MySQL 8, Redis 7, Maven 3.9+

**Backend:**
```bash
cd backend
# Update src/main/resources/application.properties
mvn clean install -DskipTests
mvn spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm install --legacy-peer-deps
npm start
```

**Database:**
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p hotel_db < database/seed.sql
```

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hotel.com | admin123 |
| Staff | staff@hotel.com | admin123 |
| Customer | customer@hotel.com | admin123 |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login & get JWT |
| POST | /api/auth/refresh | Refresh access token |

### Hotels
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/hotels | Public |
| GET | /api/hotels/search?city=&country= | Public |
| GET | /api/hotels/{id} | Public |
| POST | /api/hotels | Admin |
| PUT | /api/hotels/{id} | Admin |
| DELETE | /api/hotels/{id} | Admin |

### Rooms
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/rooms/hotel/{hotelId} | Public |
| GET | /api/rooms/available?hotelId=&checkIn=&checkOut= | Public |
| GET | /api/rooms/search | Public |
| POST | /api/rooms | Admin |
| PATCH | /api/rooms/{id}/status | Admin/Staff |

### Bookings
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/bookings | Customer |
| GET | /api/bookings/my | Customer |
| GET | /api/bookings | Admin/Staff |
| POST | /api/bookings/{id}/confirm | Admin/Staff |
| POST | /api/bookings/{id}/checkin | Admin/Staff |
| POST | /api/bookings/{id}/checkout | Admin/Staff |
| POST | /api/bookings/{id}/cancel | Customer |

### Payments
| POST | /api/payments | Process payment |
| GET | /api/payments/booking/{id} | Get payment |

### Analytics (Admin only)
| GET | /api/analytics/dashboard | Full analytics |

---

## 🗂️ Project Structure

```
hotel-platform/
├── backend/                    # Spring Boot API
│   ├── src/main/java/com/hotel/
│   │   ├── config/             # Security, Redis config
│   │   ├── controller/         # REST controllers
│   │   ├── dto/                # Request/Response DTOs
│   │   ├── entity/             # JPA entities
│   │   ├── exception/          # Custom exceptions + handler
│   │   ├── repository/         # Spring Data JPA repos
│   │   ├── security/           # JWT utils, filters
│   │   └── service/            # Business logic
│   └── src/test/               # Unit tests
├── frontend/                   # React.js SPA
│   └── src/
│       ├── components/shared/  # Reusable UI components
│       ├── context/            # Auth context
│       ├── pages/
│       │   ├── admin/          # Admin dashboard pages
│       │   ├── customer/       # Customer pages
│       │   ├── home/           # Landing page
│       │   └── staff/          # Staff pages
│       └── services/           # Axios API service
├── database/
│   ├── schema.sql              # DB schema
│   └── seed.sql                # Demo data
├── docker-compose.yml
└── .env.example
```

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 17, Spring Boot 3.2, Spring Security |
| Database | MySQL 8.0 + Hibernate JPA |
| Cache | Redis 7 |
| Auth | JWT + Refresh Tokens |
| Frontend | React 18, Tailwind CSS, Recharts |
| HTTP Client | Axios |
| PDF | iText 5 |
| Email | Spring Mail (SMTP) |
| DevOps | Docker, Docker Compose, Nginx |
| Tests | JUnit 5, Mockito |

---

## 🔒 Security
- JWT access tokens (24h) + refresh tokens (7d)
- BCrypt password hashing (strength 10)
- Role-based access control (`@PreAuthorize`)
- CORS configured for frontend origin
- Input validation on all endpoints

---

## 📊 Dynamic Pricing
Rooms prices auto-adjust every hour:
- Occupancy > 70% → +20% price surge
- Occupancy < 30% → -10% discount
- Admin can override base price anytime

---

## 🧪 Running Tests
```bash
cd backend
mvn test
```

---

## 📦 Build for Production
```bash
# Backend JAR
cd backend && mvn clean package -DskipTests

# Frontend build
cd frontend && npm run build

# Full Docker build
docker-compose up --build
```
