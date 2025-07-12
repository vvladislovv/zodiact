import Modal from './Modal';

interface ErrorModalProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ message, isOpen, onClose }) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <h3 className="text-purple-300 text-lg mb-4">Ошибка</h3>
      <p className="text-gray-200 mb-4">{message}</p>
    </Modal>
  );
};

export default ErrorModal;
