import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllPanchayats } from '../api/panchayatApi';
import { useNavigate } from 'react-router-dom';

const ViewPanchayats = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch all panchayats
  const { data: panchayats, isLoading, error } = useQuery({
    queryKey: ['panchayats'],
    queryFn: async () => {
      console.log('Fetching panchayats...');
      const response = await getAllPanchayats();
      console.log('API Response:', response);
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
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 lg:p-6 shadow-lg border border-red-200/40">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-red-600 border-t-transparent"></div>
            <p className="mt-4 text-red-600 font-medium">Loading panchayats...</p>
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

  const hasPanchayats = filteredPanchayats && filteredPanchayats.length > 0;

  return (
    <>
      {/* Search Bar */}
      <div className="mb-6">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-red-200/40">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, code, or address..."
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
              Found {filteredPanchayats.length} panchayat(s)
            </p>
          )}
        </div>
      </div>

      {/* Panchayats Grid */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 lg:p-6 shadow-lg border border-red-200/40">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg lg:text-xl font-bold text-red-600 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Panchayat List
          </h3>
          <div className="text-sm text-red-500 font-medium bg-red-50 px-3 py-1 rounded-full">
            Total: {filteredPanchayats.length} Panchayats
          </div>
        </div>
        
        {hasPanchayats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPanchayats.map((panchayat) => (
              <div 
                key={panchayat._id} 
                className="bg-gradient-to-br from-red-50 to-white p-6 rounded-xl border-2 border-red-200 hover:border-red-400 hover:shadow-lg transition-all duration-200 cursor-pointer group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-600 text-white p-3 rounded-lg group-hover:scale-110 transition-transform duration-200">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-red-700 text-lg">{panchayat.name}</h4>
                      <p className="text-xs text-red-500 mt-1">
                        {new Date(panchayat.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
                    {panchayat.code}
                  </span>
                </div>

                {/* Info Items */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2 p-2 bg-white rounded-lg border border-red-200">
                    <svg className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-red-600 font-medium">Total Wards</p>
                      <p className="text-sm font-bold text-red-700">{panchayat.totalWards || 0}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-2 bg-white rounded-lg border border-red-200">
                    <svg className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-red-600 font-medium">Address</p>
                      <p className="text-sm font-bold text-red-700 truncate">{panchayat.address || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <button 
                    onClick={() => handleManagePanchayat(panchayat._id)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-md"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Manage
                  </button>
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-md">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-md">
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
              {searchQuery ? 'No panchayats found matching your search' : 'No panchayats found'}
            </p>
            <p className="text-red-500 text-sm mt-2">
              {searchQuery ? 'Try adjusting your search query' : 'Add your first panchayat to get started'}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default ViewPanchayats;