import api from './axiose';

export const createVoter = async (voterData) => {
  const response = await api.post('/voters/create-voter', voterData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getVotersByBooth = async (boothId) => {
  const response = await api.get(`/voters/get-voters-by-booth/${boothId}`);
  return response.data;
};

export const getAllVoters = async () => {
  const response = await api.get('/voters/get-all-voters');
  return response.data;
};

export const getVoterById = async (id) => {
  const response = await api.get(`/voters/get-voter-by-id/${id}`);
  return response.data;
};

export const updateVoter = async (id, voterData) => {
  const response = await api.put(`/voters/update-voter/${id}`, voterData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteVoter = async (id) => {
  const response = await api.delete(`/voters/delete-voter/${id}`);
  return response.data;
};