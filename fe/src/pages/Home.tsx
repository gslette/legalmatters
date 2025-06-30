import { useState, useEffect } from "react";
import type { Customer } from "../models/Customer";
import type { Matter } from "../models/Matter";
import { apiService } from "../services/ApiService";
import { handleLogout } from "./Login";

export const Home: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [matters, setMatters] = useState<Matter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'customers' | 'matters'>('customers');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
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
        const results = await apiService.searchMatters(searchQuery);
        setMatters(results);
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
  if (loading) return <div>Loading...</div>;
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Legal Matters Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>
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
          
          <button onClick={handleSearch}>Search</button>
          <button onClick={resetSearch}>Reset</button>
        </div>
      </div>
      <div className="content-section">
        <div className="customers-section">
          <h2>Customers {selectedCustomer && `(${selectedCustomer.name})`}</h2>
          <div className="customers-list">
            {customers.map(customer => (
              <div 
                key={customer.customerId} 
                className={`customer-item ${selectedCustomer?.customerId === customer.customerId ? 'selected' : ''}`}
                onClick={() => handleCustomerClick(customer)}
              >
                <h3>{customer.name}</h3>
                <p>{customer.phoneNumber}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="matters-section">
          <h2>Matters</h2>
          <div className="matters-list">
            {matters.map(matter => (
              <div key={matter.matterId} className="matter-item">
                <h3>{matter.name}</h3>
                <p>{matter.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};