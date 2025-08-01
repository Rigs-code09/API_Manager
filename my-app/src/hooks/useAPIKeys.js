import { useState, useEffect, useCallback } from 'react';
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
    description: key.description || '', // Map from database
    key: key.api_key, // Map from 'api_key' column in database
    permissions: key.permissions || 'read', // Map from 'permissions' column
    limitUsage: key.limit_usage || false, // Map from database
    monthlyLimit: key.monthly_limit || 1000, // Map from database
    usage: key.usage_count || 0, // Map from 'usage_count' column
    createdAt: key.created_at,
    updatedAt: key.updated_at || key.created_at, // Use updated_at if available
    lastUsed: key.last_used // Map from database
  });

  // Load API keys from Supabase
  const loadApiKeys = useCallback(async () => {
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
  }, [showToast]);

  // Create new API key
  const createApiKey = async (formData) => {
    try {
      setError(null);
      const newKeyData = {
        ...formData,
        api_key: generateApiKey() // Use 'api_key' for database
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
  }, [loadApiKeys]);

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