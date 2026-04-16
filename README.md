# College-Event-Management-System
# CEMS.rvu — College Event Management System

> A full-stack web platform for RV University, Bengaluru to discover, create, approve, and register for campus events — replacing scattered WhatsApp groups with one centralized hub.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Role-Based Access Control](#role-based-access-control)
- [Project Structure](#project-structure)
- [Pages & Their Purpose](#pages--their-purpose)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Frontend Design System](#frontend-design-system)
- [Docker](#docker)
- [Team](#team)

---

## Project Overview

CEMS is a role-based event management system built for RV University. It supports four user roles — **Admin**, **Faculty**, **Coordinator**, and **User** — each with a distinct set of permissions and views.

| Role | Primary Capability |
|---|---|
| User | Browse and register for approved events |
| Coordinator | Create events, view participant lists |
| Faculty | Review and approve/reject pending events |
| Admin | Manage all users, roles, and events |

---

## Tech Stack

### Frontend
- **HTML5** — semantic markup across all pages
- **CSS3** — unified design system via `styles.css` (CSS custom properties, flexbox, grid)
- **Vanilla JavaScript** — DOM manipulation, Fetch API, sessionStorage-based auth state

### Backend
- **Node.js** with **Express.js** — REST API server on port `5000`
- **MongoDB** — collections for users, events, and event registrations
- **Mongoose** — ODM for schema definition and queries

### DevOps
- **Docker** + **Docker Compose** — containerised backend
- **GitHub Actions** — CI/CD workflow via `.github/workflows/main.yml`

---

## Features

- 🔐 **Role-based authentication** — login redirects to role-specific dashboards
- 📋 **Event lifecycle** — create → pending → faculty approval → published
- ✅ **Event registration** — one registration per user per event; duplicates blocked (HTTP 409)
- 👥 **Participant viewer** — coordinators can view registrant lists per event
- 🛡️ **Admin dashboard** — approve/reject coordinator & faculty requests, manage all users and events
- 🔒 **Auth guards** — unauthenticated users redirected to login and bounced back after sign-in via `sessionStorage.cemsRedirect`
- 🐳 **Dockerised backend** — consistent environment across machines
- ⚙️ **CI/CD** — automated pipeline via GitHub Actions

---

## Role-Based Access Control

Auth state is stored in `sessionStorage` on login:

```js
sessionStorage.setItem("cemsUser", data.name);
sessionStorage.setItem("cemsRole", data.role); // "user" | "coordinator" | "faculty" | "admin"
```

### Nav visibility (managed by `nav-auth.js`)

| Nav Item | User | Coordinator | Faculty | Admin |
|---|---|---|---|---|
| Events | ✅ | ✅ | ✅ | ✅ |
| + Create Event | ❌ | ✅ | ❌ | ❌ |
| ✅ Approve Events | ❌ | ❌ | ✅ | ❌ |
| Sign In / Get Started | hidden when logged in | | | |
| Hi, [Name] + Sign Out | ✅ | ✅ | ✅ | ✅ |

### Post-login redirect

| Role | Redirects to |
|---|---|
| `admin` | `admin-dashboard.html` |
| `faculty` | `approve-events.html` |
| `coordinator` | `events.html` |
| `user` | `events.html` (or stored redirect URL) |

---

## Project Structure

```
College-Event-Management-System/
│
├── .github/
│   └── workflows/
│       └── main.yml                # GitHub Actions CI/CD pipeline
│
├── backend/
│   ├── models/
│   │   ├── Event.js                # Mongoose schema — events
│   │   ├── login.js                # Login logic / auth helper
│   │   ├── Registration.js         # Mongoose schema — event registrations
│   │   └── User.js                 # Mongoose schema — users
│   ├── node_modules/
│   ├── .dockerignore
│   ├── Dockerfile                  # Docker image for the backend
│   ├── package.json
│   ├── package-lock.json
│   └── server.js                   # Express app — all API routes
│
├── frontend/
│   ├── admin-dashboard.html        # Admin control panel
│   ├── approve-events.html         # Faculty event approval
│   ├── create-event.html           # Coordinator: create new event
│   ├── event-register.html         # User: register for an event
│   ├── events-data.js              # Static event data (pre-backend fallback)
│   ├── events.html                 # Event listing page
│   ├── index.html                  # Landing / home page
│   ├── login.html                  # Sign in (all roles)
│   ├── nav-auth.js                 # Dynamic nav state (injected on all pages)
│   ├── register.html               # Multi-step account creation
│   ├── rvu-campus.png              # Hero image
│   └── styles.css                  # Unified design system
│
├── .gitignore
└── README.md
```

---

## Pages & Their Purpose

### `index.html` — Landing Page
- Hero section with RV University campus photo
- Features overview and CTA buttons to Register or Browse Events
- Loads `nav-auth.js` for dynamic nav state

### `login.html` — Sign In
- Email/USN + password form → calls `POST /login`
- On success: stores role + name in `sessionStorage`, redirects by role
- Shows a pending approval message for unapproved coordinator/faculty accounts

### `register.html` — Multi-Step Registration
- **Step 1:** Role selection (User / Coordinator / Faculty)
- **Step 2:** Personal info (name, email, USN, department)
- **Step 3:** Password creation with live strength meter
- Calls `POST /register`
- Users are auto-logged in; Coordinators/Faculty enter the admin approval queue

### `events.html` — Event Listing
- Fetches approved events from `GET /events`
- Filter chips (All / Tech / Cultural / Sports / Workshop) + live search
- Coordinators see a **View Participants** button per event
- Unauthenticated register-link clicks intercepted → redirect to login

### `event-register.html` — Event Registration Form
- Auth-guarded (redirects to login if no session)
- Coordinators and Faculty see a lock screen instead of the registration form
- Reads event details from URL query params (`?id=&title=&date=&venue=&cat=`)
- Calls `POST /api/event-registrations`; handles duplicate registration (HTTP 409)

### `create-event.html` — Create Event
- Accessible to Coordinators only
- Submits a new event in **pending** status awaiting faculty approval

### `approve-events.html` — Faculty Event Approval
- Faculty-only page
- Lists pending events with Approve / Reject actions

### `admin-dashboard.html` — Admin Panel
- Sidebar navigation: Users | Coordinators | Faculty | Events
- **Users:** list all users with delete option
- **Coordinators / Faculty:** pending account requests with Approve / Delete
- **Events:** all events with delete option

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- Docker (optional, for containerised setup)

---

### Option A — Run Locally (without Docker)

**1. Clone the repository**
```bash
git clone https://github.com/varshashivanandk/College-Event-Management-System.git
cd College-Event-Management-System
```

**2. Install backend dependencies**
```bash
cd backend
npm install
```

**3. Configure environment**

Create a `.env` file inside `backend/`:
```env
MONGO_URI=mongodb://localhost:27017/cems
PORT=5000
```

**4. Start the backend**
```bash
node server.js
```

API will be available at `http://localhost:5000`.

**5. Open the frontend**

Open `frontend/index.html` in your browser, or serve it locally:
```bash
cd frontend
npx serve .
```

---

### Option B — Run with Docker

**1. Build and start the backend container**
```bash
cd backend
docker build -t cems-backend .
docker run -p 5000:5000 --env MONGO_URI=<your_mongo_uri> cems-backend
```

**2. Open the frontend**

Open `frontend/index.html` directly in your browser. The frontend is static and does not require a container.

---

### Default Admin Account

Seed your MongoDB with an initial admin user:

```json
{
  "name": "Admin",
  "email": "admin@rvu.edu.in",
  "password": "<bcrypt_hashed_password>",
  "role": "admin",
  "approved": true
}
```

---

## API Endpoints

All endpoints are served from `http://localhost:5000`.

### Auth

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/register` | Register a new user |
| `POST` | `/login` | Authenticate and return role |

### Users (Admin)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/users` | Get all users |
| `GET` | `/coordinator-requests` | Get pending coordinator accounts |
| `GET` | `/faculty-requests` | Get pending faculty accounts |
| `PUT` | `/approve-user/:id` | Approve a pending user |
| `DELETE` | `/delete-user/:id` | Delete a user |

### Events

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/events` | Get all approved events |
| `GET` | `/admin-events` | Get all events (admin view) |
| `POST` | `/create-event` | Create a new event (coordinator) |
| `PUT` | `/approve-event/:id` | Approve a pending event (faculty) |
| `DELETE` | `/delete-event/:id` | Delete an event (admin) |

### Event Registrations

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/event-registrations` | Register a user for an event |
| `GET` | `/event-registrations/:eventId` | Get all registrants for an event |

---

## Frontend Design System

All styles live in `frontend/styles.css` using CSS custom properties:

```css
--ink:      #0a0a14;   /* Primary text / dark backgrounds */
--paper:    #f5f3ee;   /* Light backgrounds / nav text */
--accent:   #ff4d2e;   /* Primary red — CTAs, highlights */
--accent2:  #3d5afe;   /* Secondary blue */
--muted:    #6b7280;   /* Subdued / secondary text */
--border:   #e5e7eb;   /* Card and field borders */
--card-bg:  #ffffff;   /* Card backgrounds */
```

### Typography

| Font | Usage |
|---|---|
| **Syne** | Headings, logo, buttons |
| **DM Sans** | Body text, labels, metadata |

---

## Docker

The backend includes a `Dockerfile` and `.dockerignore` for containerisation.

```dockerfile
# backend/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

`.dockerignore` excludes:
```
node_modules
.env
```

---
## Team

Built as part of a 5-person Agile Scrum team at RV University, BTech CSE (AI & ML).

| Role | Responsibility |
|---|---|
| Frontend Developer | All frontend/ HTML pages, styles.css, nav-auth.js, UI testing & bug fixing |
| Backend Developer | server.js, Express routes, auth logic, backend testing & debugging |
| Database Engineer | Mongoose models (User.js, Event.js, Registration.js), data validation & integrity checks |
| Scrum Master | Sprint planning, backlog, standups, team facilitation |
| Product Owner | Defines requirements, manages product backlog, prioritizes features, reviews sprint deliverables |


---

*CEMS.rvu · RV University, Bengaluru · © 2026*
