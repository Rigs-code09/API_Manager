export const ErrorMessage = ({ error, isDarkMode, onClose, onTestConnection }) => {
  if (!error) return null;

  return (
    <div className={`mb-6 p-4 rounded-lg border ${isDarkMode ? 'bg-red-900/20 border-red-900/30 text-red-300' : 'bg-red-50 border-red-200 text-red-700'}`}>
      <div className="flex items-center">
        <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="flex-1">
          {error}
          {error.includes('environment variables') && (
            <div className="mt-2 text-sm">
              <p>Make sure you have:</p>
              <ol className="list-decimal list-inside mt-1 space-y-1">
                <li>Created a `.env.local` file in your my-app directory</li>
                <li>Added NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
                <li>Restarted your development server</li>
              </ol>
            </div>
          )}
          {error.includes('Database error') && (
            <div className="mt-2 text-sm">
              <p>This usually means the database table doesn't exist. Check the SUPABASE_SETUP.md file for SQL setup instructions.</p>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={onTestConnection}
            className={`px-3 py-1 text-xs rounded ${isDarkMode ? 'bg-red-800 hover:bg-red-700 text-red-200' : 'bg-red-100 hover:bg-red-200 text-red-800'} transition-colors`}
          >
            Test Connection
          </button>
          <button 
            onClick={onClose}
            className={`${isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}; 