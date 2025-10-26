import React from 'react';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
  className="fixed inset-0  bg-opacity-20 transition-opacity"
  onClick={onClose}
/>
      
      {/* Modal Content */}
      <div className={`relative bg-white rounded-2xl shadow-xl w-full mx-4 ${sizeClasses[size]} max-h-[90vh] overflow-y-auto`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-red-200/50">
          <h3 className="text-xl font-bold text-red-700">{title}</h3>
          <button
            onClick={onClose}
            className="text-red-400 hover:text-red-600 transition-colors text-2xl font-bold"
          >
            ×
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;