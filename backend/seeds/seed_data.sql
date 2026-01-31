-- =========================
-- 1. Super Admin (no tenant)
-- =========================
INSERT INTO users (
  id, tenant_id, email, password_hash, full_name, role, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  NULL,
  'superadmin@system.com',
  '$2b$10$wH8j8vYqgRZx8kQX7nX8FeF9YJpD1eJ8X9JHnQePZz5rY7QpE6WZK',
  'Super Admin',
  'super_admin',
  TRUE,
  NOW(),
  NOW()
);

-- =========================
-- 2. Demo Tenant
-- =========================
INSERT INTO tenants (
  id, name, subdomain, status, subscription_plan, max_users, max_projects, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Demo Company',
  'demo',
  'active',
  'pro',
  10,
  20,
  NOW(),
  NOW()
);

-- =========================
-- 3. Tenant Admin
-- =========================
INSERT INTO users (
  id, tenant_id, email, password_hash, full_name, role, is_active, created_at, updated_at
)
SELECT
  gen_random_uuid(),
  t.id,
  'admin@demo.com',
  '$2b$10$wH8j8vYqgRZx8kQX7nX8FeF9YJpD1eJ8X9JHnQePZz5rY7QpE6WZK',
  'Demo Admin',
  'tenant_admin',
  TRUE,
  NOW(),
  NOW()
FROM tenants t
WHERE t.subdomain = 'demo';

-- =========================
-- 4. Regular Users
-- =========================
INSERT INTO users (
  id, tenant_id, email, password_hash, full_name, role, is_active, created_at, updated_at
)
SELECT
  gen_random_uuid(),
  t.id,
  'user1@demo.com',
  '$2b$10$wH8j8vYqgRZx8kQX7nX8FeF9YJpD1eJ8X9JHnQePZz5rY7QpE6WZK',
  'Demo User 1',
  'user',
  TRUE,
  NOW(),
  NOW()
FROM tenants t
WHERE t.subdomain = 'demo';

-- =========================
-- 5. Sample Project
-- =========================
INSERT INTO projects (
  id, tenant_id, name, description, status, created_at, updated_at
)
SELECT
  gen_random_uuid(),
  t.id,
  'Demo Project',
  'Initial demo project',
  'active',
  NOW(),
  NOW()
FROM tenants t
WHERE t.subdomain = 'demo';

-- =========================
-- 6. Sample Task
-- =========================
INSERT INTO tasks (
  id, project_id, tenant_id, title, description, status, priority, created_at, updated_at
)
SELECT
  gen_random_uuid(),
  p.id,
  p.tenant_id,
  'Demo Task',
  'This is a demo task',
  'todo',
  'medium',
  NOW(),
  NOW()
FROM projects p
LIMIT 1;
