import { useState, useEffect } from 'react';
import { apiKeysService, testConnection } from '../app/lib/supabase';

export const useAPIKeys = (showToast) => {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Generate a random API key
  const generateApiKey = () => {
    return 'tvly-' + Array.from({length: 32}, () => Math.random().toString(36)[2] || '0').join('');
  };

  // Transform Supabase data to match component structure
  const transformKey = (key) => ({
    id: key.id,
    name: key.name,
    description: '', // Not in database
    key: key.key, // Use 'key' column from database
    permissions: key.type, // Use 'type' column for permissions
    limitUsage: false, // Not in database
    monthlyLimit: 1000, // Not in database
    usage: key.usage,
    createdAt: key.created_at,
    updatedAt: key.created_at, // Use created_at since no updated_at
    lastUsed: null // Not in database
  });

  // Load API keys from Supabase
  const loadApiKeys = async () => {
    try {
      setLoading(true);
      setError(null);
      const keys = await apiKeysService.getAll();
      const transformedKeys = keys.map(transformKey);
      setApiKeys(transformedKeys);
    } catch (err) {
      console.error('Error loading API keys:', err);
      setError('Failed to load API keys. Please try again.');
      showToast('❌ Failed to load API keys', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Create new API key
  const createApiKey = async (formData) => {
    try {
      setError(null);
      const newKeyData = {
        ...formData,
        key: generateApiKey()
      };
      
      const createdKey = await apiKeysService.create(newKeyData);
      const transformedKey = transformKey(createdKey);
      
      setApiKeys([transformedKey, ...apiKeys]);
      showToast('🎉 API key created successfully!', 'success');
      return true;
    } catch (err) {
      console.error('Error saving API key:', err);
      setError('Failed to save API key. Please try again.');
      showToast('❌ Failed to save API key', 'error');
      return false;
    }
  };

  // Update existing API key
  const updateApiKey = async (id, formData) => {
    try {
      setError(null);
      const updatedKey = await apiKeysService.update(id, formData);
      const transformedKey = transformKey(updatedKey);
      
      setApiKeys(apiKeys.map(key => 
        key.id === id ? transformedKey : key
      ));
      showToast('✏️ API key updated successfully!', 'success');
      return true;
    } catch (err) {
      console.error('Error updating API key:', err);
      setError('Failed to update API key. Please try again.');
      showToast('❌ Failed to update API key', 'error');
      return false;
    }
  };

  // Delete API key
  const deleteApiKey = async (id) => {
    try {
      setError(null);
      await apiKeysService.delete(id);
      setApiKeys(apiKeys.filter(key => key.id !== id));
      showToast('🗑️ API key deleted successfully!', 'success');
      return true;
    } catch (err) {
      console.error('Error deleting API key:', err);
      setError('Failed to delete API key. Please try again.');
      showToast('❌ Failed to delete API key', 'error');
      return false;
    }
  };

  // Test Supabase connection
  const testConnectionHandler = async () => {
    try {
      setError(null);
      const result = await testConnection();
      if (result.success) {
        showToast('✅ Supabase connection successful!', 'success');
      } else {
        setError(`Connection failed: ${result.error}`);
      }
    } catch (err) {
      setError(`Connection test failed: ${err.message}`);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadApiKeys();
  }, []);

  return {
    apiKeys,
    loading,
    error,
    setError,
    createApiKey,
    updateApiKey,
    deleteApiKey,
    testConnectionHandler,
    loadApiKeys
  };
}; 