# ClinicQ – Health Centre Consultation Room Booking System

## 1. Project Overview

ClinicQ is a REST API-based consultation room booking system developed for a health centre. It helps manage doctors, consultation rooms, and patient consultation bookings.

The system allows users to add and view doctors, manage consultation rooms, create bookings, check booking details, and update booking statuses. It also prevents double booking of the same room at the same date and time.

## 2. Objectives

- To develop REST APIs using Node.js and Express.js.
- To manage doctor and consultation room details.
- To create and retrieve consultation bookings.
- To validate user inputs.
- To prevent duplicate room bookings.
- To manage booking status transitions.

## 3. Technologies Used

- Node.js
- Express.js
- SQLite
- SQLite3
- Postman
- Visual Studio Code
- JavaScript

## 4. Project Folder Structure

```text
ClinicQ-BDF-Assignment/
│
├── routes/
│   ├── doctors.js
│   ├── rooms.js
│   └── bookings.js
│
├── screenshots/
├── postman/
├── database.js
├── server.js
├── clinicq.db
├── package.json
├── package-lock.json
└── README.md
```

## 5. Database Design

The project uses an SQLite database named `clinicq.db`.

It contains three tables:

### Doctors
Stores doctor information:
- id
- name
- specialization

### Rooms
Stores consultation room information:
- id
- name
- floor

### Bookings
Stores booking information:
- id
- doctor_id
- room_id
- booking_date
- booking_time
- status

Foreign keys connect bookings with doctors and rooms.

## 6. API Endpoints

### Doctors API

| Method | Endpoint | Description |
|---|---|---|
| GET | /doctors | Get all doctors |
| GET | /doctors/:id | Get doctor by ID |
| POST | /doctors | Add a doctor |

### Rooms API

| Method | Endpoint | Description |
|---|---|---|
| GET | /rooms | Get all rooms |
| GET | /rooms?floor=1 | Search rooms by floor |
| GET | /rooms/:id | Get room by ID |
| POST | /rooms | Add a room |
| PUT | /rooms/:id | Update a room |
| DELETE | /rooms/:id | Delete a room |

### Bookings API

| Method | Endpoint | Description |
|---|---|---|
| GET | /bookings | Get all bookings |
| GET | /bookings/:id | Get booking by ID |
| POST | /bookings | Create a booking |
| PUT | /bookings/:id/status | Update booking status |

## 7. Validation and Error Handling

The application includes input validation and appropriate HTTP status codes.

- 200 – Successful request.
- 201 – Resource created successfully.
- 400 – Invalid input or validation error.
- 404 – Requested resource not found.
- 409 – Booking conflict or duplicate room.
- 500 – Internal server error.

The system prevents two active bookings for the same room, date, and time.

Booking statuses follow this sequence:

**Pending → Approved → Done**

Invalid status transitions are rejected.

## 8. Installation and Execution

### Step 1: Install dependencies

```bash
npm install
```

### Step 2: Start the development server

```bash
npm run dev
```

### Step 3: Open the API

```text
http://localhost:3000
```

### Step 4: Test APIs

Use Postman to test the Doctors, Rooms, and Bookings endpoints.

## 9. Testing

The APIs were tested using Postman.

The testing covered:

- Adding and retrieving doctors.
- Adding, retrieving, updating, and deleting rooms.
- Searching rooms by floor.
- Creating and retrieving bookings.
- Preventing duplicate room bookings.
- Approving and completing bookings.
- Testing invalid status transitions.
- Testing invalid booking inputs.

Screenshots of API testing results are available in the `screenshots` folder.

## 10. Conclusion

The ClinicQ Health Centre Consultation Room Booking System successfully demonstrates REST API development using Node.js, Express.js, and SQLite. It provides functionality for managing doctors, rooms, and bookings with validation and error handling. The project also implements booking conflict prevention and booking status management.

The project helped us understand backend development, database integration, REST API methods, and API testing using Postman.

## 11. Student Details

- **Student Name:** Sai Rashmitha
- **Registration Number:** 252U1R9056
- **Section:** CSE (Gen-AI) 2A
- **Course:** Backend Development Fundamentals
- **Academic Year:** II Year, Term II
- **Institution:** Aurora Deemed to be University
- **Faculty:** Mr. Joel Prashanth D.

## 12. Team Members

Add the names and registration numbers of all group members here.
