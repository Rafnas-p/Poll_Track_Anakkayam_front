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

export const updatePanchayat = async (id, payload) => {
  const response = await api.put(`/panchayats/update-panchayat/${id}`, payload);
  return response.data;
};

export const deletePanchayat = async (id) => {
  
  const response = await api.delete(`/panchayats/delete-panchayat/${id}`);
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
  
  const response = await api.post('/booths/create-Booth', boothData);
  return response.data;
};
// Add this function to your existing panchayatApi.jsx
export const getBoothById = async (boothId) => {
  
  const response = await api.get(`/booths/get-Booth-by-id/${boothId}`);
  
  return response.data;
};
export const updateBooth = async (id, boothData) => {
  const response = await api.put(`/booths/update-booth/${id}`, boothData);
  return response.data;
};

export const deleteBooth = async (id) => {
  
  const response = await api.delete(`/booths/delete-Booth/${id}`);
  return response.data;
};
// Ward API functions
export const updateWard = async (id, wardData) => {
  const response = await api.put(`/wards/update-ward/${id}`, wardData);
  return response.data;
};

export const deleteWard = async (id) => {
  
  const response = await api.delete(`/wards/delete-ward/${id}`);
  return response.data;
};