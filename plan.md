# Resolutix — Project Plan

## Project Overview
**Resolutix** is an end-to-end complaint escalation and resolution platform featuring a premium animated landing page, role-based dashboards, and a dual Node.js + Java Spring Boot backend, all connected to MongoDB.

---

## Tech Stack Summary

| Layer | Technology |
|---|---|
| Server | Node.js 18 + Express 4 |
| Templating | Handlebars (HBS) |
| Auth | Passport.js + bcrypt |
| Database | MongoDB + Mongoose |
| Styling | Custom CSS (Glassmorphism + Animations) |
| Charts | Chart.js |
| Secondary API | Java 17 + Spring Boot 3 + Spring Data MongoDB |

---

## ✅ Completed Features

### Phase 1 — Core Backend
- [x] MongoDB connection (`db.js`)
- [x] User model with role-based fields (`user`, `jeng`, `admin`)
- [x] Complaint model with 24-character unique ID
- [x] ComplaintMapping model (links complaints ↔ engineers)
- [x] Feedback model
- [x] Passport.js local authentication with bcrypt
- [x] Session management and flash messages
- [x] Role-based route guards (`ensureAuthenticated`)

### Phase 2 — Node.js Express Routes
- [x] `GET /` → Animated landing page with live stats
- [x] `GET /dashboard` → Authenticated user dashboard
- [x] `POST /registerComplaint` → Submit a complaint
- [x] `GET /track` → Track complaint by ID
- [x] `GET /admin` → Admin dashboard with all complaints & users
- [x] `POST /admin/assign` → Assign complaint to engineer
- [x] `GET /jeng` → Junior Engineer dashboard
- [x] `POST /jeng/resolve` → Mark complaint resolved
- [x] `GET /feedback` → Feedback submission
- [x] `GET /logout` → Session destroy → redirect `/`
- [x] `GET /login`, `GET /register` → Redirect to `/#auth-section`

### Phase 3 — Landing Page
- [x] Animated hero section (`fadeInUp`, `titleGradient`, `pulseGlow`)
- [x] Smooth scroll bounce arrows (Hero → Stats → Features → Auth)
- [x] Live platform stats (fetched from MongoDB on every page load)
- [x] Chart.js doughnut + bar charts on landing page
- [x] "Why Choose Resolutix?" glassmorphism feature cards
- [x] Embedded Login + Register forms (no separate page)
- [x] Hidden scrollbars (clean full-screen experience)
- [x] CTA buttons ("Get Started Now" + "Login") with matching glow animations

### Phase 4 — Dashboard & Navbar
- [x] Premium "Register a Complaint" form (glassmorphism, two-column, icon labels)
- [x] Animated greeting badge `👋 Hi, [Name]` with wave animation
- [x] Gradient "R" lettermark icon in navbar
- [x] Logout button with red pill styling
- [x] Removed all redundant stats/charts from dashboard (now on landing page)
- [x] Removed "Dashboard", "Submit" labels from dashboard

### Phase 5 — Java Spring Boot Backend
- [x] Spring Boot project initialized (`spring-backend/`)
- [x] MongoDB entity models (`User`, `Complaint`, `ComplaintMapping`, `Feedback`)
- [x] Spring Data MongoDB repositories
- [x] REST controllers: Auth, Complaint, Admin, JuniorEngineer
- [x] `SecurityConfig.java` with BCrypt password encoder
- [x] CORS configuration for cross-origin requests

---

## 🔄 In Progress

- [ ] Decouple frontend from Node.js — point forms to Spring Boot REST endpoints
- [ ] JWT-based stateless authentication for Spring Boot API
- [ ] Role-based method security (`@PreAuthorize`) in Spring controllers

---

## 🗓️ Upcoming / Future Phases

### Phase 6 — API Decoupling
- [ ] Replace Handlebars form `action` URLs with `fetch()` / Axios calls to Spring Boot
- [ ] Implement JWT login response from Spring Boot → store in session/cookie
- [ ] Protect all Spring Boot endpoints with JWT filter chain

### Phase 7 — Thymeleaf Migration (Optional)
- [ ] Convert Handlebars templates to Thymeleaf for full Spring Boot monolith
- [ ] Integrate Spring MVC controllers to serve Thymeleaf views

### Phase 8 — Production Hardening
- [ ] Move secrets (MongoDB URI, session secret) to `.env` / environment variables
- [ ] Add input validation with `express-validator` and Spring `@Valid`
- [ ] Rate limiting on auth endpoints
- [ ] HTTPS enforcement
- [ ] Docker-compose setup for MongoDB + Node + Spring Boot

### Phase 9 — Enhancements
- [ ] Email notifications on complaint status change
- [ ] Real-time updates via WebSocket (Socket.io / Spring WebSocket)
- [ ] Complaint search and filter on admin dashboard
- [ ] Export complaints as CSV/PDF
- [ ] Dark/Light mode toggle

---

## 🧱 Component Map

```
Landing Page (/)
 ├── Hero Section (scroll → Stats)
 ├── Platform Stats + Charts (scroll → Features)
 ├── Why Choose Resolutix — Feature Cards (scroll → Auth)
 └── Auth Section — Login + Register forms

Dashboard (/dashboard) [Auth Required]
 └── Register a Complaint Form

Admin (/admin) [Admin Role]
 ├── All Complaints Table
 ├── Assign to Engineer
 ├── Platform Stats
 └── Feedback List

Junior Engineer (/jeng) [Jeng Role]
 ├── Assigned Complaints
 ├── Resolve Complaint
 └── Personal Stats
```

---

## 🗃️ Git History Summary

| Commit | Description |
|---|---|
| Initial | Node.js Express app with MongoDB, Passport auth |
| Spring backend | Java Spring Boot REST API setup |
| Landing page | Animated landing page with hero, features, auth forms |
| Routing update | Root `/` → landing, `/dashboard` → auth-protected |
| Stats & charts | Live platform stats on landing with Chart.js |
| Dashboard redesign | Glassmorphism complaint form, greeting badge, icon |
| Navbar cleanup | Removed profile dropdown, added gradient R icon |
| GitHub sync | All changes pushed to `main` |
