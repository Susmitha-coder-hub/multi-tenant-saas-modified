Technical Specification
1. Overview

This document describes the API endpoints, request and response structures, and validation rules for the multi-tenant project management system. It serves as a guide for frontend-backend integration and ensures consistent implementation across clients.

2. Authentication Endpoints
2.1 Register User

Endpoint: POST /api/auth/register

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


Validation:

email must be valid and unique

password must be ≥ 8 characters

role must be one of the allowed roles

2.2 Login User

Endpoint: POST /api/auth/login

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


Validation:

Email and password must match existing user

3. Project Management Endpoints
3.1 Create Project

Endpoint: POST /api/projects

Request Body:

{
  "name": "New Project",
  "description": "Project description",
  "tenantId": "uuid"
}


Response:

{
  "message": "Project created successfully",
  "projectId": "uuid"
}


Validation:

name required, max length 100

tenantId must match authenticated user’s tenant

3.2 Get Projects

Endpoint: GET /api/projects

Response:

[
  {
    "id": "uuid",
    "name": "New Project",
    "description": "Project description",
    "createdAt": "timestamp"
  }
]


Notes: Returns only projects belonging to the authenticated tenant.

4. Task Management Endpoints
4.1 Create Task

Endpoint: POST /api/tasks

Request Body:

{
  "title": "Design UI",
  "description": "Design the main dashboard",
  "projectId": "uuid",
  "assignedTo": "userId",
  "dueDate": "YYYY-MM-DD"
}


Response:

{
  "message": "Task created successfully",
  "taskId": "uuid"
}


Validation:

title required, max length 100

projectId must exist and belong to the tenant

assignedTo must be a valid user in the same tenant

4.2 Update Task Status

Endpoint: PATCH /api/tasks/:taskId/status

Request Body:

{
  "status": "pending|in_progress|completed"
}


Response:

{
  "message": "Task status updated"
}

5. User & Role Management Endpoints
5.1 Get Users

Endpoint: GET /api/users

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


Notes: Returns users only for the authenticated tenant.

5.2 Update User Role

Endpoint: PATCH /api/users/:userId/role

Request Body:

{
  "role": "admin|user|recruiter"
}


Response:

{
  "message": "User role updated successfully"
}


Validation: Only admins can update roles.

6. Common Response & Error Format

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


Notes:

401 for unauthorized requests

403 for forbidden operations

404 for not found resources

500 for internal server errors