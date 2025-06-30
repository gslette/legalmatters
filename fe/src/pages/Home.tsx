import React, { useEffect, useState } from 'react';
import { apiService } from '../services/ApiService';
import type { Customer } from '../models/Customer';
import type { Matter } from '../models/Matter';
import { CustomerList } from '../components/CustomerList';
import { AddCustomerModal } from '../components/modals/AddCustomerModal';
import { AddMatterModal } from '../components/modals/AddMatterModal';

interface HomeProps {
  onLogout: () => void;
}

export const Home: React.FC<HomeProps> = ({ onLogout }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [matters, setMatters] = useState<Matter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'customers' | 'matters'>('customers');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showMatterModal, setShowMatterModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customersData = await apiService.getCustomers();
        setCustomers(customersData);

      } catch (error) {
        console.error('Failed to fetch customers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      if (searchType === 'customers') {
        const results = await apiService.searchCustomers(searchQuery);
        setCustomers(results);
      } else {
        if (selectedCustomer?.customerId) {
          const results = await apiService.searchMattersByCustomer(selectedCustomer.customerId, searchQuery);
          setMatters(results);
        }
      }
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleCustomerClick = async (customer: Customer) => {
    setSelectedCustomer(customer);
    try {
      const customerMatters = await apiService.getMattersByCustomer(customer.customerId);
      setMatters(customerMatters);
    } catch (error) {
      console.error('Failed to fetch customer matters:', error);
    }
  };

  const resetSearch = async () => {
    setSearchQuery('');
    setSelectedCustomer(null);
    setMatters([]);
    try {
      const customersData = await apiService.getCustomers();
      setCustomers(customersData);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    }
  };

  const handleCustomerAdded = (newCustomer: Customer) => {
    setCustomers([...customers, newCustomer]);
  };

  const handleMatterAdded = (newMatter: Matter) => {
    setMatters([...matters, newMatter]);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1 className="text-4xl font-bold text-center flex-1">Legal Matters Dashboard</h1>
        <button onClick={onLogout} className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">Logout</button>
      </header>

      <div className="flex gap-4 mb-6 justify-center">
        <button 
          onClick={() => setShowCustomerModal(true)}
          className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Add New Customer
        </button>
        <button 
          onClick={() => setShowMatterModal(true)}
          className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Add New Matter
        </button>
      </div>

      <div className="search-section">
        <div className="search-controls">
          <select 
            value={searchType} 
            onChange={(e) => setSearchType(e.target.value as 'customers' | 'matters')}
          >
            <option value="customers">Search Customers</option>
            <option value="matters">Search Matters</option>
          </select>
          
          <input
            type="text"
            placeholder={`Search ${searchType}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          
          <button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">Search</button>
          <button onClick={resetSearch} className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">Reset</button>
        </div>
      </div>

      <div className="content-section flex flex-col items-center">
        <CustomerList 
          customers={customers}
          selectedCustomer={selectedCustomer}
          matters={matters}
          onCustomerClick={handleCustomerClick}
        />
      </div>

      <AddCustomerModal 
        isOpen={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        onCustomerAdded={handleCustomerAdded}
      />

      <AddMatterModal 
        isOpen={showMatterModal}
        onClose={() => setShowMatterModal(false)}
        onMatterAdded={handleMatterAdded}
        customers={customers}
      />
    </div>
  );
};