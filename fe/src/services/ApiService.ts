import axios, { type AxiosInstance } from 'axios';
import type { AuthResponse } from '../models/AuthResponse';
import type { Customer } from '../models/Customer';
import type { Matter } from '../models/Matter';
import type { User } from '../models/User';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: 'https://localhost:5001/api', // Your .NET API URL
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle auth errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth methods
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.api.post('/auth/login', { email, password });
    const { token } = response.data;
    localStorage.setItem('authToken', token);
    return response.data;
  }

  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    const response = await this.api.post('/auth/register', { email, password, name });
    return response.data;
  }

  logout(): void {
    localStorage.removeItem('authToken');
  }

  // Protected API calls
  async getCustomers(): Promise<Customer[]> {
    const response = await this.api.get('/customers');
    return response.data;
  }

  async getMatters(): Promise<Matter[]> {
    const response = await this.api.get('/matters');
    return response.data;
  }

  async getUsers(): Promise<User[]> {
    const response = await this.api.get('/users');
    return response.data;
  }

  // Search methods
  async searchCustomers(query: string): Promise<Customer[]> {
    const response = await this.api.get(`/customers/search?q=${encodeURIComponent(query)}`);
    return response.data;
  }

  async searchMatters(query: string): Promise<Matter[]> {
    const response = await this.api.get(`/matters/search?q=${encodeURIComponent(query)}`);
    return response.data;
  }

  async getMattersByCustomer(customerId: number): Promise<Matter[]> {
    const response = await this.api.get(`/customers/${customerId}/matters`);
    return response.data;
  }

  // Create methods
  async addCustomer(customer: { name: string; phoneNumber: string }): Promise<Customer> {
    const response = await this.api.post('/customers', customer);
    return response.data;
  }

  async addMatter(matter: { name: string; description: string; customerId: number }): Promise<Matter> {
    const response = await this.api.post('/matters', matter);
    return response.data;
  }
}

export const apiService = new ApiService();