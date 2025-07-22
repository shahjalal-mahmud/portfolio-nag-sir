import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - separated from content */}
      <div 
        className="fixed inset-0 z-40 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
          <button
            onClick={onClose}
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </button>
          {children}
        </div>
      </div>
    </>
  );
};

export default Modal;