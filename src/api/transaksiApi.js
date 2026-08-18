import axiosClient from './axiosClient';

export const getAllTransaksi = async () => {
  const response = await axiosClient.get('/transaksi/');
  return response.data;
};

export const getTransaksiByTagihan = async (idTagihan) => {
  const response = await axiosClient.get(`/transaksi/tagihan/${idTagihan}`);
  return response.data;
};

export const createTransaksi = async (idTagihan) => {
  const response = await axiosClient.post(`/transaksi/${idTagihan}`);
  return response.data;
};

export const regenerateTransaksi = async (idTagihan) => {
  const response = await axiosClient.post(`/transaksi/regenerate/${idTagihan}`);
  return response.data;
};