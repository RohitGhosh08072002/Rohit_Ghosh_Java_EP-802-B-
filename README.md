# Resolutix — README

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18.x-green?style=flat-square&logo=node.js"/>
  <img src="https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen?style=flat-square&logo=springboot"/>
  <img src="https://img.shields.io/badge/MongoDB-7.x-success?style=flat-square&logo=mongodb"/>
  <img src="https://img.shields.io/badge/Java-17-orange?style=flat-square&logo=openjdk"/>
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square"/>
</p>

> **Resolutix** is an intelligent, lightning-fast **Complaint Escalation & Resolution** platform built on a dual-stack architecture — a Node.js/Express frontend with Handlebars templating, and a Java Spring Boot REST API backend, both backed by MongoDB.

---

## 🌐 Live Features

### 🏠 Landing Page
- Animated hero section with gradient title, smooth bounce-scroll arrows
- **Live platform stats** — Total Complaints, Resolved, Pending, Success Rate with Chart.js graphs
- **"Why Choose Resolutix?"** feature cards with glassmorphism design
- Embedded **Login** and **Register** forms — no separate pages needed
- Full smooth-scroll navigation between sections

### 📋 Dashboard (Authenticated Users)
- Personalized animated **"Hi, [Name]"** greeting badge with waving emoji
- **Register a Complaint** — premium glassmorphism two-column form with glow effects
- Clean navbar with gradient **R** icon, logout button

### 🔐 Authentication
- Session-based login with **Passport.js** and **bcrypt** password hashing
- Role-based routing: `user`, `jeng` (Junior Engineer), `admin`
- All auth flows redirect seamlessly back to the landing page

### 👷 Junior Engineer Dashboard
- View assigned complaints
- Mark complaints as resolved
- Track personal performance metrics (total, resolved, pending, success rate)

### 🛡️ Admin Dashboard
- View all complaints and user listings
- Assign complaints to Junior Engineers
- View platform-wide stats and feedback submissions

---

## 🗂️ Project Structure

```
complaint-system-master/
├── app.js                  # Express app entry point
├── db.js                   # MongoDB connection
├── routes/
│   └── index.js            # All route handlers
├── models/
│   ├── user.js
│   ├── complaint.js
│   ├── complaint-mapping.js
│   └── feedback.js
├── views/
│   ├── landing.handlebars  # ✨ Animated landing page
│   ├── index.handlebars    # User dashboard / complaint form
│   ├── admin/              # Admin views
│   ├── jeng/               # Junior Engineer views
│   └── layouts/
│       └── main.handlebars # Shared layout (navbar, alerts)
├── public/
│   ├── css/style.css       # Custom theme & animations
│   └── images/logo.png     # Brand logo
└── spring-backend/         # Java Spring Boot REST API (parallel backend)
    └── src/main/java/com/example/demo/
        ├── models/         # MongoDB document entities
        ├── repositories/   # Spring Data Mongo repositories
        ├── controllers/    # REST API controllers
        └── config/         # Security & CORS configuration
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js `>= 16`
- MongoDB running locally on port `27017`
- Java `17+` (for Spring Boot backend)
- Maven (for Spring Boot)

### Run the Node.js App

```bash
# Install dependencies
npm install

# Start the server
npm start
```

Visit: [http://localhost:3000](http://localhost:3000)

### Run the Spring Boot API (Optional)

```bash
cd spring-backend
./mvnw spring-boot:run
```

API runs on: [http://localhost:8080](http://localhost:8080)

---

## 🔑 Roles & Access

| Role | Access |
|---|---|
| `user` | Submit & track complaints, provide feedback |
| `jeng` | View assigned complaints, mark as resolved |
| `admin` | Full access — assign, view all, analytics |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend / Server | Node.js + Express + Handlebars |
| Styling | Custom CSS (Glassmorphism, Animations) |
| Charts | Chart.js |
| Authentication | Passport.js + bcrypt |
| Database | MongoDB (via Mongoose) |
| REST API (Backend) | Java Spring Boot 3 + Spring Data MongoDB |
| Version Control | Git + GitHub |

---

## 📸 Highlights
- **Zero-reload auth** — login/register embedded into the landing page
- **Smooth scroll navigation** — bouncing arrows guide the user section-by-section
- **Live stats on landing** — no login required to see platform health
- **Glassmorphism UI** — consistent premium dark theme across all pages
- **Animated greeting** — personalized wave animation on login

---

## 📄 License
MIT © Rohit Ghosh
