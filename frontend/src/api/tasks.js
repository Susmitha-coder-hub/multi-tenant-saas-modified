import client from './client';

export const updateTaskStatus = (id, status) => client.patch(`/tasks/${id}/status`, { status });
export const updateTask = (id, data) => client.put(`/tasks/${id}`, data);
export const deleteTask = (id) => client.delete(`/tasks/${id}`);
