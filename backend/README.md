# HealthConnect Backend API

Production-grade healthcare management backend built with Node.js, Express.js, and MongoDB.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env
# Edit .env with your MongoDB URI and secrets

# 3. Run in development
npm run dev

# 4. Open Swagger docs
# http://localhost:5000/api-docs
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js (LTS) |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (Access + Refresh) |
| Hashing | bcrypt |
| Validation | Joi |
| Docs | Swagger / OpenAPI |
| PDF | PDFKit |
| Excel | ExcelJS |
| Email | Nodemailer |
| Logging | Winston |
| Security | Helmet, CORS, Rate Limit, mongo-sanitize, HPP |

## API Endpoints

### Auth — `/api/auth`
| Method | Path | Description |
|--------|------|-------------|
| POST | `/register` | Register user (PATIENT/DOCTOR/ADMIN) |
| POST | `/login` | Login with email/password |
| POST | `/refresh` | Refresh access token |
| POST | `/logout` | Revoke refresh tokens |
| POST | `/mfa/setup` | Setup MFA (Doctor/Admin) |
| POST | `/mfa/verify` | Verify MFA OTP |

### Patients — `/api/patients`
| Method | Path | Description |
|--------|------|-------------|
| GET | `/me` | Get profile |
| PUT | `/me` | Update profile |
| GET | `/me/treatments` | Treatment history (paginated) |
| GET | `/me/treatments/:id` | Treatment detail |
| GET | `/me/unsuitable-medicines` | Flagged medicines |
| GET | `/me/export/pdf` | Download PDF report |
| GET | `/me/export/excel` | Download Excel report |

### Doctors — `/api/doctors`
| Method | Path | Description |
|--------|------|-------------|
| GET | `/me` | Get profile |
| GET | `/me/patients` | Patients treated |
| GET | `/me/patients/:id` | Patient detail |
| POST | `/me/patients/:id/treatments` | Create treatment |
| POST | `/patients/:id/unsuitable-medicines` | Flag medicine |
| DELETE | `/unsuitable-medicines/:id` | Remove flag |

### Treatments — `/api/treatments`
| Method | Path | Description |
|--------|------|-------------|
| PUT | `/:treatmentId` | Update (owner only) |
| DELETE | `/:treatmentId` | Soft-delete |

### Admin — `/api/admin`
| Method | Path | Description |
|--------|------|-------------|
| GET | `/audit-logs` | Paginated audit logs |

## Environment Variables

See `.env.example` for all required variables.

## Project Structure

```
src/
├── config/         # DB, env, Swagger config
├── controllers/    # Request handlers
├── middlewares/     # Auth, role, validation, rate limit, errors
├── models/         # Mongoose schemas
├── routes/         # Express routes with Swagger annotations
├── services/       # Business logic
├── utils/          # JWT, email, OTP, response helpers
└── validators/     # Joi validation schemas
```
