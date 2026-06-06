# PAAI — ISO 27001 Audit Platform

A secure web platform for performing internal ISO 27001:2022 audits. Assess all 93 Annex A controls, track non-conformities, and generate PDF reports.

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [PostgreSQL](https://www.postgresql.org/) running locally

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/val052002/paai.git
cd paai
```

### 2. Setup the Database

```bash
# Create the database
psql -U postgres -c "CREATE DATABASE paai27001;"

# Run schema (creates all tables)
psql -U postgres -d paai27001 -f paai-backend/src/db/schema.sql

# Seed the 93 ISO 27001:2022 controls
psql -U postgres -d paai27001 -f paai-backend/src/db/seed.sql
```

### 3. Configure the Backend

```bash
cd paai-backend
cp .env.example .env
```

Edit `.env` and fill in your values:

```env
PORT=3001

DB_HOST=localhost
DB_PORT=5432
DB_NAME=paai27001
DB_USER=postgres
DB_PASSWORD=your_postgres_password

JWT_SECRET=any_long_random_string
JWT_MFA_SECRET=another_long_random_string

FRONTEND_URL=http://localhost:5173
```

Install dependencies and start:

```bash
npm install
npm run dev
```

Backend runs on `http://localhost:3001`

### 4. Setup the Frontend

Open a new terminal:

```bash
cd paai-frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## Usage

1. Open `http://localhost:5173`
2. **Sign Up** — enter company name, email and password
3. **Sign In** — enter credentials
4. **MFA Setup** — scan the QR code with **Google Authenticator** or **Authy**, then confirm with the 6-digit code
5. **Dashboard** — create a new audit
6. **Audit Detail** — assess all 93 ISO 27001 controls across 4 domains, mark each as Compliant or Non-Conformity, add observations
7. **Finalize** — submit the audit to generate the report
8. **Report** — view compliance stats, non-conformities with recommendations, and download as PDF

---

## Project Structure

```
paai/
├── paai-backend/         # Node.js + Express REST API
│   ├── src/
│   │   ├── config/       # Database connection
│   │   ├── controllers/  # Request handlers
│   │   ├── db/           # SQL schema + seed
│   │   ├── middleware/   # JWT auth + error handler
│   │   ├── routes/       # API routes
│   │   └── services/     # Business logic + PDF generation
│   ├── .env.example
│   └── server.js
└── paai-frontend/        # React + Vite SPA
    └── src/
        └── pages/        # Landing, Auth, Dashboard, Audit, Report
```

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Register a company |
| POST | `/auth/login` | No | Login |
| POST | `/auth/mfa/setup` | Yes | Generate MFA QR code |
| POST | `/auth/mfa/confirm` | Yes | Confirm MFA setup |
| POST | `/auth/mfa/verify` | No | Verify MFA code on login |
| GET | `/requirements` | Yes | List all 93 ISO controls |
| POST | `/audits` | Yes | Create a new audit |
| GET | `/audits` | Yes | List company audits |
| GET | `/audits/:id` | Yes | Get audit with controls |
| POST | `/audits/:id/responses` | Yes | Save control responses |
| POST | `/audits/:id/finalize` | Yes | Finalize audit |
| GET | `/audits/:id/report` | Yes | Get audit report (JSON) |
| GET | `/audits/:id/report/pdf` | Yes | Download report as PDF |

---

## Tech Stack

- **Backend:** Node.js, Express 5, PostgreSQL, JWT, bcrypt, otplib, pdfkit
- **Frontend:** React, Vite, React Router
- **Auth:** JWT + TOTP MFA (Google Authenticator compatible)
