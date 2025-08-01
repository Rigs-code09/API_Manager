import { useState, useEffect, useCallback } from 'react';
import { apiKeysService, testConnection } from '../app/lib/supabase';

export const useAPIKeys = (showToast) => {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Generate a random API key
  const generateApiKey = () => {
    return 'rig-' + Array.from({length: 32}, () => Math.random().toString(36)[2] || '0').join('');
  };

  // Transform Supabase data to match component structure
  const transformKey = (key) => ({
    id: key.id,
    name: key.name,
    description: '', // Not in database, default to empty
    key: key.key, // Map from 'key' column in your database
    permissions: key.type || 'read', // Map from 'type' column in your database
    limitUsage: false, // Not in database, default to false
    monthlyLimit: 1000, // Not in database, default to 1000
    usage: key.usage || 0, // Map from 'usage' column in your database
    createdAt: key.created_at,
    updatedAt: key.created_at, // Use created_at since updated_at doesn't exist
    lastUsed: null // Not in database, default to null
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
      
      // More detailed error messages based on common issues
      let errorMessage = 'Failed to load API keys. ';
      
      if (err.message.includes('Missing Supabase environment variables')) {
        errorMessage += 'Environment variables not configured.';
      } else if (err.message.includes('relation "api_keys" does not exist')) {
        errorMessage += 'Database table not found. Please run the SQL schema.';
      } else if (err.message.includes('JWT')) {
        errorMessage += 'Invalid Supabase credentials.';
      } else if (err.message.includes('timeout')) {
        errorMessage += 'Connection timeout. Check your internet connection.';
      } else {
        errorMessage += `Details: ${err.message}`;
      }
      
      setError(errorMessage);
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
        name: formData.name,
        key: generateApiKey(), // Use 'key' column in your database
        type: formData.permissions || 'read', // Map permissions to 'type' column
        usage: 0 // Initialize usage counter
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