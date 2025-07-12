import React, { useEffect, useRef } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, children, className }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open && ref.current) {
      ref.current.focus();
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={ref}
        tabIndex={-1}
        className={`bg-gray-900 p-6 rounded-xl border border-purple-300/30 max-w-md w-full outline-none ${className || ''}`}
        style={{ boxShadow: '0 0 0 4px #a78bfa55' }}
      >
        {children}
        <button
          className="mt-4 w-full px-4 py-2 bg-purple-400/20 hover:bg-purple-400/30 text-purple-300 rounded-xl border border-purple-400/30"
          onClick={onClose}
        >
          Закрыть
        </button>
      </div>
    </div>
  );
};

export default Modal; 