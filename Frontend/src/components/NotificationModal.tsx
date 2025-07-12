import React from 'react';
import Modal from './Modal';

interface NotificationModalProps {
  title: string;
  message: string;
  isOpen: boolean;
  onClose: () => void;
  isError?: boolean;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ title, message, isOpen, onClose, isError = true }) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <h3 className={`text-lg mb-4 ${isError ? 'text-purple-300' : 'text-green-300'}`}>{title}</h3>
      <p className="text-gray-200 mb-4">{message}</p>
    </Modal>
  );
};

export default NotificationModal;
