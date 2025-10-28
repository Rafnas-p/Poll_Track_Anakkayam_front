import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePanchayat } from '../api/panchayatApi';

const DeletePanchayatModal = ({ isOpen, onClose, panchayat }) => {
  const qc = useQueryClient();

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: (id) => deletePanchayat(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['panchayats'] });
      onClose();
    },
  });

  if (!isOpen) return null;

  const confirm = async () => {
    await mutateAsync(panchayat._id);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-red-200 shadow-xl">
        <h3 className="text-xl font-bold text-red-700 mb-2">Delete Panchayat</h3>
        <p className="text-red-600 mb-4">
          Are you sure you want to delete <span className="font-semibold">{panchayat.name}</span> ({panchayat.code})?
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 border border-red-300 text-red-700 rounded-xl py-2">
            Cancel
          </button>
          <button onClick={confirm} disabled={isLoading}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl py-2">
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePanchayatModal;