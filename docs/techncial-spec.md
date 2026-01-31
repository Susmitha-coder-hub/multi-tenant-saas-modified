# Technical Specification

## 1. Project Structure

The project is customized as a monorepo setup containing both backend and frontend code, fully containerized.

```
multi-tenant-saas/
├── backend/                # Node.js/Express Backend
│   ├── migrations/         # Database migration scripts
│   ├── seeds/              # Seed data for initial setup
│   ├── src/
│   │   ├── config/         # DB and App configuration
│   │   ├── controllers/    # Route logic
│   │   ├── middlewares/    # Auth and validation middleware
│   │   ├── models/         # Sequelize Core Models
│   │   ├── routes/         # Express Routes
│   │   ├── utils/          # Helper functions (JWT, Pwd)
│   │   ├── app.js          # App entry point
│   │   └── server.js       # Server startup
│   ├── Dockerfile          # Backend Docker configuration
│   └── package.json        # Backend dependencies
│
├── frontend/               # React Frontend
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── api/            # API wrapper functions
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React Context (Auth)
│   │   ├── pages/          # Application Pages
│   │   ├── routes/         # Router configuration
│   │   └── App.js          # App root
│   ├── Dockerfile          # Frontend Docker configuration
│   └── package.json        # Frontend dependencies
│
├── docs/                   # Documentation Artifacts
│   ├── images/             # Architecture/ERD Images
│   └── *.md                # PRD, Research, API, etc.
│
├── .gitignore              # Git ignore rules
├── docker-compose.yml      # Docker Orchestration
├── README.md               # Project Entry Point
└── submission.json         # Evaluation Credentials
```

## 2. Development Setup Guide

### 2.1 Prerequisites
- **Git**: For version control.
- **Docker Desktop**: Must be installed and running.
- **Node.js**: (Optional) If running locally without Docker.

### 2.2 Docker Setup (Recommended)

The application is designed to be run primarily via Docker Compose to ensure environment consistency.

1.  **Build and Run**:
    ```bash
    docker-compose up -d --build
    ```
    This command will:
    - Build `backend` and `frontend` images.
    - Start `postgres` database container.
    - Create a shared network `multi-tenant-saas_default`.
    - Mount volume `db_data` for persistence.
    - Expose ports: `3000` (Frontend), `5000` (Backend), `5432` (DB).

2.  **Verify Services**:
    ```bash
    docker-compose ps
    ```
    All three services (`database`, `backend`, `frontend`) should be `Up`.

3.  **Logs**:
    To allow for debugging, you can stream logs:
    ```bash
    docker-compose logs -f
    ```

### 2.3 Environment Variables

Environment variables are managed within `docker-compose.yml` for simplicity in this submission.

**Backend Variables:**
- `PORT`: 5000
- `DB_HOST`: database
- `DB_USER`: postgres
- `DB_PASSWORD`: postgres
- `DB_NAME`: saas_db
- `JWT_SECRET`: [SecureSecret]
- `JWT_EXPIRES_IN`: 1d
- `FRONTEND_URL`: http://localhost:3000

**Frontend Variables:**
- `REACT_APP_API_URL`: http://localhost:5000/api

## 3. Database Management

### 3.1 Initialization
The database initialization is **fully automated**.
- **Migrations**: Automatically sync using Sequelize `sync()` on server start.
- **Seeding**: A check is performed on startup. If the Super Admin does not exist, the system automatically executes `seeds/seed_data.sql`.

### 3.2 Accessing Database
You can access the running database container:
```bash
docker-compose exec database psql -U postgres -d saas_db
```

## 4. Testing
- **API Testing**: Use Postman or curl to hit `http://localhost:5000/api`.
- **Browser**: Open `http://localhost:3000`.