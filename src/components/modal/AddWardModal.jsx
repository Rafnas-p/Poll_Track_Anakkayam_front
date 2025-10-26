import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createWard } from '../api/panchayatApi';
import Modal from './modal';

const AddWardModal = ({ isOpen, onClose, panchayatId }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    wardNumber: '',
    name: '',
    pollingBoothName: '',
    pollingBoothLatitude: '',
    pollingBoothLongitude: '',
  });
  const [formError, setFormError] = useState('');

  // Mutation for creating a new ward
  const mutation = useMutation({
    mutationFn: createWard,
    onSuccess: () => {
      console.log('Ward created successfully');
      queryClient.invalidateQueries(['wards', panchayatId]);
      setFormData({ 
        wardNumber: '', 
        name: '', 
        pollingBoothName: '', 
        pollingBoothLatitude: '', 
        pollingBoothLongitude: '' 
      });
      setFormError('');
      onClose();
    },
    onError: (error) => {
      console.error('Mutation Error:', error);
      setFormError(error.response?.data?.message || 'Error creating Ward');
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.wardNumber || !formData.name) {
      setFormError('Ward Number and Name are required');
      return;
    }
    
    if (isNaN(formData.wardNumber) || formData.wardNumber <= 0) {
      setFormError('Ward Number must be a positive number');
      return;
    }
    
    const wardData = {
      wardNumber: parseInt(formData.wardNumber),
      name: formData.name,
      panchayat: panchayatId,
      pollingBooth: {
        name: formData.pollingBoothName || undefined,
        location: {
          latitude: formData.pollingBoothLatitude ? parseFloat(formData.pollingBoothLatitude) : undefined,
          longitude: formData.pollingBoothLongitude ? parseFloat(formData.pollingBoothLongitude) : undefined,
        }
      }
    };
    
    console.log('Submitting ward:', wardData);
    mutation.mutate(wardData);
  };

  const handleClose = () => {
    setFormData({ 
      wardNumber: '', 
      name: '', 
      pollingBoothName: '', 
      pollingBoothLatitude: '', 
      pollingBoothLongitude: '' 
    });
    setFormError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Ward" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-red-600 mb-1">Ward Number</label>
            <input
              type="number"
              name="wardNumber"
              value={formData.wardNumber}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-lg border border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-red-700"
              placeholder="Enter ward number"
              min="1"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-red-600 mb-1">Ward Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-lg border border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-red-700"
              placeholder="Enter ward name"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-red-600 mb-1">Polling Booth Name (Optional)</label>
          <input
            type="text"
            name="pollingBoothName"
            value={formData.pollingBoothName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 rounded-lg border border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-red-700"
            placeholder="Enter polling booth name"
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-red-600 mb-1">Latitude (Optional)</label>
            <input
              type="number"
              step="any"
              name="pollingBoothLatitude"
              value={formData.pollingBoothLatitude}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-lg border border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-red-700"
              placeholder="Enter latitude"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-red-600 mb-1">Longitude (Optional)</label>
            <input
              type="number"
              step="any"
              name="pollingBoothLongitude"
              value={formData.pollingBoothLongitude}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-lg border border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-red-700"
              placeholder="Enter longitude"
            />
          </div>
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
            {mutation.isLoading ? 'Adding...' : 'Add Ward'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddWardModal;