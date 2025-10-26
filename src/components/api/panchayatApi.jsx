// panchayatAPI.js
import api from './axiose'; // your axios instance

export const createPanchayat = async (panchayatData) => {
  const response = await api.post('/panchayats/create-panchayat', panchayatData);
  return response.data;
};

export const getAllPanchayats = async () => {
  const response = await api.get('/panchayats/get-all-panchayats');
  return response.data;
};

export const getPanchayatById = async (id) => {
  const response = await api.get(`/panchayats/get-panchayat/${id}`);
  return response.data;
};

export const createWard = async (wardData) => {
  const response = await api.post('/wards/create-ward', wardData);
  return response.data;
};

export const getWardsByPanchayat = async (panchayatId) => {
  const response = await api.get(`/wards/get-wards-by-panchayat/${panchayatId}`);
  return response.data;
};

// Add these new functions
export const getBoothsByWard = async (wardId) => {
  const response = await api.get(`/wards/get-booths-by-ward/${wardId}`);
  return response.data;
};

export const createBooth = async (boothData) => {
  console.log(boothData,'boothData');
  
  const response = await api.post('/booths/create-Booth', boothData);
  return response.data;
};
// Add this function to your existing panchayatApi.jsx
export const getBoothById = async (boothId) => {
  console.log(boothId,'boothIdboothIdboothIdboothId');
  
  const response = await api.get(`/booths/get-Booth-by-id/${boothId}`);
  console.log(response,'response');
  
  return response.data;
};