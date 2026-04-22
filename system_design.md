# Digital Complaint Escalation and Resolution Monitoring System

## Table of Contents
1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture Pattern](#architecture-pattern)
4. [User Roles and Permissions](#user-roles-and-permissions)
5. [Database Schema](#database-schema)
6. [API Routing Structure](#api-routing-structure)
7. [User Interface Design](#user-interface-design)

---

## System Overview
The Digital Complaint Escalation and Resolution Monitoring System is a comprehensive web application designed to facilitate the logging, tracking, and resolution of user complaints. The platform effectively bridges the gap between end-users submitting issues and engineers tasked to resolve them, while providing an administrative overview using data persistence and real-time visualization.

## Technology Stack
The application has been migrated from a monolithic Node.js setup to a decoupled, robust **Java Spring Boot** backend.

*   **Backend Runtime:** Java 17
*   **Web Framework:** Spring Boot (Spring Web, Spring Security)
*   **Database:** MongoDB, abstracted via Spring Data MongoDB
*   **Authentication:** Spring Security with BCrypt Password Hashing
*   **Legacy Frontend (Optional transition state):** Express-Handlebars / Node.js
*   **Frontend UI:** Vanilla HTML/CSS, Bootstrap 4, glassmorphism aesthetics.
*   **Data Visualization:** Chart.js (Doughnut and Bar Charts)

## Architecture Pattern
The backend project implements a **RESTful API** structural pattern:
*   **Models (@Document):** Handles interactions directly with the MongoDB database (defined inside `com.example.demo.models`).
*   **Repositories:** Spring Data MongoDB interfaces abstracting database operations (`com.example.demo.repositories`).
*   **Controllers (@RestController):** Handle incoming HTTP requests, coordinate with repositories, and return JSON responses (`com.example.demo.controllers`).
*   **Security Configuration:** Defines route protections and CORS logic (`com.example.demo.security`).

## User Roles and Permissions
Access Control strictly bifurcates what users can do. Permissions dictate API endpoint accessibility.

| Role ID | Role Name | System Capabilities & Dashboard Views |
|---------|-----------|---------------------------------------|
| `user` | Standard User | Can submit new complaints, submit site feedback, and view global resolution analytics. Has no access to internal assignment or management routes. |
| `jeng` | Junior Engineer | Acts as the resolution agent. Fetches tasks specifically assigned to them via the API, allowing access to customer contact details to solve complaints. |
| `admin` | Administrator | Total system oversight. Can fetch unassigned tickets, visualize system-wide metrics, read feedback, and assign complaints to specific engineers via `ComplaintMapping`. |

## Database Schema
The database operates on 4 key interconnected MongoDB Collections.

### 1. User
Stores authentication and identity information. Roles divide system capability.
*   `id` (String)
*   `name` (String)
*   `username` (String, Unique)
*   `email` (String)
*   `password` (String, Bcrypt Hashed)
*   `role` (String) [Enums: 'user', 'jeng', 'admin']

### 2. Complaint
The primary artifact detailing the issue submitted by end-users.
*   `id` (String)
*   `name` (String)
*   `email` (String)
*   `contact` (String)
*   `address` (String)
*   `desc` (String) - Expanded text detailing the actual problem.
*   `status` (String) - Default 'Pending'.

### 3. Feedback
An independent collection for general application feedback or reviews.
*   `id` (String)
*   `name` (String)
*   `email` (String)
*   `message` (String)

### 4. ComplaintMapping
Operates as the junction/assignment table, acting as a relational bridge in a NoSQL environment. 
*   `id` (String)
*   `complaintID` (String) - References a unique `id` of a `Complaint`.
*   `engineerName` (String) - References a `username` of a `User` where `role=jeng`.

## API Routing Structure
All primary application logic is exposed via Spring Boot REST Controllers.

**Auth Controller (`/api/auth`)**
*   `POST /register` - Auth creation handler.
*   `POST /login` - Auth cycle handler and role retrieval.

**Complaint Controller (`/api/complaints`)**
*   `POST /register` - Complaint submission pipeline.
*   `GET /track/{id}` - Retrieves complaint details and resolution mapping based on ID.
*   `POST /feedback` - Feedback submission pipeline.

**Admin Controller (`/api/admin`)**
*   `GET /dashboard` - Retrieves total system overhead view, all metrics, user lists, and mappings.
*   `POST /assign` - Protected admin endpoint to write to `ComplaintMapping`.

**Junior Engineer Controller (`/api/jeng`)**
*   `GET /dashboard/{engineerName}` - Retrieves tasks specifically assigned to the given engineer.
*   `POST /resolve/{complaintID}` - Endpoint to update a complaint's status to 'Resolved'.

## User Interface Design
The original application UI relies on:
*   **Animated Gradient Backgrounds:** Smooth transitions via CSS `@keyframes`.
*   **Glassmorphism Container Forms:** Background transparency (`rgba`) layered over backdrop blur (`backdrop-filter`) to generate a frosted glass facade.
*   **Google Inter Typography:** Sans-serif clean web fonts.
*   **Mobile-First Navbar:** Automatically collapses into a hamburger icon at all breakpoints to maintain UI cleanliness and prevent visual clutter.
