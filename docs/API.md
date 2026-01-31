# API Documentation

## Authentication
### Register Tenant
- **Endpoint**: `POST /api/auth/register-tenant`
- **Body**: `{ tenantName, subdomain, adminEmail, adminPassword, adminFullName }`
- **Response**: `{ success: true, data: { tenantId, adminUser } }`

### Login
- **Endpoint**: `POST /api/auth/login`
- **Body**: `{ email, password, tenantSubdomain (or tenantId) }`
- **Response**: `{ success: true, data: { user, token } }`

### Get Current User
- **Endpoint**: `GET /api/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ success: true, data: { user, tenant } }`

---

## Tenants
### List Tenants (Super Admin)
- **Endpoint**: `GET /api/tenants`
- **Response**: `{ success: true, data: { tenants: [] } }`

### Get Tenant
- **Endpoint**: `GET /api/tenants/:tenantId`
- **Response**: `{ success: true, data: { ...tenant, stats } }`

### Update Tenant
- **Endpoint**: `PUT /api/tenants/:tenantId`
- **Body**: `{ name }`
- **Auth**: Tenant Admin

### Add User
- **Endpoint**: `POST /api/tenants/:tenantId/users`
- **Body**: `{ email, fullName, password, role }`

### List Users
- **Endpoint**: `GET /api/tenants/:tenantId/users`

---

## Projects
### Create Project
- **Endpoint**: `POST /api/projects`
- **Body**: `{ name, description, status }`

### List Projects
- **Endpoint**: `GET /api/projects`

### Get Project
- **Endpoint**: `GET /api/projects/:projectId`

### Update Project
- **Endpoint**: `PUT /api/projects/:projectId`

### Delete Project
- **Endpoint**: `DELETE /api/projects/:projectId`

---

## Tasks
### Create Task
- **Endpoint**: `POST /api/projects/:projectId/tasks`
- **Body**: `{ title, priority, ... }`

### List Tasks
- **Endpoint**: `GET /api/projects/:projectId/tasks`

### Update Task
- **Endpoint**: `PUT /api/tasks/:taskId`

### Update Status
- **Endpoint**: `PATCH /api/tasks/:taskId/status`
- **Body**: `{ status }`

### Delete Task
- **Endpoint**: `DELETE /api/tasks/:taskId`
