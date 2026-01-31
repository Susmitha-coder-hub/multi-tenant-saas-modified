import client from './client';

export const getTenant = (tenantId) => client.get(`/tenants/${tenantId}`);
export const updateTenant = (tenantId, data) => client.put(`/tenants/${tenantId}`, data);
export const listTenants = (params) => client.get('/tenants', { params });
export const addUser = (tenantId, data) => client.post(`/tenants/${tenantId}/users`, data);
export const listUsers = (tenantId, params) => client.get(`/tenants/${tenantId}/users`, { params });
