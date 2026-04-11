# Smart Campus System

A full-stack smart campus management system built to support key university operations through a single platform. The project combines a React + Vite frontend with a Spring Boot backend and MongoDB database.

## Overview

This system is designed to help manage common campus workflows such as:

- resource and facility catalogue management
- booking and reservation management
- support ticket handling
- authentication and role-based access
- notifications and user administration

The repository is organized into two main applications:

- `Frontend` – React client application
- `Backend` – Spring Boot REST API

## Main Modules

### 1. Facilities Catalogue
This module manages campus resources and facilities.

Features include:
- view all resources
- view resource details
- add new resources
- edit existing resources
- admin resource management
- check resource availability
- filter and search resources

### 2. Booking Management
This module handles reservations for facilities and equipment.

Features include:
- create bookings
- create equipment bookings
- view booking details
- view personal bookings
- admin booking management
- approve or reject bookings
- booking calendar view
- conflict checking

### 3. Ticketing System
This module supports issue reporting and service requests.

Features include:
- create tickets
- upload ticket attachments
- view personal tickets
- admin ticket management
- technician-assigned tickets
- update ticket status
- ticket analytics
- resolve and close tickets

### 4. Authentication and User Management
This module manages access and user identity.

Features include:
- user registration
- login with email/password
- Google OAuth login
- forgot password and reset password flow
- profile setup
- role-based route protection
- admin user and role management

### 5. Notifications
This module provides user notifications across the system.

Features include:
- view notifications
- unread count
- mark single notification as read
- mark all notifications as read
- delete notifications

## Tech Stack

### Frontend
- React
- Vite
- React Router
- Axios
- React Toastify
- Google OAuth
- CSS

### Backend
- Java
- Spring Boot
- Spring Security
- Spring Web MVC
- MongoDB
- JWT authentication
- Java Mail
- Maven
- Lombok

## Project Structure

```text
it3030-paf-2026-smart-campus-group02/
├── Backend/
│   ├── src/main/java/com/smart_campus_system/knd02/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── dto/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── security/
│   │   ├── services/
│   │   └── utils/
│   └── src/main/resources/
├── Frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── contexts/
│       ├── pages/
│       │   ├── C_Ticketing/
│       │   ├── I_FacilitiesCatalogue/
│       │   ├── P_admin/
│       │   ├── P_login/
│       │   ├── P_notifications/
│       │   ├── P_register/
│       │   ├── T_Booking/
│       │   └── sharedPages/
│       ├── services/
│       ├── utils/
│       └── validation/
└── uploads/
```

## Frontend Dependencies

The frontend currently uses the following main packages:

- `react`
- `react-dom`
- `react-router-dom`
- `axios`
- `react-toastify`
- `@react-oauth/google`
- `jwt-decode`
- `react-icons`

## Backend Features Exposed Through APIs

### Authentication APIs
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/google`
- `POST /api/auth/password/forgot`
- `POST /api/auth/password/reset`

### Resource APIs
- `GET /api/resources`
- `GET /api/resources/{id}`
- `POST /api/resources`
- `PUT /api/resources/{id}`
- `DELETE /api/resources/{id}`
- `GET /api/resources/search`
- `GET /api/resources/filter`
- `PATCH /api/resources/{id}/status`
- `GET /api/resources/{id}/availability`

### Booking APIs
- `GET /api/bookings`
- `GET /api/bookings/my`
- `GET /api/bookings/{id}`
- `POST /api/bookings`
- `PUT /api/bookings/{id}`
- `PATCH /api/bookings/{id}/cancel`
- `PATCH /api/bookings/{id}/approve`
- `PATCH /api/bookings/{id}/reject`
- `PATCH /api/bookings/{id}/pending`
- `POST /api/bookings/check-conflict`

### Ticket APIs
- `GET /api/tickets`
- `GET /api/tickets/my`
- `GET /api/tickets/my-assigned`
- `GET /api/tickets/{id}`
- `POST /api/tickets`
- `PUT /api/tickets/{id}`
- `PATCH /api/tickets/{id}/assign`
- `PATCH /api/tickets/{id}/status`
- `PATCH /api/tickets/{id}/reject`
- `PATCH /api/tickets/{id}/resolve`
- `PATCH /api/tickets/{id}/close`
- `DELETE /api/tickets/{id}`

### Notification APIs
- `GET /api/notifications`
- `GET /api/notifications/unread-count`
- `PATCH /api/notifications/{id}/read`
- `PATCH /api/notifications/read-all`
- `DELETE /api/notifications/{id}`

### User Management APIs
- `GET /api/users`
- `GET /api/users/{id}`
- `POST /api/users`
- `PUT /api/users/{id}`
- `DELETE /api/users/{id}`
- `PATCH /api/users/{id}/role`

## Getting Started

### Prerequisites
Make sure you have the following installed:

- Node.js and npm
- Java JDK
- Maven or the Maven Wrapper
- MongoDB Atlas or local MongoDB

## Run the Frontend

```bash
cd Frontend
npm install
npm run dev
```

The frontend starts with Vite.

## Run the Backend

```bash
cd Backend
./mvnw spring-boot:run
```

For Windows:

```bash
cd Backend
mvnw.cmd spring-boot:run
```

The backend is configured to run on port `5000`.

## Environment and Configuration Notes

Before using this project in development or deployment, move sensitive values into environment variables or a secure secret manager.

Recommended items to externalize:
- MongoDB connection string
- JWT secret
- mail username and password
- Google OAuth client ID

Example frontend `.env`:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_API_BASE_URL=http://localhost:5000
```

Example backend configuration:

```properties
server.port=5000
spring.mongodb.uri=your_mongodb_uri
spring.mongodb.database=campus_ms
jwt.secret=your_jwt_secret
jwt.expiration=36000000
spring.mail.username=your_email
spring.mail.password=your_app_password
```

## Suggested Improvements

- add a proper root landing route if needed
- replace hardcoded secrets with environment variables
- add unit and integration tests
- add API documentation with Swagger/OpenAPI
- add Docker support for easier deployment
- improve validation and error handling across modules
- add role/permission matrix documentation

## Contribution Workflow

A simple workflow for contributors:

```bash
git clone <repo-url>
cd it3030-paf-2026-smart-campus-group02
```

Then work inside either:
- `Frontend/`
- `Backend/`

Suggested branch naming:
- `feature/facilities-catalogue`
- `feature/booking-module`
- `feature/ticketing-module`
- `feature/auth-module`

## Academic Project Note

This repository appears to be a group project with separate functional areas contributed by different members. The naming convention in the frontend such as `I_`, `T_`, `C_`, and `P_` suggests module-based ownership and organization.

## License

This project is currently for academic and educational purposes.

---

If you want to use this README directly in GitHub, replace the existing root `README.md` with this content and update screenshots, team member names, and deployment links if available.
