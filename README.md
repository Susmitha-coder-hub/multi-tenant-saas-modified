# Multi-Tenant SaaS Platform

## Project Overview
A dockerized multi-tenant SaaS application built with Node.js, Express, PostgreSQL, and React. This project demonstrates strict data isolation, role-based access control, and scalable architecture pattern.

### 🎥 Demo Video
[Link to YouTube Demo Video](https://youtube.com/...) **(Start Here)**

---

## 🚀 Quick Start (Docker)

The entire application (DB, Backend, Frontend) is containerized and orchestrates with Docker Compose.

### Prerequisites
- Docker & Docker Compose installed.

### Steps to Run
1. **Clone the repository**:
   ```bash
   git clone https://github.com/Susmitha-coder-hub/multi-tenant-saas-modified.git
   cd multi-tenant-saas-modified
   ```

2. **Start the application**:
   ```bash
   docker-compose up -d --build
   ```
   *This command builds the images, starts the database, backend (port 5000), and frontend (port 3000), and automatically runs migrations and seeds.*

3. **Verify Status**:
   ```bash
   docker-compose ps
   ```
   *Ensure `database`, `backend`, and `frontend` services are 'Up' (healthy).*

4. **Access the Application**:
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## 🧪 Testing Credentials (Seed Data)

The system automatically initializes with the following data:

### Super Admin (System Level)
- **Email**: `superadmin@system.com`
- **Password**: `Demo@123`

### Tenant 1: Demo Company
- **Subdomain**: `demo`
- **Tenant Admin**:
  - **Email**: `admin@demo.com`
  - **Password**: `Demo@123`
- **Regular User**:
  - **Email**: `user1@demo.com`
  - **Password**: `Demo@123`

---

## 📚 Documentation

Detailed documentation is available in the `docs/` folder:

- **[Research & Analysis](docs/research.md)**: Multi-tenancy approach justification and tech stack analysis.
- **[Product Requirements (PRD)](docs/prd.md)**: Functional/Non-functional requirements and user personas.
- **[Architecture](docs/architecture.md)**: System design and Database ERD.
- **[Technical Spec](docs/techncial-spec.md)**: Project structure and Docker setup.
- **[API Documentation](docs/API.md)**: Complete list of all 19 API endpoints.

---

## 🏗 Architecture
- **Tech Stack**: React, Node.js (Express), PostgreSQL, Docker.
- **Pattern**: Shared Database, Shared Schema (`tenant_id` isolation).
- **Security**: JWT Auth, RBAC, Bcrypt, Audit Logging.

---

## ✅ Submission Checklist
- [x] Public GitHub Repository.
- [x] Dockerized (docker-compose up -d).
- [x] Fixed Port Mappings (5432, 5000, 3000).
- [x] Automatic DB Migrations & Seeding.
- [x] `submission.json` included.
- [x] Documentation Artifacts complete.

