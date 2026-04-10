import api from './api';

const BASE_URL = '/users';

export const getAllUsers = async (params = {}) => {
  const response = await api.get(BASE_URL, { params });
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`${BASE_URL}/${id}`);
  return response.data;
};

export const createUser = async (userData) => {
  const response = await api.post(BASE_URL, userData);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await api.put(`${BASE_URL}/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`${BASE_URL}/${id}`);
  return response.data;
};

export const updateUserRole = async (id, rolePayload) => {
  const response = await api.patch(`${BASE_URL}/${id}/role`, rolePayload);
  return response.data;
};
