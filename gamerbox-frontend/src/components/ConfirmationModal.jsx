import { useState } from "react";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "¿Estás seguro?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  confirmButtonClass = "bg-red-600 hover:bg-red-700",
}) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex font-chakra items-center justify-center z-50">
      <div
        className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl"
        style={{
          animation: "slideInRight 0.3s ease-out",
          '@keyframes slideInRight': {
            '0%': {
              transform: 'translateX(100%)',
              opacity: '0'
            },
            '100%': {
              transform: 'translateX(0)',
              opacity: '1'
            }
          }
        }}
      >
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-medium text-white ${confirmButtonClass} rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[80px]`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
