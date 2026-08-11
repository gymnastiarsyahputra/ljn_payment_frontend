import axiosClient from './axiosClient';

export const getAllPaket = async () => {
  const response = await axiosClient.get('/paket/');
  return response.data;
};

export const getPaketById = async (id) => {
  const response = await axiosClient.get(`/paket/${id}`);
  return response.data;
};

export const createPaket = async (data) => {
  const response = await axiosClient.post('/paket/', data);
  return response.data;
};