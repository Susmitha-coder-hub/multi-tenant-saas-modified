Database Schema
1. Overview

The system uses PostgreSQL with a shared schema, multi-tenant approach.
Each tenant's data is distinguished by a tenant_id column in all relevant tables. The schema supports projects, tasks, users, roles, and audit logging.

2. Tables

2.1 Users
Column	Type	Constraints
id	UUID	PK, default gen_random_uuid()
name	VARCHAR	NOT NULL
email	VARCHAR	NOT NULL, UNIQUE
password	VARCHAR	NOT NULL
role	VARCHAR	NOT NULL, CHECK(role IN ('user','admin','recruiter'))
tenant_id	UUID	NOT NULL, FK → tenants(id)
created_at	TIMESTAMP	DEFAULT now()
updated_at	TIMESTAMP	DEFAULT now()
2.2 Tenants
Column	Type	Constraints
id	UUID	PK, default gen_random_uuid()
name	VARCHAR	NOT NULL
created_at	TIMESTAMP	DEFAULT now()
updated_at	TIMESTAMP	DEFAULT now()
2.3 Projects
Column	Type	Constraints
id	UUID	PK, default gen_random_uuid()
name	VARCHAR	NOT NULL
description	TEXT	
tenant_id	UUID	NOT NULL, FK → tenants(id)
created_at	TIMESTAMP	DEFAULT now()
updated_at	TIMESTAMP	DEFAULT now()
2.4 Tasks
Column	Type	Constraints
id	UUID	PK, default gen_random_uuid()
title	VARCHAR	NOT NULL
description	TEXT	
project_id	UUID	NOT NULL, FK → projects(id)
assigned_to	UUID	FK → users(id)
status	VARCHAR	CHECK(status IN ('pending','in_progress','completed'))
due_date	DATE	
tenant_id	UUID	NOT NULL, FK → tenants(id)
created_at	TIMESTAMP	DEFAULT now()
updated_at	TIMESTAMP	DEFAULT now()
2.5 Audit Logs
Column	Type	Constraints
id	UUID	PK, default gen_random_uuid()
user_id	UUID	FK → users(id)
tenant_id	UUID	NOT NULL, FK → tenants(id)
action	TEXT	NOT NULL
created_at	TIMESTAMP	DEFAULT now()
3. Relationships

Tenant → Users: 1:N

Tenant → Projects: 1:N

Project → Tasks: 1:N

Tenant → Tasks: 1:N (via tenant_id)

User → Tasks: 1:N (assigned_to)

Tenant → Audit Logs: 1:N