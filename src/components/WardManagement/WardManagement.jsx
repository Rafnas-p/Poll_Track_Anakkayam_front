// import React, { useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { getWardsByPanchayat, getBoothsByWard } from '../api/panchayatApi';
// import AddBoothModal from '../modal/AddBoothModal';

// const WardManagement = ({ panchayatId }) => {
//     const navigate = useNavigate();
//     const queryClient = useQueryClient();
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [selectedWard, setSelectedWard] = useState(null);
  
//     // Fetch panchayat details
//     const { data: panchayatData, isLoading: panchayatLoading, error: panchayatError } = useQuery({
//       queryKey: ['panchayat', panchayatId],
//       queryFn: () => getPanchayatById(panchayatId),
//       enabled: !!panchayatId,
//     });
  
//     // Fetch wards for this panchayat
//     const { data: wards, isLoading: wardsLoading, error: wardsError } = useQuery({
//       queryKey: ['wards', panchayatId],
//       queryFn: () => getWardsByPanchayat(panchayatId),
//       enabled: !!panchayatId,
//     });
// console.log(wards,'wards');

//   if (panchayatLoading || wardsLoading) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
//         <div className="text-center">
//           <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-red-600 border-t-transparent"></div>
//           <p className="mt-6 text-red-600 font-semibold text-lg">Loading Ward Details...</p>
//           <p className="mt-2 text-red-500 text-sm">CPIM Admin Portal</p>
//         </div>
//       </div>
//     );
//   }

//   if (panchayatError || wardsError) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
//         <div className="text-center">
//           <p className="text-red-600 font-semibold text-lg">Error: {panchayatError?.message || wardsError?.message}</p>
//           <button 
//             onClick={() => navigate('/panchayat-report')}
//             className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200"
//           >
//             Back to Panchayats
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="w-full px-4 lg:px-8 py-6 lg:py-8 bg-gradient-to-br from-red-50/50 to-white">
//         {/* Header */}


       
//         {/* Wards List */}
//       </div>

//       {/* Add Booth Modal */}
//       <AddBoothModal 
//         isOpen={isModalOpen} 
//         onClose={() => {
//           setIsModalOpen(false);
//           setSelectedWard(null);
//         }}
//         ward={selectedWard}
//         panchayatId={panchayatId}
//       />
//     </>
//   );
// };

// // Wards List Component


// export default WardManagement;