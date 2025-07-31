export const Toast = ({ toast, isDarkMode, onClose }) => {
  if (!toast) return null;

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg border transition-all duration-300 animate-pulse ${
      toast.type === 'success' 
        ? isDarkMode 
          ? 'bg-green-800 text-green-100 border-green-700' 
          : 'bg-green-100 text-green-800 border-green-200'
        : isDarkMode 
          ? 'bg-red-800 text-red-100 border-red-700' 
          : 'bg-red-100 text-red-800 border-red-200'
    }`}>
      <div className="flex items-center">
        <div className={`w-2 h-2 rounded-full mr-3 ${
          toast.type === 'success' 
            ? isDarkMode ? 'bg-green-400' : 'bg-green-500'
            : isDarkMode ? 'bg-red-400' : 'bg-red-500'
        }`}></div>
        <span className="font-medium">{toast.message}</span>
        <button
          onClick={onClose}
          className={`ml-3 p-1 rounded hover:bg-black/10 transition-colors ${
            toast.type === 'success'
              ? isDarkMode ? 'text-green-300 hover:text-green-200' : 'text-green-600 hover:text-green-800'
              : isDarkMode ? 'text-red-300 hover:text-red-200' : 'text-red-600 hover:text-red-800'
          }`}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}; 