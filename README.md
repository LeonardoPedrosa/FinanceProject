Finance App
Personal finance management system with shared categories, spending limits, and visual alerts.

🛠️ Tech Stack
Frontend: React + TypeScript + Vite

Backend: .NET 8 Web API

Database: PostgreSQL 16

Containerization: Docker + Docker Compose

📋 Features

✅ Create categories with icons, colors, and spending limits

✅ Add expenses to categories

✅ Visual alerts when spending exceeds limit

✅ Share categories with other users

✅ JWT authentication

🚀 Quick Start
Prerequisites
Docker and Docker Compose installed

.NET 8 SDK (optional, for local development)

🎯 API Endpoints
POST /api/auth/register - Register user

POST /api/auth/login - Login

GET /api/categories - List categories

POST /api/categories - Create category

POST /api/categories/{id}/expenses - Add expense

POST /api/categories/{id}/share - Share category

GET /api/categories/{id}/status - Category status
