import React, { useState } from 'react';
import { apiService } from '../../services/ApiService';
import type { Customer } from '../../models/Customer';
import type { Matter } from '../../models/Matter';

interface AddMatterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMatterAdded: (matter: Matter) => void;
  customers: Customer[];
}

export const AddMatterModal: React.FC<AddMatterModalProps> = ({
  isOpen,
  onClose,
  onMatterAdded,
  customers
}) => {
  const [newMatterName, setNewMatterName] = useState('');
  const [newMatterDescription, setNewMatterDescription] = useState('');
  const [newMatterCustomerId, setNewMatterCustomerId] = useState('');

  const handleAddMatter = async (e: React.FormEvent) => {
    e.preventDefault();
    const customerId = parseInt(newMatterCustomerId);
    try {
      const newMatter = await apiService.addMatter(customerId, {
        name: newMatterName,
        description: newMatterDescription,
        customerId: customerId
      });
      onMatterAdded(newMatter);
      onClose();
      setNewMatterName('');
      setNewMatterDescription('');
      setNewMatterCustomerId('');
    } catch (error) {
      console.error('Failed to add matter:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Add New Matter</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleAddMatter} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Matter Name</label>
            <input 
              type="text" 
              value={newMatterName}
              onChange={(e) => setNewMatterName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter matter name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Description</label>
            <textarea 
              value={newMatterDescription}
              onChange={(e) => setNewMatterDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Enter matter description"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Customer</label>
            <select 
              value={newMatterCustomerId}
              onChange={(e) => setNewMatterCustomerId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a customer</option>
              {customers.map(customer => (
                <option key={customer.customerId} value={customer.customerId}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 pt-4">
            <button 
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Add Matter
            </button>
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};