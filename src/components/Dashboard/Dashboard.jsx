import React, { useState, useEffect } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  // Dummy data - Real data from API will replace this
  const [stats] = useState({
    totalWards: 245,
    totalVoters: 125678,
    totalVoted: 89234,
    pendingVotes: 36444,
  });

  const [wardData] = useState({
    labels: ['Ward 1-50', 'Ward 51-100', 'Ward 101-150', 'Ward 151-200', 'Ward 201-245'],
    voted: [4523, 17890, 23456, 19876, 12489],
    pending: [1234, 3456, 5678, 4321, 2755],
  });

  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading with dummy data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Bar chart data
  const barChartData = {
    labels: wardData.labels,
    datasets: [
      {
        label: 'Voted',
        data: wardData.voted,
        backgroundColor: 'rgba(220, 38, 38, 0.8)',
        borderColor: 'rgb(185, 28, 28)',
        borderWidth: 2,
        borderRadius: 4,
      },
      {
        label: 'Pending',
        data: wardData.pending,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: 'rgb(220, 38, 38)',
        borderWidth: 2,
        borderRadius: 4,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'top',
        labels: {
          color: 'rgb(185, 28, 28)',
          font: { size: 14, weight: 'bold' },
          padding: 20,
        },
      },
      title: {
        display: true,
        text: 'Voter Turnout by Ward Groups',
        font: { size: 18, weight: 'bold' },
        color: 'rgb(185, 28, 28)',
        padding: { top: 10, bottom: 20 },
      },
    },
    scales: {
      y: { 
        beginAtZero: true, 
        ticks: { 
          color: 'rgb(127, 29, 29)',
          font: { size: 12, weight: 'bold' },
        },
        grid: { 
          color: 'rgba(220, 38, 38, 0.1)',
          drawBorder: false,
        },
      },
      x: { 
        ticks: { 
          color: 'rgb(127, 29, 29)',
          font: { size: 12, weight: 'bold' },
        }, 
        grid: { display: false },
      },
    },
  };

  // Doughnut chart data
  const doughnutChartData = {
    labels: ['Voted', 'Pending'],
    datasets: [
      {
        data: [stats.totalVoted, stats.pendingVotes],
        backgroundColor: ['rgba(220, 38, 38, 0.8)', 'rgba(255, 255, 255, 0.9)'],
        borderColor: ['rgb(185, 28, 28)', 'rgb(220, 38, 38)'],
        borderWidth: 3,
      },
    ],
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'bottom',
        labels: {
          color: 'rgb(185, 28, 28)',
          font: { size: 14, weight: 'bold' },
          padding: 20,
        },
      },
      title: {
        display: true,
        text: 'Overall Vote Status',
        font: { size: 18, weight: 'bold' },
        color: 'rgb(185, 28, 28)',
        padding: { top: 10, bottom: 20 },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-red-600 border-t-transparent"></div>
          <p className="mt-6 text-red-600 font-semibold text-lg">Loading Dashboard...</p>
          <p className="mt-2 text-red-500 text-sm">CPIM Admin Portal</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-red-100/50 sticky top-0 z-10">
        <div className="w-full px-4 lg:px-8 py-4 lg:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h2 className="text-2xl lg:text-4xl font-bold text-red-700 tracking-tight">Dashboard</h2>
                <p className="text-red-600 mt-1 lg:mt-2 font-medium text-sm lg:text-base">Panchayat Election Management System</p>
              </div>
            </div>
            <div className="text-xs lg:text-sm text-red-600 font-semibold bg-red-100/60 px-3 lg:px-4 py-2 rounded-full">
              Welcome back, {JSON.parse(localStorage.getItem('user') || '{}').name || 'Admin'}
            </div>
          </div>
        </div>
      </header>

      <main className="w-full px-4 lg:px-8 py-6 lg:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6 mb-8 lg:mb-12">
          <div className="group bg-white/90 backdrop-blur-sm rounded-2xl p-4 lg:p-6 shadow-lg border border-red-200/40 hover:shadow-xl hover:border-red-300/60 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs lg:text-sm font-bold text-red-600 uppercase tracking-wider">Total Wards</p>
                <p className="text-2xl lg:text-3xl font-bold text-red-700 mt-2 lg:mt-3">{stats.totalWards}</p>
              </div>
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-xl lg:text-2xl">🏘️</span>
              </div>
            </div>
          </div>

          <div className="group bg-white/90 backdrop-blur-sm rounded-2xl p-4 lg:p-6 shadow-lg border border-red-200/40 hover:shadow-xl hover:border-red-300/60 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs lg:text-sm font-bold text-red-600 uppercase tracking-wider">Total Voters</p>
                <p className="text-2xl lg:text-3xl font-bold text-red-700 mt-2 lg:mt-3">{stats.totalVoters.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-xl lg:text-2xl">👥</span>
              </div>
            </div>
          </div>

          <div className="group bg-white/90 backdrop-blur-sm rounded-2xl p-4 lg:p-6 shadow-lg border border-red-200/40 hover:shadow-xl hover:border-red-300/60 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs lg:text-sm font-bold text-red-600 uppercase tracking-wider">Total Voted</p>
                <p className="text-2xl lg:text-3xl font-bold text-red-700 mt-2 lg:mt-3">{stats.totalVoted.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-xl lg:text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="group bg-white/90 backdrop-blur-sm rounded-2xl p-4 lg:p-6 shadow-lg border border-red-200/40 hover:shadow-xl hover:border-red-300/60 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs lg:text-sm font-bold text-red-600 uppercase tracking-wider">Pending Votes</p>
                <p className="text-2xl lg:text-3xl font-bold text-red-700 mt-2 lg:mt-3">{stats.pendingVotes.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-xl lg:text-2xl">⏳</span>
              </div>
            </div>
          </div>

          <div className="group bg-white/90 backdrop-blur-sm rounded-2xl p-4 lg:p-6 shadow-lg border border-red-200/40 hover:shadow-xl hover:border-red-300/60 transition-all duration-300 hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs lg:text-sm font-bold text-red-600 uppercase tracking-wider">Turnout %</p>
                <p className="text-2xl lg:text-3xl font-bold text-red-700 mt-2 lg:mt-3">
                  {((stats.totalVoted / stats.totalVoters) * 100).toFixed(1)}%
                </p>
              </div>
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                <span className="text-lg lg:text-xl font-bold">📈</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 mb-8 lg:mb-12">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 lg:p-6 shadow-lg border border-red-200/40 hover:shadow-xl transition-all duration-300">
            <div className="h-64 lg:h-80">
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 lg:p-6 shadow-lg border border-red-200/40 hover:shadow-xl transition-all duration-300">
            <div className="h-64 lg:h-80">
              <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;