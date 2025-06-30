import React from 'react';
import type { Customer } from '../models/Customer';
import { MatterList } from './MatterList';
import type { Matter } from '../models/Matter';

interface CustomerListProps {
  customers: Customer[];
  selectedCustomer: Customer | null;
  matters: Matter[];
  onCustomerClick: (customer: Customer) => void;
}

export const CustomerList: React.FC<CustomerListProps> = ({
  customers,
  selectedCustomer,
  matters,
  onCustomerClick
}) => {
  return (
    <div className="customers-section w-full max-w-4xl font-bold rounded-lg p-4">
      <h2 className="text-center font-normal text-3xl text-red-500">Customers</h2>
      <div className="customers-list">
        {customers.map(customer => (
          <div 
            key={customer.customerId} 
            className={`customer-item ${selectedCustomer?.customerId === customer.customerId ? 'selected' : ''}`}
            onClick={() => onCustomerClick(customer)}
          >
            <h3>{customer.name}</h3>
            <p>{customer.phoneNumber}</p>

            {selectedCustomer?.customerId === customer.customerId && (
              <MatterList 
                matters={matters.filter(matter => matter.customerId === customer.customerId)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};