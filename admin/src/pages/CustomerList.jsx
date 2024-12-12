import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {Button } from '../components/ui/button'
import AddCustomerModal from '../components/AddCustomerModal';
import EditCustomerModal from '../components/EditCustomerModal';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState(null);

  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCustomers();
  }, [page, search]);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/pagination?page=${page}&search=${search}`, {
        headers: {  
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        }
      });
      setCustomers(response.data.customers);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching customers', error);
    }
  };

  const handleResendOTP = async (id) => {
   
    try {
      await axios.post(`http://localhost:3000/api/customers/${id}/generate-otp`, {},{
        headers: {  
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        }
      });
      alert('OTP resent successfully');
    } catch (error) {
      console.error('Error resending OTP', error);
    }
  };

  // const handleDeactivate = async (id) => {
  //   try {
  //     await axios.put(`http://localhost:3000/api/customers/${id}/deactivate`, {}, {
  //       headers: {  
  //         "Content-Type": "application/json",
  //         "Authorization": `Bearer ${token}` 
  //       }
  //     });
  //     fetchCustomers();
  //   } catch (error) {
  //     console.error('Error deactivating customer', error);
  //   }
  // };

  const handleAddCustomer = async (customerData) => {
    try {
      await axios.post('http://localhost:3000/api/create/customer', customerData, {
        headers: {  
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        }
      });
      setIsModalOpen(false);
      fetchCustomers();
    } catch (error) {
      console.error('Error adding customer', error);
    }
  };

   const handleEdit = (customer) => {
    setCustomerToEdit(customer); 
    setIsEditModalOpen(true);  
  };

  const handleSaveCustomer = async (updatedCustomer) => {
    console.log('data',updatedCustomer)
    try {
      await axios.put(`http://localhost:3000/api/customers/${updatedCustomer.customer_id}`, updatedCustomer, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      setIsEditModalOpen(false); 
      fetchCustomers();
    } catch (error) {
      console.error('Error updating customer', error);
    }
  };

  const handleNavigate = (customerId) => {
    navigate(`/customerDependants/${customerId}`);
  }
  return (
    <div className="container mx-auto px-4 sm:px-8">
      <div className="py-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold leading-tight">Customers</h2>
          <Button variant="secondary" size="lg" onClick={() => setIsModalOpen(true)}>Add Customer</Button>
        </div>
        <div className="my-2 flex sm:flex-row flex-col">
          <div className="flex flex-row mb-1 sm:mb-0">
            <div className="relative">
              <input
                type="text"
                className="appearance-none rounded-r rounded-l sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Manage Dependants
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.customer_id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{customer.first_name} {customer.other_names}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{customer.email}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{customer.contact_number}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <Button
                       onClick={()=> handleNavigate(customer.customer_id)}
                       className="bg-green-400 text-white hover:text-green-400"
                        >
                          Beneficiary
                        </Button>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <span className={`relative inline-block px-3 py-1 font-semibold ${customer.status === 'Active' ? 'text-green-900' : 'text-red-900'} leading-tight`}>
                        <span
                          aria-hidden
                          className={`absolute inset-0 ${customer.status === 'Active'? 'bg-green-200' : 'bg-red-200'} opacity-50 rounded-full`}
                        ></span>
                        <span className="relative">{customer.status === 'Active' ? 'Active' : 'Inactive'}</span>
                      </span>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <div className="flex space-x-2"> {/* Added flex container and spacing */}
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleEdit(customer)}
                          className="bg-blue-500 hover:bg-blue-600 text-white" // Improved colors
                        >
                          Edit Customer
                        </Button>
                        <Button
                          onClick={() => handleResendOTP(customer.customer_id)}
                          className="bg-green-500 hover:bg-green-600 text-white" // Improved colors
                        >
                          Request OTP
                        </Button>
                        {/* <Button
                                            variant="ghost" 
                                            size="sm"
                                            onClick={() => handleDeactivate(customer.customer_id)}
                                          >
                                            Deactivate
                                          </Button> */}
                      </div>
                    </td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between">
              <span className="text-xs xs:text-sm text-gray-900">
                Showing {customers.length} of {totalPages * 10} Entries
              </span>
              <div className="inline-flex mt-2 xs:mt-0">
                <button
                  onClick={() => setPage(page > 1 ? page - 1 : 1)}
                  className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l"
                >
                  Prev
                </button>
                <button
                  onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
                  className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
         {/* Edit Modal */}
        <EditCustomerModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveCustomer}
          customer={customerToEdit}
        />
      </div>
      <AddCustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddCustomer}
      />
    </div>
  );
};

export default CustomerList;