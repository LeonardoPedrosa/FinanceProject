# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal finance management system with shared categories, spending limits, and visual budget alerts. Full-stack app deployed on Railway.

## Commands

### Docker (full stack)
```bash
docker-compose up --build      # Build and start all services
docker-compose up              # Start existing containers
docker-compose down            # Stop services
```

### Backend (.NET 8)
```bash
cd BackEnd/FinanceApp.Api
dotnet restore
dotnet build
dotnet run                     # Starts on http://localhost:8080 (or ASPNETCORE_URLS override)
dotnet ef migrations add <Name>  # Add EF Core migration
dotnet ef database update        # Apply migrations manually
```

### Frontend (React + Vite)
```bash
cd FrontEnd
npm install
npm run dev        # Dev server on http://localhost:3000
npm run build      # Production build to /dist
npm run type-check # TypeScript check (tsc --noEmit)
```

There are no automated test suites in this repository.

## Architecture

Three-tier architecture: React SPA → .NET 8 Web API → PostgreSQL 16.

**Request flow:**
1. Frontend (`src/api/`) makes Axios requests with JWT Bearer token
2. `AuthContext` (`src/context/`) manages token storage and expiry
3. Backend controllers extract `userId` from JWT claims
4. Services (`Services/`) enforce authorization via `UserHasAccessAsync()` before any data operation
5. Repositories (`Data/Repositories/`) handle all DB access through EF Core
6. Database migrations run automatically on startup with retry logic (10 attempts, 3s delay)

**Key patterns:**
- Repository pattern with interfaces (`Data/Interfaces/`) injected into services
- DTO separation: request/response models in `DTOs/` are distinct from EF entity models in `Models/`
- Authorization is claims-based and enforced at the service layer, not just the controller
- Categories can be owned or shared; `CategoryShare` records grant per-user access with optional `CanEdit` flag

**Data model relationships:**
- `User` → owns many `Category` records
- `Category` → has many `Expense`, `CategoryShare`, and `CategoryMonthConfig` records
- `CategoryMonthConfig` stores per-month spending limits (unique on `CategoryId + Year + Month`)
- `CategoryShare` grants another user access to a category (unique on `CategoryId + SharedWithUserId`)

## Configuration

**Backend** (`BackEnd/FinanceApp.Api/appsettings.json`):
- Listens on `http://0.0.0.0:8080` (hardcoded for Railway; override with `ASPNETCORE_URLS`)
- Uses `DATABASE_URL` environment variable (Railway format: `postgres://user:pass@host:port/db`)
- JWT: `ValidateIssuer` and `ValidateAudience` are both `false`
- CORS: `AllowAnyOrigin()` — permissive by design for Railway deployment

**Frontend** (`FrontEnd/vite.config.ts`):
- `VITE_API_URL` env var sets the backend API base URL
- Defaults to the Railway production URL if not set

## Services

| Service | Port | Notes |
|---|---|---|
| Frontend | 3000 | Nginx in production, Vite dev server locally |
| Backend API + Swagger | 5000 (Docker) / 8080 (local) | Swagger UI at root `/` |
| PostgreSQL | 5432 | DB: `financeapp`, user: `financeuser` |
