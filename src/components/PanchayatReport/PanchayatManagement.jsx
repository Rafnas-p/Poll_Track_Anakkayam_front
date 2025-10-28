import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import AddWardModal from '../modal/AddWardModal';
import EditWardModal from '../modal/EditWardModal';
import DeleteWardModal from '../modal/DeleteWardModal';
import { getPanchayatById, getWardsByPanchayat } from '../api/panchayatApi';

const PanchayatManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedWard, setSelectedWard] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch panchayat details
  const { data: panchayat, isLoading: panchayatLoading, error: panchayatError } = useQuery({
    queryKey: ['panchayat', id],
    queryFn: () => getPanchayatById(id),
    enabled: !!id,
  });

  // Fetch wards for this panchayat
  const { data: wards, isLoading: wardsLoading, error: wardsError } = useQuery({
    queryKey: ['wards', id],
    queryFn: () => getWardsByPanchayat(id),
    enabled: !!id,
  });

  // Filter wards based on search query
  const filteredWards = wards?.wards?.filter(ward => 
    ward.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ward.wardNumber.toString().includes(searchQuery)
  ) || [];

  if (panchayatLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-red-600 border-t-transparent"></div>
          <p className="mt-6 text-red-600 font-semibold text-lg">Loading Panchayat Details...</p>
          <p className="mt-2 text-red-500 text-sm">CPIM Admin Portal</p>
        </div>
      </div>
    );
  }

  if (panchayatError) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <div className="text-center">
          <p className="text-red-600 font-semibold text-lg">Error: {panchayatError.message}</p>
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
    <>
      <div className="w-full px-4 lg:px-8 py-6 lg:py-8 bg-gradient-to-br from-red-50/50 to-white min-h-screen">
        {/* Header */}
        <div className="mb-6">
          <button 
            onClick={() => navigate('/panchayat-report')}
            className="text-red-600 hover:text-red-800 mb-4 flex items-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Panchayats
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl lg:text-4xl font-bold text-red-700 tracking-tight">
                {panchayat?.data?.name} Management
              </h2>
              <p className="text-red-600 mt-2">Manage wards for this panchayat</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Ward
            </button>
          </div>
        </div>

        {/* Panchayat Info Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 lg:p-6 shadow-lg border border-red-200/40 mb-6">
          <h3 className="text-lg lg:text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Panchayat Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
              <p className="text-xs text-red-600 font-medium mb-1 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Name
              </p>
              <p className="text-lg font-bold text-red-700">{panchayat?.data?.name}</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
              <p className="text-xs text-red-600 font-medium mb-1 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
                Code
              </p>
              <p className="text-lg font-bold text-red-700">{panchayat?.data?.code}</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
              <p className="text-xs text-red-600 font-medium mb-1 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Total Wards
              </p>
              <p className="text-lg font-bold text-red-700">{wards?.wards?.length || 0}</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
              <p className="text-xs text-red-600 font-medium mb-1 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Address
              </p>
              <p className="text-sm font-bold text-red-700 truncate">{panchayat?.data?.address || 'N/A'}</p>
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
                placeholder="Search by ward name or number..."
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
                Found {filteredWards.length} ward(s)
              </p>
            )}
          </div>
        </div>

        {/* Wards Section */}
        <WardsList 
          wards={{ ...wards, wards: filteredWards }} 
          isLoading={wardsLoading} 
          error={wardsError} 
          navigate={navigate}
          searchQuery={searchQuery}
          onEditWard={(ward) => {
            setSelectedWard(ward);
            setIsEditModalOpen(true);
          }}
          onDeleteWard={(ward) => {
            setSelectedWard(ward);
            setIsDeleteModalOpen(true);
          }}
        />
      </div>

      {/* Add Ward Modal */}
      <AddWardModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        panchayatId={id}
      />

      {/* Edit Ward Modal */}
      <EditWardModal 
        isOpen={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedWard(null);
        }}
        ward={selectedWard}
        panchayatId={id}
      />

      {/* Delete Ward Modal */}
      <DeleteWardModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedWard(null);
        }}
        ward={selectedWard}
        panchayatId={id}
      />
    </>
  );
};

// Wards List Component
const WardsList = ({ wards, isLoading, error, navigate, searchQuery, onEditWard, onDeleteWard }) => {
  if (isLoading) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 lg:p-6 shadow-lg border border-red-200/40">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-red-600 border-t-transparent"></div>
            <p className="mt-4 text-red-600 font-medium">Loading wards...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 lg:p-6 shadow-lg border border-red-200/40">
        <div className="text-center py-12">
          <p className="text-red-600 font-semibold">Error: {error.message}</p>
        </div>
      </div>
    );
  }

  const hasWards = wards?.wards && Array.isArray(wards.wards) && wards.wards.length > 0;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 lg:p-6 shadow-lg border border-red-200/40">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg lg:text-xl font-bold text-red-600 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Wards
        </h3>
        <div className="text-sm text-red-500 font-medium bg-red-50 px-3 py-1 rounded-full">
          Total: {hasWards ? wards.wards.length : 0} Wards
        </div>
      </div>
      
      {hasWards ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wards.wards.map((ward) => (
            <div key={ward._id} className="bg-gradient-to-br from-red-50 to-white p-5 rounded-xl border-2 border-red-200 hover:border-red-400 hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-red-600 text-white p-3 rounded-lg group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-red-700 text-lg">Ward {ward.wardNumber}</h4>
                    <p className="text-red-600 text-sm font-medium">{ward.name}</p>
                  </div>
                </div>
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
                  #{ward.wardNumber}
                </span>
              </div>
              
              {ward.pollingBooth?.name && (
                <div className="mb-3 p-2 bg-white rounded-lg border border-red-200">
                  <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Polling Booth
                  </p>
                  <p className="text-xs text-red-700 font-semibold mt-1 truncate">{ward.pollingBooth.name}</p>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <button 
                  onClick={() => navigate(`/ward/${ward._id}/booths`)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View Ward
                </button>
                <button 
                  onClick={() => onEditWard(ward)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button 
                  onClick={() => onDeleteWard(ward)}
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
          <div className="text-6xl mb-4">🏘️</div>
          <p className="text-red-600 text-lg font-semibold">
            {searchQuery ? 'No wards found matching your search' : 'No wards found'}
          </p>
          <p className="text-red-500 text-sm mt-2">
            {searchQuery ? 'Try adjusting your search query' : 'Add your first ward to get started'}
          </p>
        </div>
      )}
    </div>
  );
};

export default PanchayatManagement;