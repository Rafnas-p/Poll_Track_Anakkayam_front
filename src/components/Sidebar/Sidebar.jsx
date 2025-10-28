import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/sign-in', { replace: true });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 sm:w-72 bg-gradient-to-b from-red-700 to-red-800 text-white flex flex-col shadow-lg transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-red-600/50">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">CPIM Admin</h1>
              <p className="text-red-100 text-xs sm:text-sm mt-1 font-medium">Panchayat Election Portal</p>
            </div>
            <button 
              onClick={toggleMobileMenu}
              className="lg:hidden text-white hover:text-red-200 transition-colors p-2 -mr-2"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4 sm:p-6 space-y-2 overflow-y-auto">
          <button
            onClick={() => handleNavClick('/dashboard')}
            className="w-full flex items-center gap-3 px-3 sm:px-4 py-3 sm:py-3 rounded-xl text-white bg-red-600/20 font-semibold border border-red-500/30 hover:bg-red-600/30 transition-all duration-200 text-sm sm:text-base"
          >
            <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-sm flex-shrink-0">📊</span>
            <span className="truncate">Dashboard</span>
          </button>
          
          <button
            onClick={() => handleNavClick('/panchayat-report')}
            className="w-full flex items-center gap-3 px-3 sm:px-4 py-3 sm:py-3 rounded-xl text-white/80 hover:bg-red-600/30 hover:text-white transition-all duration-200 font-medium border border-transparent hover:border-white/20 text-sm sm:text-base"
          >
            <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-sm flex-shrink-0">📋</span>
            <span className="truncate">Panchayat Report</span>
          </button>

         
        </nav>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-red-600/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 sm:px-4 py-3 sm:py-3 bg-red-600/30 hover:bg-red-600/50 rounded-xl text-white transition-all duration-200 font-medium border border-red-500/30 text-sm sm:text-base"
          >
            <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-sm flex-shrink-0">🚪</span>
            <span className="truncate">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;