import { useState } from 'react';

export const APIKeyTable = ({ 
  apiKeys, 
  loading, 
  isDarkMode, 
  onEdit, 
  onDelete, 
  onCopy, 
  onTestConnection,
  onCreateNew 
}) => {
  const [visibleKeys, setVisibleKeys] = useState(new Set());

  const toggleKeyVisibility = (keyId) => {
    const newVisibleKeys = new Set(visibleKeys);
    if (newVisibleKeys.has(keyId)) {
      newVisibleKeys.delete(keyId);
    } else {
      newVisibleKeys.add(keyId);
    }
    setVisibleKeys(newVisibleKeys);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      onDelete(id);
    }
  };

  // Handle keyboard events for buttons
  const handleButtonKeyDown = (e, action, ...args) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action(...args);
    }
  };

  // Handle keyboard events for table rows
  const handleRowKeyDown = (e, key) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        onEdit(key);
        break;
      case 'c':
      case 'C':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          onCopy(key.key);
        }
        break;
      case 'Delete':
      case 'Backspace':
        if (e.shiftKey) {
          e.preventDefault();
          handleDelete(key.id);
        }
        break;
      case 'v':
      case 'V':
        if (!e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          toggleKeyVisibility(key.id);
        }
        break;
    }
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border`}>
      <div className={`flex justify-between items-center p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div>
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>API Keys</h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
            The key is used to authenticate your requests to the Research API. To learn more, see the{' '}
            <a href="#" className="text-blue-600 hover:text-blue-800">documentation</a> page.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onTestConnection}
            onKeyDown={(e) => handleButtonKeyDown(e, onTestConnection)}
            className={`px-3 py-2 text-xs rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'} transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500`}
            title="Test Supabase Connection (T)"
          >
            🔗 Test
          </button>
          <button
            onClick={onCreateNew}
            onKeyDown={(e) => handleButtonKeyDown(e, onCreateNew)}
            className={`w-8 h-8 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'} rounded-lg flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500`}
            title="Create New API Key (Ctrl+N)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b ${isDarkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
              <th className={`text-left py-3 px-6 text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>NAME</th>
              <th className={`text-left py-3 px-6 text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>USAGE</th>
              <th className={`text-left py-3 px-6 text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>KEY</th>
              <th className={`text-right py-3 px-6 text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>OPTIONS</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {loading ? (
              <tr>
                <td colSpan={4} className={`px-6 py-8 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading API keys...
                  </div>
                </td>
              </tr>
            ) : apiKeys.length === 0 ? (
              <tr>
                <td colSpan={4} className={`px-6 py-8 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <div className="text-4xl mb-2">🔑</div>
                  <div className="font-medium mb-1">No API keys yet</div>
                  <div className="text-sm">Click the + button to create your first API key</div>
                </td>
              </tr>
            ) : (
              apiKeys.map((key) => (
                <tr 
                  key={key.id} 
                  className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-inset cursor-pointer`}
                  tabIndex={0}
                  onKeyDown={(e) => handleRowKeyDown(e, key)}
                  title="Press Enter to edit, V to toggle visibility, Ctrl+C to copy, Shift+Delete to delete"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{key.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{key.usage || 0}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-mono ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {visibleKeys.has(key.id) ? key.key : `${key.key.substring(0, 5)}${'•'.repeat(32)}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => toggleKeyVisibility(key.id)}
                        onKeyDown={(e) => handleButtonKeyDown(e, toggleKeyVisibility, key.id)}
                        className={`${isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'} p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded`}
                        title={visibleKeys.has(key.id) ? "Hide API key (V)" : "Show API key (V)"}
                      >
                        {visibleKeys.has(key.id) ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => onCopy(key.key)}
                        onKeyDown={(e) => handleButtonKeyDown(e, onCopy, key.key)}
                        className={`${isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'} p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded`}
                        title="Copy (Ctrl+C)"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onEdit(key)}
                        onKeyDown={(e) => handleButtonKeyDown(e, onEdit, key)}
                        className={`${isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'} p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded`}
                        title="Edit (Enter)"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(key.id)}
                        onKeyDown={(e) => handleButtonKeyDown(e, handleDelete, key.id)}
                        className={`${isDarkMode ? 'text-gray-500 hover:text-red-400' : 'text-gray-400 hover:text-red-600'} p-1 focus:outline-none focus:ring-2 focus:ring-red-500 rounded`}
                        title="Delete (Shift+Delete)"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 