Docker Setup
1. Overview

The application is containerized using Docker to ensure consistent development, testing, and production environments.
We use Docker Compose to orchestrate multiple services including the backend API, PostgreSQL database, and optional frontend service.

2. Directory Structure
project-root/
├─ backend/
│  ├─ Dockerfile
├─ frontend/
│  ├─ Dockerfile
├─ docker-compose.yml
└─ docs/

3. Backend Dockerfile

File: backend/Dockerfile

# Use Node.js LTS version
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose backend port
EXPOSE 3000

# Start the backend server
CMD ["npm", "start"]

4. Frontend Dockerfile

File: frontend/Dockerfile

# Use Node.js LTS version
FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]

5. Docker Compose

File: docker-compose.yml

version: "3.9"

services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://postgres:password@db:5432/mydb
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend

  db:
    image: postgres:16
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydb
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:

6. Running the Application

Build and start all services:

docker-compose up --build


Backend API will be accessible at: http://localhost:3000

Frontend will be accessible at: http://localhost:5173

PostgreSQL database will be accessible at: localhost:5432

7. Notes

Use docker-compose down -v to stop and remove containers and volumes.

Ensure .env variables are properly configured in production.

Volumes are used for persistent database storage.

