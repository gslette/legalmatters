import './App.css'
import { useEffect, useState } from 'react';
import { apiService } from './services/ApiService';
import type { Customer } from './models/Customer';
import type { Matter } from './models/Matter';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    try {
      const authResponse = await apiService.login(email, password);
      console.log('Login successful:', authResponse.user);
      setIsAuthenticated(true);
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Login failed:', error);
      setLoginError('Invalid email or password');
    }
  };

  const handleLogout = () => {
    apiService.logout();
    setIsAuthenticated(false);
  };

  const LoginForm: React.FC = () => (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Login</h2>
        {loginError && <div className="error">{loginError}</div>}
        
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">Login</button>
      </form>
    </div>
  );

  const Home: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [matters, setMatters] = useState<Matter[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState<'customers' | 'matters'>('customers');
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [showMatterModal, setShowMatterModal] = useState(false);
    const [newCustomerName, setNewCustomerName] = useState('');
    const [newCustomerPhone, setNewCustomerPhone] = useState('');
    const [newMatterName, setNewMatterName] = useState('');
    const [newMatterDescription, setNewMatterDescription] = useState('');
    const [newMatterCustomerId, setNewMatterCustomerId] = useState('');

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

    const handleAddCustomer = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const newCustomer = await apiService.addCustomer({
          name: newCustomerName,
          phoneNumber: newCustomerPhone
        });
        setCustomers([...customers, newCustomer]);
        setShowCustomerModal(false);
        setNewCustomerName('');
        setNewCustomerPhone('');
      } catch (error) {
        console.error('Failed to add customer:', error);
      }
    };

    const handleAddMatter = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const newMatter = await apiService.addMatter({
          name: newMatterName,
          description: newMatterDescription,
          customerId: parseInt(newMatterCustomerId)
        });
        setMatters([...matters, newMatter]);
        setShowMatterModal(false);
        setNewMatterName('');
        setNewMatterDescription('');
        setNewMatterCustomerId('');
      } catch (error) {
        console.error('Failed to add matter:', error);
      }
    };

    if (loading) return <div>Loading...</div>;

    return (
      <div className="dashboard">
        <header className="dashboard-header">
          <h1 className="text-4xl font-bold text-center flex-1">Legal Matters Dashboard</h1>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">Logout</button>
        </header>

        <div className="flex gap-4 mb-6 justify-center">
          <button 
            onClick={() => setShowCustomerModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Add New Customer
          </button>
          <button 
            onClick={() => setShowMatterModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
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

          {/* <div className="matters-section">
            <h2>Matters</h2>
            <div className="matters-list">
              {matters.map(matter => (
                <div key={matter.matterId} className="matter-item">
                  <h3>{matter.name}</h3>
                  <p>{matter.description}</p>
                </div>
              ))}
            </div>
          </div> */}
        </div>

        {/* Customer Modal */}
        {showCustomerModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Add New Customer</h2>
                <button 
                  onClick={() => setShowCustomerModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleAddCustomer} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Name</label>
                  <input 
                    type="text" 
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter customer name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Phone Number</label>
                  <input 
                    type="tel" 
                    value={newCustomerPhone}
                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter customer phone number"
                    required
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <button 
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    Add Customer
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowCustomerModal(false)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Matter Modal */}
        {showMatterModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Add New Matter</h2>
                <button 
                  onClick={() => setShowMatterModal(false)}
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
                    onClick={() => setShowMatterModal(false)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  return isAuthenticated ? <Home /> : <LoginForm />;

  //return <Home />;
}

export default App
