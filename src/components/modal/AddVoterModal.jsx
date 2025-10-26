import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createVoter } from '../api/voterApi';

const AddVoterModal = ({ isOpen, onClose, boothId, boothData }) => {
  const [formData, setFormData] = useState({
    voterId: '',
    name: '',
    age: '',
    gender: 'male',
    guardian: { name: '', relation: 'father' },
    address: { houseNumber: '', houseName: '' },
    politicalAffiliation: 'unknown',
    party: '',
    serialNumber: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const queryClient = useQueryClient();
console.log(boothData,'boothData');

  const createVoterMutation = useMutation({
    mutationFn: createVoter,
    onSuccess: () => {
      queryClient.invalidateQueries(['voters', boothId]);
      onClose();
      resetForm();
    },
    onError: (error) => {
      console.error('Error creating voter:', error);
    }
  });

  const resetForm = () => {
    setFormData({
      voterId: '',
      name: '',
      age: '',
      gender: 'male',
      guardian: { name: '', relation: 'father' },
      address: { houseNumber: '', houseName: '' },
      politicalAffiliation: 'unknown',
      party: '',
      serialNumber: ''
    });
    setSelectedImage(null);
    setImagePreview(null);
    setErrors({});
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        setErrors({ image: 'Image size must be less than 2MB' });
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        setErrors({ image: 'Please select a valid image file' });
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors = {};
    if (!formData.voterId.trim()) newErrors.voterId = 'Voter ID is required';
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.age || formData.age < 18) newErrors.age = 'Age must be 18 or above';
    if (!formData.guardian.name.trim()) newErrors.guardianName = 'Guardian name is required';
    if (!formData.address.houseNumber.trim()) newErrors.houseNumber = 'House number is required';
    if (!formData.address.houseName.trim()) newErrors.houseName = 'House name is required';
    if (!formData.serialNumber) newErrors.serialNumber = 'Serial number is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Create FormData for file upload
    const submitData = new FormData();
    submitData.append('voterId', formData.voterId);
    submitData.append('name', formData.name);
    submitData.append('age', formData.age);
    submitData.append('gender', formData.gender);
    submitData.append('guardian', JSON.stringify(formData.guardian));
    submitData.append('address', JSON.stringify(formData.address));
    submitData.append('politicalAffiliation', formData.politicalAffiliation);
    submitData.append('party', formData.party);
    submitData.append('serialNumber', formData.serialNumber);
    submitData.append('booth', boothId);
    
    // Add ward and panchayat information
    if (boothData?.ward) {
      submitData.append('ward', boothData.ward._id);
    }
    if (boothData?.panchayat) {
      submitData.append('panchayat', boothData.panchayat._id);
    }
    
    if (selectedImage) {
      submitData.append('photo', selectedImage);
    }

    console.log('Submitting voter data:', {
      boothId,
      ward: boothData?.ward,
      panchayat: boothData?.panchayat,
      boothData
    });

    createVoterMutation.mutate(submitData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-red-700">Add New Voter</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Booth Information Display */}
          {boothData && (
            <div className="mb-4 p-3 bg-red-50 rounded-lg">
              <p className="text-sm text-red-600">
                <strong>Booth:</strong> {boothData.name} ({boothData.code})
              </p>
              <p className="text-sm text-red-600">
                <strong>Ward:</strong> {boothData.ward?.wardNumber} - {boothData.ward?.name}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Rest of your form remains the same */}
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Voter ID *
                </label>
                <input
                  type="text"
                  name="voterId"
                  value={formData.voterId}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.voterId ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter voter ID"
                />
                {errors.voterId && <p className="text-red-500 text-xs mt-1">{errors.voterId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Serial Number *
                </label>
                <input
                  type="number"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.serialNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter serial number"
                />
                {errors.serialNumber && <p className="text-red-500 text-xs mt-1">{errors.serialNumber}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter full name"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age *
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.age ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter age"
                />
                {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Political Affiliation
                </label>
                <select
                  name="politicalAffiliation"
                  value={formData.politicalAffiliation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="unknown">Unknown</option>
                  <option value="supporter">Supporter</option>
                  <option value="neutral">Neutral</option>
                  <option value="opposition">Opposition</option>
                </select>
              </div>
            </div>

            {/* Guardian Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guardian Name *
                </label>
                <input
                  type="text"
                  name="guardian.name"
                  value={formData.guardian.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.guardianName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter guardian name"
                />
                {errors.guardianName && <p className="text-red-500 text-xs mt-1">{errors.guardianName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Relation
                </label>
                <select
                  name="guardian.relation"
                  value={formData.guardian.relation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="father">Father</option>
                  <option value="mother">Mother</option>
                  <option value="husband">Husband</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Address Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  House Number *
                </label>
                <input
                  type="text"
                  name="address.houseNumber"
                  value={formData.address.houseNumber}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.houseNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter house number"
                />
                {errors.houseNumber && <p className="text-red-500 text-xs mt-1">{errors.houseNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  House Name *
                </label>
                <input
                  type="text"
                  name="address.houseName"
                  value={formData.address.houseName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.houseName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter house name"
                />
                {errors.houseName && <p className="text-red-500 text-xs mt-1">{errors.houseName}</p>}
              </div>
            </div>

            {/* Party Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Party
              </label>
              <input
                type="text"
                name="party"
                value={formData.party}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter party name (optional)"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Photo (Max 2MB)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                {imagePreview && (
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-16 h-16 rounded-full object-cover border-2 border-red-200"
                  />
                )}
              </div>
              {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
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
                disabled={createVoterMutation.isPending}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 disabled:opacity-50"
              >
                {createVoterMutation.isPending ? 'Creating...' : 'Create Voter'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddVoterModal;