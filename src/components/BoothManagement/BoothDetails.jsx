import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVotersByBooth } from "../api/voterApi"
import { getBoothById } from "../api/panchayatApi"
import AddVoterModal from '../modal/AddVoterModal';

const BoothDetails = () => {
  const { boothId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [votingStatusFilter, setVotingStatusFilter] = useState('all');

  // Fetch booth details to get ward and panchayat info
  const { data: boothData, isLoading: boothLoading } = useQuery({
    queryKey: ['booth', boothId],
    queryFn: () => getBoothById(boothId),
    enabled: !!boothId,
  });

  // Fetch voters for this booth
  const { data: votersData, isLoading, error } = useQuery({
    queryKey: ['voters', boothId],
    queryFn: () => getVotersByBooth(boothId),
    enabled: !!boothId,
  });

  // Update voter status mutation
  const updateVoterStatusMutation = useMutation({
    mutationFn: async ({ voterId, status, hasVoted }) => {
      const response = await fetch(`http://localhost:3001/voters/update-voter/${voterId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, hasVoted }),
      });
      if (!response.ok) throw new Error('Failed to update voter status');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['voters', boothId]);
    },
  });

  // Filter voters based on search and filters
  const filteredVoters = votersData?.voters?.filter(voter => {
    const matchesSearch = voter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         voter.voterId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         voter.address?.houseNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || voter.status === statusFilter;
    const matchesVotingStatus = votingStatusFilter === 'all' || 
                               (votingStatusFilter === 'voted' && voter.hasVoted) ||
                               (votingStatusFilter === 'not-voted' && !voter.hasVoted);
    
    return matchesSearch && matchesStatus && matchesVotingStatus;
  }) || [];

  if (isLoading || boothLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-red-600 border-t-transparent"></div>
          <p className="mt-6 text-red-600 font-semibold text-lg">Loading Voter Details...</p>
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
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200"
          >
            Back to Booths
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 lg:px-8 py-6 lg:py-8 bg-gradient-to-br from-red-50/50 to-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button 
            onClick={() => navigate(-1)}
            className="text-red-600 hover:text-red-800 mb-4 flex items-center gap-2"
          >
            ← Back to Booths
          </button>
          <h2 className="text-2xl lg:text-4xl font-bold text-red-700 tracking-tight">
            Booth Voters Management
          </h2>
          <p className="text-red-600 mt-2">Manage voters for this booth</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <span className="text-lg">+</span>
          Add Voter
        </button>
      </div>

      {/* Booth Info Card */}
      {boothData?.booth && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 lg:p-6 shadow-lg border border-red-200/40 mb-8">
          <h3 className="text-lg lg:text-xl font-bold text-red-600 mb-4">Booth Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-600 font-medium">Booth Name</p>
              <p className="text-lg font-bold text-red-700">{boothData.booth.name}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-600 font-medium">Booth Code</p>
              <p className="text-lg font-bold text-red-700">{boothData.booth.code}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-600 font-medium">District</p>
              <p className="text-lg font-bold text-red-700">{boothData.booth.district}</p>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 lg:p-6 shadow-lg border border-red-200/40 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Bar */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-red-600 mb-2">Search Voters</label>
            <input
              type="text"
              placeholder="Search by name, voter ID, or house number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
            />
          </div>
          
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-red-600 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="deceased">Deceased</option>
              <option value="transferred">Transferred</option>
            </select>
          </div>
          
          {/* Voting Status Filter */}
          <div>
            <label className="block text-sm font-medium text-red-600 mb-2">Voting Status</label>
            <select
              value={votingStatusFilter}
              onChange={(e) => setVotingStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
            >
              <option value="all">All</option>
              <option value="voted">Voted</option>
              <option value="not-voted">Not Voted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Voters Table */}
      <VotersTable 
        voters={filteredVoters} 
        totalCount={votersData?.count || 0}
        onStatusChange={updateVoterStatusMutation.mutate}
        isUpdating={updateVoterStatusMutation.isPending}
      />

      {/* Add Voter Modal */}
      <AddVoterModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        boothId={boothId}
        boothData={boothData?.booth}
      />
    </div>
  );
};

// Voters Table Component
const VotersTable = ({ voters, totalCount, onStatusChange, isUpdating }) => {
  const handleStatusChange = (voterId, field, value) => {
    onStatusChange({ voterId, [field]: value });
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 lg:p-6 shadow-lg border border-red-200/40">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg lg:text-xl font-bold text-red-600">Registered Voters</h3>
        <div className="text-sm text-red-500 font-medium">
          Showing: {voters.length} of {totalCount} Voters
        </div>
      </div>
      
      {voters.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-red-200">
                <th className="text-left py-3 px-4 font-semibold text-red-600">Photo</th>
                <th className="text-left py-3 px-4 font-semibold text-red-600">Voter Details</th>
                <th className="text-left py-3 px-4 font-semibold text-red-600">Address</th>
                <th className="text-left py-3 px-4 font-semibold text-red-600">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-red-600">Voting Status</th>
                <th className="text-left py-3 px-4 font-semibold text-red-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {voters.map((voter) => (
                <tr key={voter._id} className="border-b border-red-100 hover:bg-red-50/50 transition-colors">
                  <td className="py-4 px-4">
                    {voter.photo?.url ? (
                      <img 
                        src={`http://localhost:3001${voter.photo.url}`} 
                        alt={voter.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-red-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-red-200 flex items-center justify-center">
                        <span className="text-red-600 font-bold text-lg">
                          {voter.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </td>
                  
                  <td className="py-4 px-4">
                    <div>
                      <h4 className="font-bold text-red-700 text-lg">{voter.name}</h4>
                      <p className="text-red-600 text-sm">ID: {voter.voterId}</p>
                      <p className="text-red-500 text-sm">Age: {voter.age} | {voter.gender}</p>
                      <p className="text-red-500 text-sm">Guardian: {voter.guardian?.name} ({voter.guardian?.relation})</p>
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className="text-sm text-red-600">
                      <p>House: {voter.address?.houseNumber}</p>
                      <p>{voter.address?.houseName}</p>
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <select
                      value={voter.status}
                      onChange={(e) => handleStatusChange(voter._id, 'status', e.target.value)}
                      disabled={isUpdating}
                      className={`px-3 py-1 rounded-full text-xs font-medium border-0 ${
                        voter.status === 'active' ? 'bg-green-100 text-green-700' :
                        voter.status === 'inactive' ? 'bg-yellow-100 text-yellow-700' :
                        voter.status === 'deceased' ? 'bg-gray-100 text-gray-700' :
                        'bg-blue-100 text-blue-700'
                      } ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="deceased">Deceased</option>
                      <option value="transferred">Transferred</option>
                    </select>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <select
                        value={voter.hasVoted ? 'voted' : 'not-voted'}
                        onChange={(e) => handleStatusChange(voter._id, 'hasVoted', e.target.value === 'voted')}
                        disabled={isUpdating}
                        className={`px-3 py-1 rounded-full text-xs font-medium border-0 ${
                          voter.hasVoted ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        } ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <option value="not-voted">Not Voted</option>
                        <option value="voted">Voted</option>
                      </select>
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all duration-200">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 bg-red-50 rounded-lg hover:bg-red-100 transition-all duration-200">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👥</div>
          <p className="text-red-600 text-lg font-medium">No voters found</p>
          <p className="text-red-500 text-sm mt-2">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default BoothDetails;