import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBooth } from '../api/panchayatApi';

const AddBoothModal = ({ isOpen, onClose, ward, panchayatId }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    district: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const queryClient = useQueryClient();

  const createBoothMutation = useMutation({
    mutationFn: createBooth,
    onSuccess: () => {
      queryClient.invalidateQueries(['booths', ward?._id]);
      queryClient.invalidateQueries(['wards', panchayatId]);
      onClose();
      setFormData({ name: '', code: '', district: '', description: '' });
      setErrors({});
    },
    onError: (error) => {
      console.error('Error creating booth:', error);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Booth name is required';
    if (!formData.code.trim()) newErrors.code = 'Booth code is required';
    if (!formData.district.trim()) newErrors.district = 'District is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    createBoothMutation.mutate({
      ...formData,
      panchayat: panchayatId,
      ward: ward?.id
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-red-700">Add New Booth</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="mb-4 p-3 bg-red-50 rounded-lg">
            <p className="text-sm text-red-600">
              <strong>Ward:</strong> {ward?.wardNumber} - {ward?.name}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Booth Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter booth name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Booth Number *
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.code ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter booth code"
              />
              {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                District *
              </label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.district ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter district"
              />
              {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter description (optional)"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createBoothMutation.isPending}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 disabled:opacity-50"
              >
                {createBoothMutation.isPending ? 'Creating...' : 'Create Booth'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBoothModal;