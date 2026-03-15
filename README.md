# Bharat Tourism - Luxury Travel Platform

A full-stack, production-ready travel booking platform designed with luxury editorial aesthetics. It features dynamic itineraries, a curated portfolio of Indian destinations, a secure admin dashboard, and user authentication. 

![Bharat Tourism Banner](https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2000&auto=format&fit=crop)

## 🚀 Features

- **Luxury Aesthetic**: High-end editorial design with elegant typography (`Playfair Display` & `Montserrat`) and fluid Framer Motion animations.
- **Full-Stack Architecture**: React (Vite) frontend with a Node.js/Express backend, persisted via Prisma ORM & PostgreSQL.
- **Admin Dashboard**: Manage user bookings, update itinerary statuses (Pending, Confirmed, Cancelled), and curate new travel packages.
- **User Portals**: Secure JWT authentication, private user profiles, and real-time itinerary tracking.
- **Dockerized**: 100% containerized with Docker Compose for immediate spin-up of the frontend, backend API, and database.

---

## 🛠 Tech Stack

**Frontend**
- React 19 + TypeScript
- Vite + React Router
- TailwindCSS (v4)
- Framer Motion & Lucide Icons
- Nginx (Docker Host)

**Backend**
- Node.js + Express
- Prisma ORM
- PostgreSQL 15
- Bcrypt & JSON Web Tokens (JWT)

---

## ⚙️ Quick Start (Dockerized)

The easiest way to run the application is via Docker Compose, which boots the UI, API, and Database simultaneously.

### 1. Prerequisites
- [Docker](https://www.docker.com/products/docker-desktop/) installed & running.

### 2. Environment Variables
Copy the example environment file and rename it to `.env`:
```bash
cp .env.example .env
```
*(The default credentials in `.env.example` will work out of the box for local Docker execution).*

### 3. Build & Run
Spin up the entire stack in detached mode:
```bash
docker compose up -d --build
```

### 4. Automated Database Setup
Once the containers are spinning up, the Backend Node instance will *automatically* push the Prisma schema to the PostgreSQL container and securely pre-populate the initial luxurious destinations through its explicit `entrypoint.sh` launch script. You don't need to manually run any seed commands!

### 5. Access the Platform
- **Frontend App**: [http://localhost:8080](http://localhost:8080/)
- **Backend API**: [http://localhost:5050](http://localhost:5050/)

---

## 🔑 Default Credentials

After seeding the database, you can log in to the hidden Admin Dashboard using the following credentials:

- **Email:** `admin@bharattourism.com`
- **Password:** `admin123`

---

## 💻 Manual Setup (Without Docker)

If you prefer to run the application components manually on your host machine:

### Backend
1. `cd backend`
2. `npm install`
3. Create a `.env` file in the `backend/` directory with your actual local PostgreSQL `DATABASE_URL`.
4. `npx prisma db push` followed by `npx prisma db seed`
5. `npm run dev` (Starts API on port 5000)

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev` (Starts Vite UI on port 5173 - proxies `/api` calls to port 5000)

---

## 📄 License
This project is open-source and available under the MIT License.
