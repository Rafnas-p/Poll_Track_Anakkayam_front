import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllPanchayats } from '../api/panchayatApi';
import { useNavigate } from 'react-router-dom';
import EditPanchayatModal from '../modal/EditPanchayatModal';
import DeletePanchayatModal from '../modal/DeletePanchayatModal';
import { Search, X, Building2, MapPin, Calendar, Eye, Edit3, Trash2, Loader2 } from 'lucide-react';

const ViewPanchayats = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPanchayat, setSelectedPanchayat] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const openEdit = (p) => { setSelectedPanchayat(p); setIsEditOpen(true); };
  const openDelete = (p) => { setSelectedPanchayat(p); setIsDeleteOpen(true); };

  // Fetch all panchayats
  const { data: panchayats, isLoading, error } = useQuery({
    queryKey: ['panchayats'],
    queryFn: async () => {
      const response = await getAllPanchayats();
      return response;
    },
  });

  const handleManagePanchayat = (panchayatId) => {
    navigate(`/panchayat/${panchayatId}/manage`);
  };

  // Filter panchayats based on search query
  const filteredPanchayats = panchayats?.data?.filter(panchayat => 
    panchayat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    panchayat.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    panchayat.address.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-10 h-10 text-red-600 animate-spin mb-4" />
          <p className="text-gray-600 font-medium">Loading panchayats...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="text-center py-12">
          <p className="text-red-600 font-semibold">Error: {error.message}</p>
        </div>
      </div>
    );
  }

  const hasPanchayats = filteredPanchayats && filteredPanchayats.length > 0;

  return (
    <>
      {/* Search Bar */}
      <div className="mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, code, or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3 rounded-lg border border-gray-200 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100 text-gray-700 placeholder-gray-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="mt-3 text-sm text-gray-600">
              Found <span className="font-semibold text-red-600">{filteredPanchayats.length}</span> panchayat(s)
            </p>
          )}
        </div>
      </div>

      {/* Panchayats Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-red-600" />
            Panchayat Directory
          </h3>
          <div className="text-sm font-medium text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
            Total: <span className="text-red-600 font-semibold">{filteredPanchayats.length}</span>
          </div>
        </div>
        
        {hasPanchayats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPanchayats.map((panchayat) => (
              <div 
                key={panchayat._id} 
                className="bg-white border border-gray-200 rounded-lg hover:shadow-lg hover:border-red-200 transition-all duration-200 overflow-hidden group"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-red-600 to-red-700 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white text-lg truncate mb-1">
                        {panchayat.name}
                      </h4>
                      <div className="flex items-center gap-2 text-red-50 text-xs">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(panchayat.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <span className="bg-white text-red-600 px-3 py-1 rounded-md text-xs font-bold ml-2 flex-shrink-0">
                      {panchayat.code}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  {/* Ward Info */}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="bg-red-100 p-2 rounded-lg">
                      <Building2 className="w-4 h-4 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 font-medium">Total Wards</p>
                      <p className="text-sm font-semibold text-gray-800">{panchayat.totalWards || 0}</p>
                    </div>
                  </div>

                  {/* Address Info */}
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="bg-red-100 p-2 rounded-lg">
                      <MapPin className="w-4 h-4 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 font-medium mb-0.5">Address</p>
                      <p className="text-sm font-medium text-gray-800 line-clamp-2">
                        {panchayat.address || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-4 pt-2 space-y-2">
                  <button 
                    onClick={() => handleManagePanchayat(panchayat._id)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => openEdit(panchayat)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </button>

                    <button
                      onClick={() => openDelete(panchayat)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-700 text-lg font-semibold mb-1">
              {searchQuery ? 'No panchayats found' : 'No panchayats available'}
            </p>
            <p className="text-gray-500 text-sm">
              {searchQuery ? 'Try adjusting your search query' : 'Add your first panchayat to get started'}
            </p>
          </div>
        )}

        <EditPanchayatModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          initialData={selectedPanchayat}
        />
        <DeletePanchayatModal
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          panchayat={selectedPanchayat}
        />
      </div>
    </>
  );
};

export default ViewPanchayats;