import { useEffect } from 'react';

export const Modal = ({ isOpen, onClose, title, subtitle, isDarkMode, children }) => {
  // Handle keyboard events
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-8 w-full max-w-md shadow-2xl`}>
        <div className="mb-6">
          <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            {title}
          </h3>
          {subtitle && (
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
              {subtitle}
            </p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}; 