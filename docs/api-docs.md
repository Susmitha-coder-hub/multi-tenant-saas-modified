API Documentation
1. Overview

This document provides complete API references for the multi-tenant project management system.
It includes endpoints, request/response formats, authentication requirements, and validation rules.

Base URL: https://api.yourdomain.com

Authentication:
All endpoints (except /auth/register and /auth/login) require a JWT token in the Authorization header:

Authorization: Bearer <JWT_TOKEN>

2. Authentication
2.1 Register User

POST /api/auth/register

Request Body:

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user|admin|recruiter"
}


Response:

{
  "message": "User registered successfully",
  "userId": "uuid"
}

2.2 Login User

POST /api/auth/login

Request Body:

{
  "email": "john@example.com",
  "password": "password123"
}


Response:

{
  "token": "JWT_TOKEN",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "role": "user",
    "tenantId": "uuid"
  }
}

3. Projects
3.1 Create Project

POST /api/projects

Request Body:

{
  "name": "New Project",
  "description": "Project description"
}


Response:

{
  "message": "Project created successfully",
  "projectId": "uuid"
}

3.2 Get Projects

GET /api/projects

Response:

[
  {
    "id": "uuid",
    "name": "New Project",
    "description": "Project description",
    "createdAt": "timestamp"
  }
]

3.3 Update Project

PATCH /api/projects/:projectId

Request Body:

{
  "name": "Updated Project Name",
  "description": "Updated description"
}


Response:

{
  "message": "Project updated successfully"
}

3.4 Delete Project

DELETE /api/projects/:projectId

Response:

{
  "message": "Project deleted successfully"
}

4. Tasks
4.1 Create Task

POST /api/tasks

Request Body:

{
  "title": "Design UI",
  "description": "Design dashboard",
  "projectId": "uuid",
  "assignedTo": "userId",
  "dueDate": "YYYY-MM-DD"
}


Response:

{
  "message": "Task created successfully",
  "taskId": "uuid"
}

4.2 Update Task

PATCH /api/tasks/:taskId

Request Body:

{
  "title": "Updated Task Title",
  "description": "Updated description",
  "status": "pending|in_progress|completed",
  "assignedTo": "userId",
  "dueDate": "YYYY-MM-DD"
}


Response:

{
  "message": "Task updated successfully"
}

4.3 Delete Task

DELETE /api/tasks/:taskId

Response:

{
  "message": "Task deleted successfully"
}

4.4 Get Tasks

GET /api/tasks?projectId=uuid

Response:

[
  {
    "id": "uuid",
    "title": "Design UI",
    "description": "Design dashboard",
    "status": "pending",
    "assignedTo": "userId",
    "dueDate": "YYYY-MM-DD",
    "createdAt": "timestamp"
  }
]

5. Users
5.1 Get Users

GET /api/users

Response:

[
  {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "tenantId": "uuid"
  }
]

5.2 Update User Role

PATCH /api/users/:userId/role

Request Body:

{
  "role": "admin|user|recruiter"
}


Response:

{
  "message": "User role updated successfully"
}

6. Common Response & Error Codes

Success Response:

{
  "message": "Operation successful",
  "data": {...}
}


Error Response:

{
  "error": "Description of the error",
  "statusCode": 400
}


Status Codes:

200: Success

201: Created

400: Bad Request / Validation Error

401: Unauthorized

403: Forbidden

404: Not Found

500: Internal Server Error