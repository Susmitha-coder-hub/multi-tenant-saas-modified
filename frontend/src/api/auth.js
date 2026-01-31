import client from './client';

export const login = (data) => client.post('/auth/login', data);
export const registerTenant = (data) => client.post('/auth/register-tenant', data);
export const getMe = () => client.get('/auth/me');
export const logout = () => client.post('/auth/logout');
