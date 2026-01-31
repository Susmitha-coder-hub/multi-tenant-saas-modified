CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  user_id UUID REFERENCES users(id),
  action VARCHAR NOT NULL,
  entity_type VARCHAR,
  entity_id VARCHAR,
  ip_address VARCHAR,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
