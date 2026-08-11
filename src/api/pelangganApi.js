import axiosClient from './axiosClient';

export const getAllPelanggan = async () => {
  const response = await axiosClient.get('/pelanggan/');
  return response.data;
};

export const getPelangganById = async (id) => {
  const response = await axiosClient.get(`/pelanggan/${id}`);
  return response.data;
};

export const createPelanggan = async (data) => {
  const response = await axiosClient.post('/pelanggan/', data);
  return response.data;
};

export const updatePelanggan = async (id, data) => {
  const response = await axiosClient.put(`/pelanggan/${id}`, data);
  return response.data;
};