import axiosClient from './axiosClient';

export const getAllTagihan = async () => {
  const response = await axiosClient.get('/tagihan/');
  return response.data;
};

export const getTagihanById = async (id) => {
  const response = await axiosClient.get(`/tagihan/${id}`);
  return response.data;
};

export const createTagihan = async (data) => {
  const response = await axiosClient.post('/tagihan/', data);
  return response.data;
};