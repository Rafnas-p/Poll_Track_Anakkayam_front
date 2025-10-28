// DeleteBoothModal.jsx
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteBooth } from '../api/panchayatApi';

const DeleteBoothModal = ({ isOpen, onClose, booth }) => {
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: (id) => deleteBooth(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['booths'] });
      onClose();
    },
    onError: (err) => {
      console.error('Delete Error:', err);
    },
  });

  if (!isOpen || !booth) return null;

  const confirm = async () => {
    try {
      await mutateAsync(booth._id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-red-200 shadow-xl">
        <h3 className="text-xl font-bold text-red-700 mb-2">Delete Booth</h3>
        <p className="text-red-600 mb-4">
          Are you sure you want to delete <span className="font-semibold">{booth.name}</span> 
          {booth.code && <span> (Code: {booth.code})</span>}?
          This action cannot be undone.
        </p>
        {booth.panchayat?.name && (
          <p className="text-sm text-red-500 mb-2">
            Panchayat: {booth.panchayat.name}
          </p>
        )}
        {booth.ward?.name && (
          <p className="text-sm text-red-500 mb-4">
            Ward: {booth.ward.name}
          </p>
        )}
        <div className="flex gap-3">
          <button 
            onClick={onClose} 
            className="flex-1 border border-red-300 text-red-700 rounded-xl py-2 hover:bg-red-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={confirm} 
            disabled={isLoading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl py-2 disabled:bg-red-400 transition-colors"
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteBoothModal;