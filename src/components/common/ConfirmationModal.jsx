import React from 'react';
import Modal from './Modal';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  message = "Are you sure you want to perform this action?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "red",
  title = "Confirm Action"
}) => {
  const confirmButtonClasses = {
    red: 'bg-red-600 hover:bg-red-700',
    blue: 'bg-blue-600 hover:bg-blue-700',
    green: 'bg-green-600 hover:bg-green-700',
    primary: 'bg-primary hover:bg-primary-dark'
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        {title}
      </h3>

      <p className="text-gray-700 mb-6">
        {message}
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg transition-colors border border-gray-300 hover:border-gray-400"
        >
          {cancelText}
        </button>

        <button
          onClick={onConfirm}
          className={`px-4 py-2 text-white font-medium rounded-lg transition-colors ${confirmButtonClasses[confirmColor] || confirmButtonClasses.red}`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
