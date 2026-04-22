# Migration Plan: Node.js to Java Spring Boot

## Objective
To successfully migrate the existing monolithic Node.js/Express backend of the Digital Complaint Escalation and Resolution Monitoring System to a robust, scalable Java Spring Boot backend architecture.

## Phase 1: Project Initialization and Setup (Completed)
- Initialize a new Spring Boot application (`spring-backend`).
- Configure Maven dependencies: `spring-boot-starter-web`, `spring-boot-starter-data-mongodb`, `spring-boot-starter-security`.
- Set up `application.properties` to connect to the existing MongoDB instance (`mongodb://localhost:27017/complaintapp`).

## Phase 2: Data Modeling and Repositories (Completed)
- Recreate existing MongoDB schemas as Java Entity classes (`@Document`).
  - `User.java`
  - `Complaint.java`
  - `ComplaintMapping.java`
  - `Feedback.java`
- Implement Spring Data `MongoRepository` interfaces for each entity to handle database operations (CRUD).

## Phase 3: REST API Development (Completed)
- Develop standard REST Controllers mapping to the old Express routes:
  - **AuthController**: Handles `/api/auth/login` and `/api/auth/register`.
  - **ComplaintController**: Handles user complaint submissions (`/api/complaints/register`), tracking (`/api/complaints/track/{id}`), and feedback (`/api/complaints/feedback`).
  - **AdminController**: Serves system metrics, list of engineers, and handles assignments (`/api/admin/dashboard`, `/api/admin/assign`).
  - **JuniorEngineerController**: Serves tasks assigned to an engineer and handles resolutions (`/api/jeng/dashboard/{engineerName}`, `/api/jeng/resolve/{complaintID}`).

## Phase 4: Security Implementation (Completed)
- Configure `SecurityConfig.java`.
- Set up `BCryptPasswordEncoder` for password hashing to match the existing user authentication logic from Passport.js.
- Define route access permissions.

## Phase 5: Frontend Integration Strategy (Pending Action)
Since the legacy frontend was tightly coupled to Express using `Express-Handlebars`, moving to a Spring Boot REST API requires a frontend decision:
1. **Option A (Thymeleaf Monolith):** Convert all `.handlebars` files to `.html` and use Thymeleaf templating engine natively within the Spring Boot application.
2. **Option B (Decoupled SPA):** Build a separate Single Page Application (using React, Vue, or Angular) to consume the newly created Spring Boot REST endpoints.
3. **Option C (Express Proxy):** Keep the existing Node.js app alive solely to render Handlebars UI, but strip its database logic and make internal HTTP requests to the Spring Boot backend.
