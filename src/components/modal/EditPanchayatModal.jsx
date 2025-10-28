import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePanchayat } from '../api/panchayatApi';

const EditPanchayatModal = ({ isOpen, onClose, initialData }) => {
  const qc = useQueryClient();
  const [form, setForm] = useState({ name: '', code: '', totalWards: 0, address: '' });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        code: initialData.code || '',
        totalWards: initialData.totalWards || 0,
        address: initialData.address || '',
      });
    }
  }, [initialData]);

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: ({ id, payload }) => updatePanchayat(id, payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['panchayats'] });
      onClose();
    },
  });

  if (!isOpen) return null;

  const submit = async (e) => {
    e.preventDefault();
    await mutateAsync({ id: initialData._id, payload: form });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg border border-red-200 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-red-700">Edit Panchayat</h3>
          <button onClick={onClose} className="text-red-600 hover:text-red-800">✕</button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-red-700 mb-1">Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                   className="w-full border-2 border-red-200 rounded-xl px-3 py-2 focus:outline-none focus:border-red-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-red-700 mb-1">Code</label>
            <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                   className="w-full border-2 border-red-200 rounded-xl px-3 py-2 uppercase focus:outline-none focus:border-red-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-red-700 mb-1">Total Wards</label>
            <input type="number" min="0" value={form.totalWards}
                   onChange={(e) => setForm({ ...form, totalWards: Number(e.target.value) })}
                   className="w-full border-2 border-red-200 rounded-xl px-3 py-2 focus:outline-none focus:border-red-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-red-700 mb-1">Address</label>
            <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className="w-full border-2 border-red-200 rounded-xl px-3 py-2 focus:outline-none focus:border-red-500" rows={3} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-red-300 text-red-700 rounded-xl py-2">
              Cancel
            </button>
            <button type="submit" disabled={isLoading}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl py-2">
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPanchayatModal;