import React, { useState } from 'react';
import AddPanchayatModal from '../modal/AddPanchayatModal';
import ViewPanchayats from './ViewPanchayats';

const PanchayatReport = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="w-full px-4 lg:px-8 py-6 lg:py-8 bg-gradient-to-br from-red-50/50 to-white min-h-screen">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl lg:text-4xl font-bold text-red-700 tracking-tight">
                Panchayat Management
              </h2>
              <p className="text-red-600 mt-2">Manage panchayats and their details</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-2 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <svg className="w-3 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Panchayat
            </button>
          </div>
        </div>

        {/* View Panchayats Section */}
        <ViewPanchayats />
      </div>

      {/* Add Panchayat Modal */}
      <AddPanchayatModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default PanchayatReport;