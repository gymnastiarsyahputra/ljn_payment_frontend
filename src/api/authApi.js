import axiosClient from './axiosClient';

export const login = async (email, password) => {
  const response = await axiosClient.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (email, password, nama) => {
  const response = await axiosClient.post('/auth/register', { email, password, nama });
  return response.data;
};