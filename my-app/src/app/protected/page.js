'use client'

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Custom Hooks
import { useToast } from '../../hooks/useToast';
import { useTheme } from '../../hooks/useTheme';
import { useAPIKeys } from '../../hooks/useAPIKeys';

// UI Components
import { Toast } from '../../components/ui/Toast';

// Dashboard Components
import { Sidebar } from '../../components/dashboard/Sidebar';
import { Header } from '../../components/dashboard/Header';

export default function ProtectedPage() {
  const [isValidating, setIsValidating] = useState(true);
  const [validationResult, setValidationResult] = useState(null);
  const [hasValidated, setHasValidated] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Custom hooks
  const { toast, showToast, hideToast } = useToast();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { apiKeys, loading: apiKeysLoading } = useAPIKeys(() => {});

  // Validate API key once API keys are loaded and not validated yet
  useEffect(() => {
    if (hasValidated || apiKeysLoading) return;

    const apiKeyFromUrl = searchParams.get('apikey');

    const runValidation = async () => {
      if (!apiKeyFromUrl) {
        setValidationResult({ isValid: false, message: 'No API key provided', key: null });
        showToast('❌ Invalid API key', 'error');
        setIsValidating(false);
        setHasValidated(true);
        return;
      }

      // Simulate validation delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const foundKey = apiKeys.find((key) => key.key === apiKeyFromUrl);

      if (foundKey) {
        setValidationResult({ isValid: true, message: 'API key is valid and active', key: foundKey });
        showToast('✅ Valid API key', 'success');
      } else {
        setValidationResult({ isValid: false, message: 'API key not found or invalid', key: null });
        showToast('❌ Invalid API key', 'error');
      }

      setIsValidating(false);
      setHasValidated(true);
    };

    runValidation();
  }, [hasValidated, apiKeysLoading, apiKeys, searchParams]);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  // Go back to playground
  const goBackToPlayground = () => {
    router.push('/playground');
  };

  // Go to API Keys management
  const goToApiKeys = () => {
    router.push('/api-keys');
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
                🔒 Protected Area
              </h1>
              <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                API key validation results
              </p>
            </div>

            {/* Validation Result */}
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border p-8`}>
              {isValidating ? (
                // Loading State
                <div className="text-center py-12">
                  <div className="flex items-center justify-center mb-4">
                    <svg className={`animate-spin h-12 w-12 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Validating API Key...
                  </h2>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Please wait while we verify your credentials
                  </p>
                </div>
              ) : validationResult ? (
                // Validation Result
                <div className="text-center">
                  {validationResult.isValid ? (
                    // Valid Key
                    <div>
                      <div className="flex items-center justify-center mb-6">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <h2 className={`text-2xl font-bold text-green-600 mb-4`}>
                        ✅ API Key Valid!
                      </h2>
                      <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                        {validationResult.message}
                      </p>
                      
                      {/* Key Details */}
                      <div className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-green-50'} rounded-lg p-6 mb-6`}>
                        <h3 className={`font-semibold ${isDarkMode ? 'text-green-400' : 'text-green-800'} mb-3`}>
                          Key Details:
                        </h3>
                        <div className="space-y-2 text-left">
                          <div className="flex justify-between">
                            <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Name:</span>
                            <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {validationResult.key?.name}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Permissions:</span>
                            <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} capitalize`}>
                              {validationResult.key?.permissions}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Usage:</span>
                            <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {validationResult.key?.usage || 0} requests
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Invalid Key
                    <div>
                      <div className="flex items-center justify-center mb-6">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                      </div>
                      <h2 className={`text-2xl font-bold text-red-600 mb-4`}>
                        ❌ Invalid API Key
                      </h2>
                      <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                        {validationResult.message}
                      </p>
                      
                      {/* Error Details */}
                      <div className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-red-50'} rounded-lg p-6 mb-6`}>
                        <h3 className={`font-semibold ${isDarkMode ? 'text-red-400' : 'text-red-800'} mb-3`}>
                          Possible Issues:
                        </h3>
                        <ul className={`text-left space-y-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          <li>• API key doesn&apos;t exist in our system</li>
                          <li>• Key may have been revoked or expired</li>
                          <li>• Incorrect key format or typo</li>
                          <li>• Key belongs to a different environment</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={goBackToPlayground}
                      className={`px-6 py-3 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        isDarkMode 
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      ← Try Another Key
                    </button>
                    
                    {!validationResult.isValid && (
                      <button
                        onClick={goToApiKeys}
                        className="px-6 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Manage API Keys →
                      </button>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 