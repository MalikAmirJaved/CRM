import React, { createContext, useState, useContext } from 'react';

// Initial state for customer data
const initialState = {
  customer_GeneralDetails: {
    customer_Type: "",
    customer_PrimaryInfo: {
      salutation: "",
      firstName: "",
      lastName: "",
    },
    customer_CompanyName: "",
    customer_DisplayName: "",
    customer_Email: "",
    customer_Contact: {
      workPhone: "",
      mobilePhone: "",
    },
  },
};

// Create context
const CustomerContext = createContext();

// Provider component
export const CustomerProvider = ({ children }) => {
  const [customerData, setCustomerData] = useState(initialState);

  // Function to update customer general details
  const updateGeneralDetails = (field, value) => {
    setCustomerData((prevState) => ({
      ...prevState,
      customer_GeneralDetails: {
        ...prevState.customer_GeneralDetails,
        [field]: value,
      },
    }));
  };

  // Function to reset customer data
  const resetCustomer = () => {
    setCustomerData(initialState);
  };

  return (
    <CustomerContext.Provider value={{ customerData, updateGeneralDetails, resetCustomer }}>
      {children}
    </CustomerContext.Provider>
  );
};

// Custom hook to use the CustomerContext
export const useCustomerContext = () => useContext(CustomerContext);
