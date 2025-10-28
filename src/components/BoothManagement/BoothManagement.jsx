import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getBoothsByWard } from '../api/panchayatApi';
import AddBoothModal from '../modal/AddBoothModal';
import EditBoothModal from '../modal/EditBoothModal';
import DeleteBoothModal from '../modal/DeleteBoothModal';

const BoothManagement = () => {
  const { wardId } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch booths for this ward
  const { data: boothsData, isLoading, error } = useQuery({
    queryKey: ['booths', wardId],
    queryFn: () => getBoothsByWard(wardId),
    enabled: !!wardId,
  });

  // Filter booths based on search query
  const filteredBooths = boothsData?.booths?.filter(booth => 
    booth.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booth.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booth.district.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleEditBooth = (booth) => {
    setSelectedBooth(booth);
    setIsEditModalOpen(true);
  };

  const handleDeleteBooth = (booth) => {
    setSelectedBooth(booth);
    setIsDeleteModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-red-600 border-t-transparent"></div>
          <p className="mt-6 text-red-600 font-semibold text-lg">Loading Booth Details...</p>
          <p className="mt-2 text-red-500 text-sm">CPIM Admin Portal</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <div className="text-center">
          <p className="text-red-600 font-semibold text-lg">Error: {error.message}</p>
          <button 
            onClick={() => navigate('/panchayat-report')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200"
          >
            Back to Panchayats
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 lg:px-8 py-6 lg:py-8 bg-gradient-to-br from-red-50/50 to-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="text-red-600 hover:text-red-800 mb-4 flex items-center gap-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Ward
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl lg:text-4xl font-bold text-red-700 tracking-tight">
              Booth Management - Ward {boothsData?.ward?.wardNumber}
            </h2>
            <p className="text-red-600 mt-2">{boothsData?.ward?.name}</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Booth
          </button>
        </div>
      </div>

      {/* Ward Info Card */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 lg:p-6 shadow-lg border border-red-200/40 mb-6">
        <h3 className="text-lg lg:text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Ward Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
            <p className="text-xs text-red-600 font-medium mb-1 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
              Ward Number
            </p>
            <p className="text-lg font-bold text-red-700">{boothsData?.ward?.wardNumber}</p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
            <p className="text-xs text-red-600 font-medium mb-1 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Ward Name
            </p>
            <p className="text-lg font-bold text-red-700">{boothsData?.ward?.name}</p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
            <p className="text-xs text-red-600 font-medium mb-1 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Total Booths
            </p>
            <p className="text-lg font-bold text-red-700">{boothsData?.count || 0}</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-red-200/40">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by booth name, code, or district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-red-200 focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-100 text-red-700 placeholder-red-400 transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-400 hover:text-red-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="mt-2 text-sm text-red-600 font-medium">
              Found {filteredBooths.length} booth(s)
            </p>
          )}
        </div>
      </div>

      {/* Booths List */}
      <BoothsList 
        booths={{ ...boothsData, booths: filteredBooths }} 
        searchQuery={searchQuery}
        onEdit={handleEditBooth}
        onDelete={handleDeleteBooth}
        navigate={navigate}
      />

      {/* Add Booth Modal */}
      <AddBoothModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        ward={boothsData?.ward}
        panchayatId={boothsData?.ward?.panchayat}
      />

      {/* Edit Booth Modal */}
      <EditBoothModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedBooth(null);
        }}
        booth={selectedBooth}
      />

      {/* Delete Booth Modal */}
      <DeleteBoothModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedBooth(null);
        }}
        booth={selectedBooth}
      />
    </div>
  );
};

// Booths List Component
const BoothsList = ({ booths, searchQuery, onEdit, onDelete, navigate }) => {
  const hasBooths = booths?.booths && Array.isArray(booths.booths) && booths.booths.length > 0;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 lg:p-6 shadow-lg border border-red-200/40">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg lg:text-xl font-bold text-red-600 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          Polling Booths
        </h3>
        <div className="text-sm text-red-500 font-medium bg-red-50 px-3 py-1 rounded-full">
          Total: {booths?.count || 0} Booths
        </div>
      </div>
      
      {hasBooths ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {booths.booths.map((booth) => (
            <div key={booth._id} className="bg-gradient-to-br from-red-50 to-white p-5 rounded-xl border-2 border-red-200 hover:border-red-400 hover:shadow-lg transition-all duration-200 group">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-red-600 text-white p-3 rounded-lg group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-red-700 text-lg">{booth.name}</h4>
                    <p className="text-red-600 text-sm font-medium">{booth.district}</p>
                  </div>
                </div>
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
                  {booth.code}
                </span>
              </div>
              
              {booth.description && (
                <div className="mb-3 p-2 bg-white rounded-lg border border-red-200">
                  <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Description
                  </p>
                  <p className="text-xs text-red-700 font-semibold mt-1 truncate">{booth.description}</p>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <button 
                  onClick={() => navigate(`/booth-details/${booth._id}`)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View
                </button>
                <button 
                  onClick={() => onEdit(booth)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button 
                  onClick={() => onDelete(booth)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🗳️</div>
          <p className="text-red-600 text-lg font-semibold">
            {searchQuery ? 'No booths found matching your search' : 'No booths found'}
          </p>
          <p className="text-red-500 text-sm mt-2">
            {searchQuery ? 'Try adjusting your search query' : 'Add your first booth to get started'}
          </p>
        </div>
      )}
    </div>
  );
};

export default BoothManagement;