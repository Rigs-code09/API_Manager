'use client'

import { useState, useEffect } from 'react';

// Custom Hooks
import { useToast } from '../../hooks/useToast';
import { useTheme } from '../../hooks/useTheme';
import { useAPIKeys } from '../../hooks/useAPIKeys';

// UI Components
import { Toast } from '../../components/ui/Toast';
import { ErrorMessage } from '../../components/ui/ErrorMessage';

// Dashboard Components
import { Sidebar } from '../../components/dashboard/Sidebar';
import { Header } from '../../components/dashboard/Header';
import { PlanCard } from '../../components/dashboard/PlanCard';
import { APIKeyTable } from '../../components/dashboard/APIKeyTable';
import { APIKeyForm } from '../../components/dashboard/APIKeyForm';

export default function ApiKeysPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  
  // Custom hooks
  const { toast, showToast, hideToast } = useToast();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { 
    apiKeys, 
    loading, 
    error, 
    setError,
    createApiKey, 
    updateApiKey, 
    deleteApiKey, 
    testConnectionHandler 
  } = useAPIKeys(showToast);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (event) => {
      // Don't trigger shortcuts when typing in inputs or textareas
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.tagName === 'SELECT') {
        return;
      }

      // Handle global shortcuts
      switch (true) {
        case (event.ctrlKey || event.metaKey) && event.key === 'n':
          event.preventDefault();
          openModal();
          break;
        case (event.ctrlKey || event.metaKey) && event.key === 'd':
          event.preventDefault();
          toggleDarkMode();
          break;
        case event.key === 't' && !event.ctrlKey && !event.metaKey:
          event.preventDefault();
          testConnectionHandler();
          break;
        case event.key === 's' && !event.ctrlKey && !event.metaKey:
          event.preventDefault();
          toggleSidebar();
          break;
        case event.key === 'Escape':
          if (isModalOpen) {
            closeModal();
          }
          if (error) {
            setError(null);
          }
          break;
        case event.key === '?' || (event.shiftKey && event.key === '/'):
          event.preventDefault();
          showKeyboardShortcuts();
          break;
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isModalOpen, error, toggleDarkMode, testConnectionHandler]);

  // Show keyboard shortcuts
  const showKeyboardShortcuts = () => {
    showToast(`
      🚀 Keyboard Shortcuts:
      • Ctrl+N: New API Key
      • Ctrl+D: Toggle Dark Mode  
      • T: Test Connection
      • S: Toggle Sidebar
      • Esc: Close Modal/Error
      • ?: Show Shortcuts
      
      📋 Table Navigation:
      • Enter: Edit selected key
      • V: Toggle key visibility
      • Ctrl+C: Copy key
      • Shift+Delete: Delete key
    `, 'info', 8000);
  };

  // Handle modal opening
  const openModal = (key = null) => {
    setEditingKey(key);
    setIsModalOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (formData) => {
    if (editingKey) {
      return await updateApiKey(editingKey.id, formData);
    } else {
      return await createApiKey(formData);
    }
  };

  // Copy API key to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast('📋 Copied to clipboard!', 'success');
  };

  // Close modal
  const closeModal = () => {
    setEditingKey(null);
    setIsModalOpen(false);
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

      {/* Keyboard Shortcuts Help */}
      <div className={`fixed bottom-4 right-4 z-40 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Press <kbd className={`px-1 py-0.5 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>?</kbd> for shortcuts
      </div>

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
          {/* Error Message */}
          <ErrorMessage 
            error={error} 
            isDarkMode={isDarkMode} 
            onClose={() => setError(null)} 
            onTestConnection={testConnectionHandler} 
          />

          {/* Plan Card */}
          <PlanCard apiKeysCount={apiKeys.length} />

          {/* API Keys Table */}
          <APIKeyTable 
            apiKeys={apiKeys}
            loading={loading}
            isDarkMode={isDarkMode}
            onEdit={openModal}
            onDelete={deleteApiKey}
            onCopy={copyToClipboard}
            onTestConnection={testConnectionHandler}
            onCreateNew={() => openModal()}
          />
        </div>
      </div>

      {/* Modal Form */}
      <APIKeyForm 
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        editingKey={editingKey}
        isDarkMode={isDarkMode}
      />
    </div>
  );
} 