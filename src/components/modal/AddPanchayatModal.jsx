import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Modal from './modal';
import { createPanchayat } from '../../components/api/panchayatApi';

const AddPanchayatModal = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    totalWards: '',
    address: '',
  });
  const [formError, setFormError] = useState('');

  // Mutation for creating a new panchayat
  const mutation = useMutation({
    mutationFn: createPanchayat,
    onSuccess: () => {
      queryClient.invalidateQueries(['panchayats']);
      setFormData({ name: '', code: '', totalWards: '', address: '' });
      setFormError('');
      onClose();
    },
    onError: (error) => {
      console.error('Mutation Error:', error);
      setFormError(error.response?.data?.message || 'Error creating Panchayat');
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.code || !formData.totalWards || !formData.address) {
      setFormError('All fields are required');
      return;
    }
    if (isNaN(formData.totalWards) || formData.totalWards <= 0) {
      setFormError('Total Wards must be a positive number');
      return;
    }
    mutation.mutate(formData);
  };

  const handleClose = () => {
    setFormData({ name: '', code: '', totalWards: '', address: '' });
    setFormError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Panchayat" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-red-600 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-lg border border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-red-700"
              placeholder="Enter Panchayat name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-red-600 mb-1">Code</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-lg border border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-red-700"
              placeholder="Enter Panchayat code"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-red-600 mb-1">Total Wards</label>
            <input
              type="number"
              name="totalWards"
              value={formData.totalWards}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-lg border border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-red-700"
              placeholder="Enter total wards"
              min="1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-red-600 mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-lg border border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-red-700"
              placeholder="Enter address"
              required
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
            {mutation.isLoading ? 'Adding...' : 'Add Panchayat'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddPanchayatModal;