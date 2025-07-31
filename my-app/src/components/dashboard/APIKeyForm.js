import { useState, useEffect, useRef } from 'react';
import { Modal } from '../ui/Modal';

export const APIKeyForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingKey, 
  isDarkMode 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    permissions: 'read'
  });
  const nameInputRef = useRef(null);

  // Update form data when editing key changes
  useEffect(() => {
    if (editingKey) {
      setFormData({
        name: editingKey.name,
        permissions: editingKey.permissions
      });
    } else {
      setFormData({
        name: '',
        permissions: 'read'
      });
    }
  }, [editingKey]);

  // Focus the first input when modal opens
  useEffect(() => {
    if (isOpen && nameInputRef.current) {
      setTimeout(() => nameInputRef.current.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onSubmit(formData);
    if (success) {
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({ name: '', permissions: 'read' });
    onClose();
  };

  // Handle keyboard events for form inputs
  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
      e.preventDefault();
      // Submit directly if name is valid
      if (formData.name.trim()) {
        handleSubmit(e);
      }
    }
  };

  const handleSelectKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Submit the form when Enter is pressed on select
      if (formData.name.trim()) {
        handleSubmit(e);
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={editingKey ? 'Edit API key' : 'Create a new API key'}
      subtitle={editingKey ? 'Update the settings for your API key.' : 'Enter a name and type for the new API key.'}
      isDarkMode={isDarkMode}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
            Key Name — <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} font-normal`}>A unique name to identify this key</span>
          </label>
          <input
            ref={nameInputRef}
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            onKeyDown={handleInputKeyDown}
            className={`w-full px-4 py-3 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 text-gray-900'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            placeholder="Key Name"
          />
        </div>

        <div>
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
            Type/Permissions
          </label>
          <select
            value={formData.permissions}
            onChange={(e) => setFormData({ ...formData, permissions: e.target.value })}
            onKeyDown={handleSelectKeyDown}
            className={`w-full px-4 py-3 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 text-gray-900'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
          >
            <option value="read">Read Only</option>
            <option value="write">Read & Write</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        
        <div className="flex justify-center space-x-4 pt-4">
          <button
            type="submit"
            className="px-8 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {editingKey ? 'Update' : 'Create'}
          </button>
          <button
            type="button"
            onClick={handleClose}
            className={`px-8 py-3 text-sm font-medium ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2`}
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}; 