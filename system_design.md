# Resolutix — System Design

## 1. Architecture Overview

Resolutix follows a **dual-stack architecture**:

- **Primary stack:** Node.js + Express + Handlebars (server-side rendered, currently live)
- **Secondary stack:** Java Spring Boot REST API (parallel backend, ready for frontend decoupling)

Both stacks connect to the same **MongoDB** database (`complaintapp`).

```
┌──────────────────────────────────────────────────────────┐
│                        Browser                           │
│         (Handlebars-rendered HTML + CSS + Chart.js)      │
└───────────────────────┬──────────────────────────────────┘
                        │ HTTP
        ┌───────────────▼──────────────┐
        │   Node.js / Express Server   │  :3000
        │   Passport.js  │  Sessions   │
        │   Mongoose ODM │  Flash msgs │
        └───────────────┬──────────────┘
                        │
        ┌───────────────▼──────────────┐
        │         MongoDB              │  :27017
        │   Database: complaintapp     │
        │   Collections:               │
        │   • users                    │
        │   • complaints               │
        │   • complaintmappings        │
        │   • feedbacks                │
        └──────────────────────────────┘
                        ▲
        ┌───────────────┴──────────────┐
        │  Java Spring Boot REST API   │  :8080
        │  Spring Data MongoDB         │
        │  Spring Security (BCrypt)    │
        └──────────────────────────────┘
```

---

## 2. Page & Route Structure

| Route | Access | Description |
|---|---|---|
| `GET /` | Public | Animated landing page with live stats |
| `GET /dashboard` | Auth | User dashboard with complaint form |
| `POST /registerComplaint` | Auth | Submit a new complaint |
| `GET /track` | Auth | Track a complaint by ID |
| `GET /admin` | Admin only | Admin dashboard |
| `POST /admin/assign` | Admin only | Assign complaint to engineer |
| `GET /jeng` | Jeng only | Junior Engineer dashboard |
| `POST /jeng/resolve` | Jeng only | Mark complaint as resolved |
| `GET /feedback` | Auth | Submit feedback |
| `POST /login` | Public | Authenticate user |
| `GET /logout` | Auth | Destroy session, redirect to `/` |

---

## 3. Database Schema (MongoDB / Mongoose)

### `users`
```json
{
  "_id": "ObjectId",
  "name": "String",
  "username": "String (unique)",
  "email": "String",
  "password": "String (bcrypt hashed)",
  "role": "String (user | jeng | admin)"
}
```

### `complaints`
```json
{
  "_id": "ObjectId",
  "complaintId": "String (24-char unique ID)",
  "name": "String",
  "email": "String",
  "contact": "String",
  "address": "String",
  "desc": "String",
  "status": "String (pending | resolved)",
  "date": "Date"
}
```

### `complaintmappings`
```json
{
  "_id": "ObjectId",
  "complaintId": "String",
  "engineerId": "String (ref: users)",
  "assignedAt": "Date"
}
```

### `feedbacks`
```json
{
  "_id": "ObjectId",
  "userId": "String (ref: users)",
  "message": "String",
  "date": "Date"
}
```

---

## 4. Authentication Flow

```
User submits login form (POST /login)
        │
        ▼
Passport LocalStrategy
  → Finds user by username (UserRepository)
  → Compares password with bcrypt.compare()
        │
   ┌────┴────┐
   ▼         ▼
Success     Failure
  │           │
  ▼           ▼
Save      Redirect to /
session   (flash error)
  │
  ▼
Role-based redirect:
  admin → /admin
  jeng  → /jeng
  user  → /dashboard
```

---

## 5. Frontend Design System

| Token | Value |
|---|---|
| Primary gradient | `#7c3aed → #3b82f6` |
| Background | `#0b1120` (dark navy) |
| Card background | `rgba(30,41,59,0.7)` glassmorphism |
| Border | `rgba(255,255,255,0.08)` |
| Text primary | `#f8fafc` |
| Text muted | `#94a3b8` |
| Success | `#22c55e` |
| Warning | `#f97316` |
| Danger | `#ef4444` |
| Font | `Inter` (Google Fonts) |
| Border radius (cards) | `16–24px` |

### Key Animations
| Animation | Usage |
|---|---|
| `fadeInUp` | Hero text, feature cards, stat cards |
| `titleGradient` | "Resolutix" hero title gradient shift |
| `bounceDown` | Scroll-arrow bounce |
| `pulseGlow` | CTA buttons, background shapes |
| `greetingFadeIn` | Navbar greeting badge |
| `waveHand` | 👋 emoji in greeting |
| `formSlideIn` | Complaint form card entrance |
| `inputGlow` | Form input focus effect |

---

## 6. Spring Boot API (Secondary Backend)

### Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Authenticate and return session |
| `GET` | `/api/complaints` | Get all complaints |
| `POST` | `/api/complaints` | Submit a new complaint |
| `GET` | `/api/complaints/:id` | Track a complaint by ID |
| `GET` | `/api/admin/dashboard` | Admin stats aggregation |
| `POST` | `/api/admin/assign` | Assign complaint to engineer |
| `GET` | `/api/jeng/assignments` | Get engineer's assigned complaints |
| `POST` | `/api/jeng/resolve` | Mark complaint as resolved |

### Spring Boot Package Structure
```
com.example.demo
├── models/
│   ├── User.java
│   ├── Complaint.java
│   ├── ComplaintMapping.java
│   └── Feedback.java
├── repositories/
│   ├── UserRepository.java
│   ├── ComplaintRepository.java
│   ├── ComplaintMappingRepository.java
│   └── FeedbackRepository.java
├── controllers/
│   ├── AuthController.java
│   ├── ComplaintController.java
│   ├── AdminController.java
│   └── JuniorEngineerController.java
└── config/
    └── SecurityConfig.java
```

---

## 7. Deployment Notes

- **Database:** MongoDB runs locally at `mongodb://localhost:27017/complaintapp`
- **Node server:** Port `3000` via `npm start`
- **Spring Boot:** Port `8080` via `./mvnw spring-boot:run`
- **No credentials** are stored in plain text — all passwords are hashed with BCrypt (cost factor 10)
- Session secret is managed via `app.js` and should be moved to environment variables in production
