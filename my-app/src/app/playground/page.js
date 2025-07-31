'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Custom Hooks
import { useToast } from '../../hooks/useToast';
import { useTheme } from '../../hooks/useTheme';

// UI Components
import { Toast } from '../../components/ui/Toast';

// Dashboard Components
import { Sidebar } from '../../components/dashboard/Sidebar';
import { Header } from '../../components/dashboard/Header';

export default function PlaygroundPage() {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  
  const router = useRouter();
  
  // Custom hooks
  const { toast, showToast, hideToast } = useToast();
  const { isDarkMode, toggleDarkMode } = useTheme();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      showToast('Please enter an API key', 'error');
      return;
    }

    setIsSubmitting(true);

    // Redirect to protected page with the API key as a query parameter
    router.push(`/protected?apikey=${encodeURIComponent(apiKey.trim())}`);
  };

  // Handle input key down for Enter functionality
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Toast Notification */}
      <Toast 
        toast={toast} 
        isDarkMode={isDarkMode} 
        onClose={hideToast} 
      />

      {/* Sidebar */}
      <Sidebar isDarkMode={isDarkMode} isVisible={isSidebarVisible} />

      {/* Main content */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarVisible ? 'ml-80' : 'ml-0'}`}>
        {/* Header */}
        <div className="m-4">
          <Header 
            isDarkMode={isDarkMode} 
            onToggleDarkMode={toggleDarkMode}
            onToggleSidebar={toggleSidebar}
            isSidebarVisible={isSidebarVisible}
          />
        </div>

        {/* Content */}
        <div className="px-8 pt-2 pb-8">
          <div className="max-w-2xl mx-auto">
            {/* Page Title */}
            <div className="mb-8">
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                🚀 API Playground
              </h1>
              <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Test and validate your API keys in our secure playground environment
              </p>
            </div>

            {/* API Key Form */}
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border p-8`}>
              <div className="mb-6">
                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                  Validate API Key
                </h2>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Enter your API key below to test its validity and access permissions.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    API Key
                  </label>
                  <div className="relative">
                    <input
                      type={showKey ? 'text' : 'password'}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Enter your API key here..."
                      className={`w-full px-4 py-3 pr-12 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 text-gray-900 placeholder-gray-500'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
                      aria-label={showKey ? 'Hide API key' : 'Show API key'}
                    >
                      {showKey ? (
                        <svg className={`h-5 w-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <p className={`mt-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Your API key will be securely validated and not stored.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || !apiKey.trim()}
                    className={`px-6 py-3 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      isSubmitting || !apiKey.trim()
                        ? `${isDarkMode ? 'bg-gray-600 text-gray-400' : 'bg-gray-300 text-gray-500'} cursor-not-allowed`
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Validating...
                      </div>
                    ) : (
                      '🔍 Validate API Key'
                    )}
                  </button>

                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Press Enter to validate
                  </div>
                </div>
              </form>

              {/* Info Section */}
              <div className={`mt-8 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-blue-50'}`}>
                <div className="flex items-start">
                  <svg className={`h-5 w-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'} mt-0.5 mr-3`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className={`text-sm font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-800'} mb-1`}>
                      How it works
                    </h3>
                    <ul className={`text-sm ${isDarkMode ? 'text-blue-200' : 'text-blue-700'} space-y-1`}>
                      <li>• Enter your API key in the field above</li>
                      <li>• Click "Validate API Key" or press Enter</li>
                      <li>• We'll securely check if your key is valid</li>
                      <li>• Get instant feedback on your key's status</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 