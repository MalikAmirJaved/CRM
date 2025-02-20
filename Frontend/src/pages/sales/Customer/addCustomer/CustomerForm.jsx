import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  createGeneralDetails,
  resetCustomer,
} from "../../../../features/customerSlice";
import axios from "axios";
import * as Yup from "yup";

const API_URL = process.env.REACT_APP_API_URL;
const jwtLoginToken = localStorage.getItem("jwtLoginToken");

const CustomerForm = () => {
  const dispatch = useDispatch();
  const customerData = useSelector((state) => state.customer);
  const [errors, setErrors] = useState({}); // To hold form validation errors

  // Yup validation schema for the form fields
  const validationSchema = Yup.object({
    customer_Type: Yup.string().required("Customer Type is required"),
  
    customer_PrimaryInfo: Yup.object({
      salutation: Yup.string().required("Salutation is required"),
      firstName: Yup.string().required("First Name is required"),
      lastName: Yup.string().required("Last Name is required"),
    }).required("Primary Contact information is required"),
  
    customer_CompanyName: Yup.string().required("Company Name is required"),
    customer_DisplayName: Yup.string().required("Display Name is required"),
    customer_Email: Yup.string()
      .email("Invalid email address")
      .required("Email Address is required"),
  
    customer_Contact: Yup.object({
      workPhone: Yup.string().required("Work Phone is required"),
      mobilePhone: Yup.string().required("Mobile Phone is required"),
    }).required("Contact information is required"),
  });
  

  const handleCustomerGeneralDetails = (e) => {
    dispatch(
      createGeneralDetails({ field: e.target.name, value: e.target.value })
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Validate the whole customer data object
      await validationSchema.validate(customerData, {
        abortEarly: false,
      });
      setErrors({}); // Clear previous errors
  
      // Proceed with form submission after validation
      const response = await axios.post(
        `${API_URL}/customer/add-customer`,
        customerData,
        {
          headers: {
            Authorization: `Bearer ${jwtLoginToken}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.data.success) {
        alert("Customer created successfully!");
        dispatch(resetCustomer());
      } else {
        alert("Failed to create customer.");
      }
    } catch (error) {
      if (error.name === "ValidationError") {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors); // Set validation errors
      } else {
        console.error("Error submitting customer data:", error);
        alert("Error creating customer. Please try again later.");
      }
    }
  };
  
  return (
    <div className="">
      <div className="bg-white p-4">
        <h1 className="text-2xl font-bold mb-4">New Customer</h1>
        <div className="bg-white p-8 w-full">
          <form onSubmit={handleSubmit}>
            {/* Customer Type */}


            <div className="mb-6 flex items-center space-x-5">
              <label className="block text-sm font-medium text-gray-700">
                Customer Type*
              </label>
              <div className="flex-1">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="customer_Type"
                    value="business"
                    checked={customerData.customer_GeneralDetails.customer_Type === "business"}
                    onChange={handleCustomerGeneralDetails}
                    className="mr-2"
                  />
                  <span>Business</span>
                </label>
                <label className="inline-flex items-center ml-6">
                  <input
                    type="radio"
                    name="customer_Type"
                    value="individual"
                    checked={customerData.customer_GeneralDetails.customer_Type === "individual"}
                    onChange={handleCustomerGeneralDetails}
                    className="mr-2"
                  />
                  <span>Individual</span>
                </label>
              </div>
            </div>

            {/* Primary Contact */}
            <div className="mb-6 flex items-center space-x-5">
              <label className="block text-sm font-medium text-gray-700">Primary Contact*</label>
              <div className="flex gap-4">
                <select
                  name="salutation"
                  value={customerData.customer_GeneralDetails.customer_PrimaryInfo.salutation}
                  onChange={handleCustomerGeneralDetails}
                  className="w-1/2 bg-gray-50 border border-gray-300 rounded-md shadow-sm p-3"
                >
                  <option value="">Salutation</option>
                  <option value="Mr.">Mr.</option>
                  <option value="Mrs.">Mrs.</option>
                  <option value="Ms.">Ms.</option>
                  <option value="Dr.">Dr.</option>
                </select>
                {errors.customer_PrimaryInfo?.salutation && <div className="text-red-600 text-sm">{errors.customer_PrimaryInfo.salutation}</div>}
                <input
                  type="text"
                  placeholder="First Name"
                  name="firstName"
                  value={customerData.customer_GeneralDetails.customer_PrimaryInfo.firstName}
                  onChange={handleCustomerGeneralDetails}
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-md"
                />
                {errors.customer_PrimaryInfo?.firstName && <div className="text-red-600 text-sm">{errors.customer_PrimaryInfo.firstName}</div>}
                <input
                  type="text"
                  placeholder="Last Name"
                  name="lastName"
                  value={customerData.customer_GeneralDetails.customer_PrimaryInfo.lastName}
                  onChange={handleCustomerGeneralDetails}
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-md"
                />
                {errors.customer_PrimaryInfo?.lastName && <div className="text-red-600 text-sm">{errors.customer_PrimaryInfo.lastName}</div>}
              </div>
            </div>

            {/* Company Name */}
            <div className="mb-6 flex items-center space-x-5">
              <label className="block text-sm font-medium text-gray-700">Company Name*</label>
              <input
                type="text"
                placeholder="Company Name"
                name="customer_CompanyName"
                value={customerData.customer_GeneralDetails.customer_CompanyName}
                onChange={handleCustomerGeneralDetails}
                className="w-1/4 px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.customer_CompanyName && <div className="text-red-600 text-sm">{errors.customer_CompanyName}</div>}
            </div>

            {/* Display Name */}
            <div className="mb-6 flex items-center space-x-5">
              <label className="block text-sm font-medium text-gray-700">Display Name*</label>
              <input
                type="text"
                placeholder="Display Name"
                name="customer_DisplayName"
                value={customerData.customer_GeneralDetails.customer_DisplayName}
                onChange={handleCustomerGeneralDetails}
                className="w-1/4 px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.customer_DisplayName && <div className="text-red-600 text-sm">{errors.customer_DisplayName}</div>}
            </div>

            {/* Email Address */}
            <div className="mb-6 flex items-center space-x-5">
              <label className="block text-sm font-medium text-gray-700">Email Address*</label>
              <input
                type="email"
                placeholder="Email Address"
                name="customer_Email"
                value={customerData.customer_GeneralDetails.customer_Email}
                onChange={handleCustomerGeneralDetails}
                className="w-1/4 px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.customer_Email && <div className="text-red-600 text-sm">{errors.customer_Email}</div>}
            </div>

            {/* Phone Fields */}
            <div className="mb-6 flex items-center space-x-5">
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                placeholder="Work Phone"
                name="workPhone"
                value={customerData.customer_GeneralDetails.customer_Contact.workPhone}
                onChange={handleCustomerGeneralDetails}
                className="w-1/4 px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.customer_Contact?.workPhone && <div className="text-red-600 text-sm">{errors.customer_Contact.workPhone}</div>}

              <input
                type="text"
                placeholder="Mobile Phone"
                name="mobilePhone"
                value={customerData.customer_GeneralDetails.customer_Contact.mobilePhone}
                onChange={handleCustomerGeneralDetails}
                className="w-1/4 px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.customer_Contact?.mobilePhone && <div className="text-red-600 text-sm">{errors.customer_Contact.mobilePhone}</div>}
            </div>

            <button type="submit" className="px-6 py-2 ml-4 bg-gray-300 text-blue-600 rounded-md">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerForm;
