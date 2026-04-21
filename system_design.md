# Digital Complaint Escalation and Resolution Monitoring System

## Table of Contents
1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture Pattern](#architecture-pattern)
4. [User Roles and Permissions](#user-roles-and-permissions)
5. [Database Schema](#database-schema)
6. [Routing Structure](#routing-structure)
7. [User Interface Design](#user-interface-design)

---

## System Overview
The Digital Complaint Escalation and Resolution Monitoring System is a comprehensive full-stack web application designed to facilitate the logging, tracking, and resolution of user complaints. The platform effectively bridges the gap between end-users submitting issues and engineers tasked to resolve them, while providing an administrative overview using data persistence and real-time visualization.

## Technology Stack
The application is built on a modern **Node.js** architecture utilizing the MERN/MEAN paradigm sans frontend frameworks, preferring heavily customized SSR (Server-Side Rendering).

*   **Backend Runtime:** Node.js
*   **Web Framework:** Express.js
*   **Database:** MongoDB, abstracted via Mongoose ODM
*   **Authentication:** Passport.js (Local Strategy) mixed with Session storage and bcrypt caching.
*   **Template Engine:** Express-Handlebars
*   **Frontend UI:** Vanilla HTML/CSS, Bootstrap 4, glassmorphism aesthetics.
*   **Data Visualization:** Chart.js (Doughnut and Bar Charts)

## Architecture Pattern
The project implements a classic **Model-View-Controller (MVC)** structural pattern:
*   **Model:** Handles interactions directly with the MongoDB database (defined inside `models/` directory).
*   **View:** Express-Handlebars dynamic HTML elements that receive evaluated data contexts passed down from the router (located inside `views/` directory).
*   **Controller:** The Express routing rules parse requests, apply middleware logic (e.g. `ensureAuthenticated`), coordinate Mongoose models, and respond via views (orchestrated mostly inside `routes/index.js`).

## User Roles and Permissions
Access Control strictly bifurcates what users can see via Passport.js role verification attached to active sessions (`req.user.role`).

| Role ID | Role Name | System Capabilities & Dashboard Views |
|---------|-----------|---------------------------------------|
| `user` | Standard User | Can submit new complaints, submit site feedback, and view global resolution analytics. Has no access to internal assignment or management routes. |
| `jeng` | Junior Engineer | Acts as the resolution agent. The dashboard renders tasks specifically assigned to them, allowing access to customer contact details and exact physical addresses to solve complaints. |
| `admin` | Administrator | Total system oversight. Can view unassigned tickets, visualize system-wide metrics (success rates, aggregations), read feedback, and assign complaints to specific engineers via `ComplaintMapping`. |

## Database Schema
The database operates on 4 key interconnected MongoDB Collections.

### 1. User
Stores authentication and identity information. Roles divide system capability.
*   `name` (String)
*   `username` (String, Unique)
*   `email` (String)
*   `password` (String, Bcrypt Hashed)
*   `role` (String) [Enums: 'user', 'jeng', 'admin']

### 2. Complaint
The primary artifact detailing the issue submitted by end-users.
*   `name` (String)
*   `email` (String)
*   `contact` (String)
*   `address` (String)
*   `desc` (String) - Expanded text detailing the actual problem.

### 3. Feedback
An independent collection for general application feedback or reviews.
*   `name` (String)
*   `email` (String)
*   `message` (String)

### 4. ComplaintMapping
Operates as the junction/assignment table, acting as a relational bridge in a NoSQL environment. 
*   `complaintID` (String) - References a unique `_id` of a `Complaint`.
*   `engineerName` (String) - References a `username` of a `User` where `role=jeng`.

## Routing Structure
All primary application logic happens inside `routes/index.js`. 

**Public Routes:**
*   `GET /login` / `POST /login` - Auth cycle handler.
*   `GET /register` / `POST /register` - Auth creation handler.

**Protected Routes (Require Authentication):**
*   `GET /` - Root user dashboard with Chart.js analytics.
*   `GET /complaint` / `POST /registerComplaint` - Submission pipeline.
*   `GET /feedback` / `POST /submitFeedback` - Feedback pipeline. 
*   `GET /jeng` - Engineer task rendering block.
*   `GET /admin` - Total overhead view and mapping injection.
*   `POST /assign` - Protected admin endpoint to write to `ComplaintMapping`.

## User Interface Design
The application avoids flat UI placeholders. It features a completely responsive, dark-mode native, premium User Interface relying on:
*   **Animated Gradient Backgrounds:** Smooth transitions via CSS `@keyframes`.
*   **Glassmorphism Container Forms:** Background transparency (`rgba`) layered over backdrop blur (`backdrop-filter`) to generate a frosted glass facade.
*   **Google Inter Typography:** Sans-serif clean web fonts.
*   **Mobile-First Navbar:** Automatically collapses into a hamburger icon at all breakpoints to maintain UI cleanliness and prevent visual clutter.
