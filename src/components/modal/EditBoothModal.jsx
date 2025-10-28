// EditBoothModal.jsx
import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBooth } from '../api/panchayatApi';
import Modal from './modal';

const EditBoothModal = ({ isOpen, onClose, booth }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    panchayat: '',
    ward: '',
    code: '',
    district: '',
    description: '',
  });
  const [formError, setFormError] = useState('');

  // Initialize form data when booth changes
  useEffect(() => {
    if (booth) {
      setFormData({
        name: booth.name || '',
        panchayat: booth.panchayat?._id || booth.panchayat || '',
        ward: booth.ward?._id || booth.ward || '',
        code: booth.code || '',
        district: booth.district || '',
        description: booth.description || '',
      });
    }
  }, [booth]);

  // Mutation for updating booth
  const mutation = useMutation({
    mutationFn: ({ id, boothData }) => updateBooth(id, boothData),
    onSuccess: () => {
      queryClient.invalidateQueries(['booths']);
      setFormError('');
      onClose();
    },
    onError: (error) => {
      console.error('Mutation Error:', error);
      setFormError(error.response?.data?.message || 'Error updating Booth');
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.code || !formData.district) {
      setFormError('Name, Code, and District are required');
      return;
    }
    
    const boothData = {
      name: formData.name,
      panchayat: formData.panchayat,
      ward: formData.ward,
      code: formData.code.toUpperCase(),
      district: formData.district,
      description: formData.description || undefined,
    };
    
    mutation.mutate({ id: booth._id, boothData });
  };

  const handleClose = () => {
    setFormData({ 
      name: '', 
      panchayat: '',
      ward: '',
      code: '', 
      district: '', 
      description: '' 
    });
    setFormError('');
    onClose();
  };

  if (!isOpen || !booth) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Booth" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-red-600 mb-1">Booth Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-lg border border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-red-700"
              placeholder="Enter booth name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-red-600 mb-1">Booth Code</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-lg border border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-red-700 uppercase"
              placeholder="Enter booth code"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-red-600 mb-1">District</label>
          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={handleInputChange}
            className="w-full px-3 py-2 rounded-lg border border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-red-700"
            placeholder="Enter district name"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-red-600 mb-1">
              Panchayat
              {booth.panchayat?.name && (
                <span className="text-xs text-red-500 ml-2">Current: {booth.panchayat.name}</span>
              )}
            </label>
            <input
              type="text"
              name="panchayat"
              value={formData.panchayat}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-lg border border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-red-700"
              placeholder="Panchayat ID"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-red-600 mb-1">
              Ward
              {booth.ward?.name && (
                <span className="text-xs text-red-500 ml-2">Current: {booth.ward.name}</span>
              )}
            </label>
            <input
              type="text"
              name="ward"
              value={formData.ward}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-lg border border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-red-700"
              placeholder="Ward ID"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-red-600 mb-1">Description (Optional)</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-3 py-2 rounded-lg border border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-red-700"
            placeholder="Enter booth description"
            rows="3"
          />
        </div>
        
        {formError && (
          <p className="text-red-600 text-sm font-medium">{formError}</p>
        )}
        
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutation.isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 disabled:bg-red-400"
          >
            {mutation.isLoading ? 'Updating...' : 'Update Booth'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditBoothModal;