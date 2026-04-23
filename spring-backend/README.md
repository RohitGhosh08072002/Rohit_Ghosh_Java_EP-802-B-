# Resolutix - Java Spring Boot Backend

<p align="center">
  <img src="https://img.shields.io/badge/Spring%20Boot-4.0.x-brightgreen?style=flat-square&logo=springboot"/>
  <img src="https://img.shields.io/badge/Java-17-orange?style=flat-square&logo=openjdk"/>
  <img src="https://img.shields.io/badge/MongoDB-7.x-success?style=flat-square&logo=mongodb"/>
  <img src="https://img.shields.io/badge/Maven-3.x-C71A22?style=flat-square&logo=apachemaven"/>
</p>

## Overview
This directory contains the secondary backend implementation for **Resolutix**, built with Java and Spring Boot. It provides a full REST API for the Complaint Management System, designed to decouple the frontend from the legacy Node.js/Express monolith.

---

## 🛠️ Tech Stack & Dependencies

The backend utilizes modern Spring ecosystem technologies defined in `pom.xml`:

- **Java 17**: Core language features.
- **Spring Boot 4.0.5**: Core framework.
- **Spring Web (WebMVC)**: For building RESTful web applications and APIs.
- **Spring Data MongoDB**: For database integration and Document Object Mapping (DOM) with MongoDB.
- **Spring Security**: For authentication and authorization (utilizing BCrypt).
- **Spring Validation**: For request payload validation.
- **Maven**: Dependency management and build tool.

---

## 📂 Project Structure

```
spring-backend/
├── pom.xml                   # Maven dependencies and build configuration
└── src/main/java/com/example/demo/
    ├── ComplaintSystemBackendApplication.java  # Application Entry Point
    │
    ├── config/
    │   └── SecurityConfig.java                 # Password encoding (BCrypt) & CORS rules
    │
    ├── models/                                 # MongoDB Document Entities
    │   ├── User.java                           # Stores user, admin, jeng details
    │   ├── Complaint.java                      # Core complaint document
    │   ├── ComplaintMapping.java               # Relationship mapping between Complaint & Engineer
    │   └── Feedback.java                       # User feedback data
    │
    ├── repositories/                           # Spring Data Mongo Repositories
    │   ├── UserRepository.java
    │   ├── ComplaintRepository.java
    │   ├── ComplaintMappingRepository.java
    │   └── FeedbackRepository.java
    │
    └── controllers/                            # REST API Endpoints
        ├── AuthController.java                 # Login & Registration endpoints
        ├── ComplaintController.java            # Complaint creation and tracking
        ├── AdminController.java                # Admin dashboard stats and assignment operations
        └── JuniorEngineerController.java       # Engineer assignments and resolution endpoints
```

---

## 🔌 API Endpoints Summary

### Auth (`AuthController.java`)
- `POST /api/auth/register`: Register a new user with BCrypt hashed password.
- `POST /api/auth/login`: Authenticate existing users.

### Complaints (`ComplaintController.java`)
- `POST /api/complaints`: Register a new complaint with an auto-generated 24-char unique ID.
- `GET /api/complaints`: Fetch all complaints.
- `GET /api/complaints/{id}`: Track specific complaint status by its ID.

### Admin (`AdminController.java`)
- `GET /api/admin/dashboard`: Fetch aggregated platform stats (Total, Resolved, Pending, Feedback).
- `POST /api/admin/assign`: Assign a complaint to a specific Junior Engineer (`jeng`).

### Junior Engineer (`JuniorEngineerController.java`)
- `GET /api/jeng/assignments`: View complaints assigned to the logged-in engineer.
- `POST /api/jeng/resolve`: Mark an assigned complaint as `resolved`.

---

## 🔒 Security Configuration

The `SecurityConfig` class implements:
1. **BCrypt Password Encoder**: Ensures all passwords are securely hashed before storing them in MongoDB.
2. **CORS Filters**: Configured to allow cross-origin requests from the frontend application, specifically necessary when transitioning from the Node.js frontend to this API.
3. *Note:* Current configuration disables CSRF (`csrf().disable()`) for simplified REST API development. For production, JWT (JSON Web Tokens) or strict Session Management should be implemented.

---

## 🏃 Running the Application

### Prerequisites
- JDK 17 installed
- MongoDB running locally on default port `27017` (Database: `complaintapp`)
- Maven installed (or use the provided `mvnw` wrapper)

### Commands

**1. Navigate to the directory:**
```bash
cd spring-backend
```

**2. Run using Maven Wrapper:**
```bash
./mvnw spring-boot:run
```
*(On Windows use `mvnw.cmd spring-boot:run`)*

**3. The API will start on:**
`http://localhost:8080`

---

## 🛣️ Roadmap & Future Enhancements

- **JWT Integration**: Transition from stateless open endpoints to JWT token-based authentication.
- **Method-Level Security**: Introduce `@PreAuthorize` annotations for role-based access control (`admin`, `jeng`, `user`).
- **Validation constraints**: Add strict `@Valid` constraints to DTOs/Entities to ensure data integrity before database insertion.
