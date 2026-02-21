# Finance App

Personal finance management system with shared categories, spending limits, and visual alerts.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS |
| Backend | .NET 8 Web API (C#) |
| Database | PostgreSQL 16 |
| Auth | JWT Bearer tokens |
| Containerization | Docker + Docker Compose |

---

## Features

- **Categories** — Create categories with custom icons, colors, and monthly spending limits
- **Expenses** — Add, view, edit, and delete individual expenses per category
- **Budget tracking** — Visual progress bar with color alerts (green → orange → red)
- **Over-limit alerts** — Instant warnings when spending exceeds the monthly limit
- **Month navigation** — Browse and compare spending across different months
- **Sharing** — Share categories with other users (read-only or edit permission)
- **Authentication** — Secure registration and login with JWT

---

## Quick Start

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose

### Run with Docker

```bash
docker-compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API + Swagger | http://localhost:5000 |
| PostgreSQL | localhost:5432 |

### Local Development (without Docker)

**Backend**
```bash
cd BackEnd/FinanceApp.Api
dotnet restore
dotnet run
```

**Frontend**
```bash
cd FrontEnd
npm install
npm run dev
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive JWT token |

### Categories
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/categories?year=&month=` | List user's categories with spending totals |
| `POST` | `/api/categories` | Create a new category |
| `GET` | `/api/categories/{id}/status` | Get detailed status for a category |

### Expenses
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/categories/{id}/expenses?year=&month=` | List expenses for a category |
| `POST` | `/api/categories/{id}/expenses` | Add an expense to a category |
| `PUT` | `/api/categories/{id}/expenses/{expenseId}` | Edit an expense |
| `DELETE` | `/api/categories/{id}/expenses/{expenseId}` | Delete an expense |

### Monthly Config
| Method | Endpoint | Description |
|---|---|---|
| `PUT` | `/api/categories/{id}/month-config` | Create or update monthly spending limit |
| `GET` | `/api/categories/{id}/month-config/{year}/{month}` | Get monthly limit details |

### Sharing
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/categories/{id}/share` | Share a category with another user |

> All endpoints except auth require a `Bearer` JWT token in the `Authorization` header.
> Interactive documentation is available at the Swagger UI on the API root (`/`).
