import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams } from "react-router-dom";
import { FaPhoneAlt } from "react-icons/fa";
import {
    createGeneralDetails,
    resetCustomer,
    setCustomerData
} from "../../../../features/customerSlice";
import OtherDetails from "./OtherDetails";
import Address from "./Address";
import Remarks from "./Remarks";
import ContactPersons from "./ContactPersons";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;
const jwtLoginToken = localStorage.getItem("jwtLoginToken");

const EditCustomer = () => {
    const dispatch = useDispatch();
    const { customerId } = useParams();
    const [activeSection, setActiveSection] = useState("OtherDetails");
    const [activeTab, setActiveTab] = useState("otherDetails");
    const customerData = useSelector((state) => state.customer);

    const fetchCustomerData = async () => {
        try {
            const response = await axios.get(`${API_URL}/customer/${customerId}`, {
                headers: {
                    Authorization: `Bearer ${jwtLoginToken}`,
                },
            });
            if (response.data.success) {
                dispatch(setCustomerData(response.data.information.customer));
            }
        } catch (error) {
            console.error("Error fetching customer data:", error);
        }
        
    };

    useEffect(() => {
        fetchCustomerData();
    }, []);

    const handleCustomerGeneralDetails = (e) => {
        dispatch(
            createGeneralDetails({ field: e.target.name, value: e.target.value })
        );
    };

    const handleSectionChange = (section) => {
        setActiveSection(section);
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        e.stopPropagation(); // Stop event bubbling

        try {
            const response = await axios.patch(
                `${API_URL}/customer/update-customer/${customerId}`,
                customerData,
                {
                    headers: {
                        Authorization: `Bearer ${jwtLoginToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.success) {
                alert("Customer updated successfully!");
                dispatch(resetCustomer());
            } else {
                alert("Failed to create customer.");
            }
        } catch (error) {
            console.error("Error submitting customer data:", error);
            alert("Error creating customer. Please try again later.");
        }
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="mx-auto">
            <div className="bg-white p-4 shadow-md">
                <h1 className="text-2xl font-bold mb-4">New Customer</h1>
                <h2 className="text-lg font-semibold mb-2">Customer Type</h2>
                <div className="bg-white p-8 w-1/2">
                    <div className="mb-6 flex items-center space-x-10">
                        <label className="block text-sm font-medium text-gray-700">
                            Customer Type
                            <span className="ml-2 text-blue-500 relative group">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    className="h-4 w-4 inline-block"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 16h-1v-4h1m0-4h-1m0 0v4h1m0 0H12m0 0h1m-1-4h.01M12 16h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <span
                                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden 
                           group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10"
                                >
                                    Choose either Business or Individual.
                                </span>
                            </span>
                        </label>
                        <div className="flex-1">
                            <label className="inline-flex items-center">
                                <input
                                    id="customer_Type_business"
                                    name="customer_Type"
                                    type="radio"
                                    value="business" // Set to literal "business"
                                    checked={customerData.customer_GeneralDetails.customer_Type === "business"}
                                    onChange={handleCustomerGeneralDetails}
                                />
                                <span className="ml-2">Business</span>
                            </label>
                            <label className="inline-flex items-center ml-6">
                                <input
                                    id="customer_Type_individual"
                                    name="customer_Type"
                                    type="radio"
                                    value="individual" // Set to literal "individual"
                                    checked={customerData.customer_GeneralDetails.customer_Type === "individual"}
                                    onChange={handleCustomerGeneralDetails}
                                />
                                <span className="ml-2">Individual</span>
                            </label>
                        </div>
                    </div>

                    {/* Primary Contact Field */}
                    <div className="mb-6 flex items-center space-x-10">
                        <label className="block text-sm font-medium text-gray-700">
                            Primary Contact
                            <span className="ml-2 text-blue-500 relative group">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    className="h-4 w-4 inline-block"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 16h-1v-4h1m0-4h-1m0 0v4h1m0 0H12m0 0h1m-1-4h.01M12 16h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <span
                                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden 
                           group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10"
                                >
                                    Enter salutation, first name, and last name.
                                </span>
                            </span>
                        </label>
                        <div className="flex-1 grid grid-cols-3 gap-4">
                            <select
                                id="salutation"
                                name="salutation"
                                value={customerData.customer_GeneralDetails.customer_PrimaryInfo.salutation}
                                onChange={handleCustomerGeneralDetails}
                                className="w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option>Salutation</option>
                                <option>Mr.</option>
                                <option>Mrs.</option>
                                <option>Ms.</option>
                                <option>Dr.</option>
                            </select>
                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                value={customerData.customer_GeneralDetails.customer_PrimaryInfo.firstName}
                                placeholder="First Name"
                                onChange={handleCustomerGeneralDetails}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />

                            <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                value={customerData.customer_GeneralDetails.customer_PrimaryInfo.lastName}
                                placeholder="Last Name"
                                onChange={handleCustomerGeneralDetails}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />

                        </div>
                    </div>

                    {/* Company Name Field */}
                    <div className="mb-6 flex items-center space-x-10">
                        <label className="block text-sm font-medium text-gray-700">
                            Company Name
                            <span className="ml-2 text-blue-500 relative group">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    className="h-4 w-4 inline-block"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 16h-1v-4h1m0-4h-1m0 0v4h1m0 0H12m0 0h1m-1-4h.01M12 16h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <span
                                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden 
                           group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10"
                                >
                                    Enter the relevant company name.
                                </span>
                            </span>
                        </label>
                        <input
                            id="customer_CompanyName"
                            name="customer_CompanyName"
                            type="text"
                            value={customerData.customer_GeneralDetails.customer_CompanyName}
                            placeholder="Company Name"
                            onChange={handleCustomerGeneralDetails}
                            className="flex-1 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"

                        />

                    </div>

                    {/* Display Name Field */}
                    <div className="mb-6 flex items-center space-x-10">
                        <label className="block text-sm font-medium text-red-600">
                            Display Name*
                            <span className="ml-2 text-blue-500 relative group">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    className="h-4 w-4 inline-block"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 16h-1v-4h1m0-4h-1m0 0v4h1m0 0H12m0 0h1m-1-4h.01M12 16h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <span
                                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden 
                           group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10"
                                >
                                    Enter a display name for the customer.
                                </span>
                            </span>
                        </label>
                        <input
                            id="customer_DisplayName"
                            name="customer_DisplayName"
                            type="text"
                            value={customerData.customer_GeneralDetails.customer_DisplayName}
                            placeholder="Display Name"
                            onChange={handleCustomerGeneralDetails}
                            className="flex-1 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                            required
                        />

                    </div>

                    {/* Email Address Field */}
                    <div className="mb-6 flex items-center space-x-10">
                        <label className="block text-sm font-medium text-gray-700">
                            Email Address
                            <span className="ml-2 text-blue-500 relative group">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    className="h-4 w-4 inline-block"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 16h-1v-4h1m0-4h-1m0 0v4h1m0 0H12m0 0h1m-1-4h.01M12 16h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <span
                                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden 
                           group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10"
                                >
                                    Enter the customer's email address.
                                </span>
                            </span>
                        </label>
                        <input
                            id="customer_Email"
                            name="customer_Email"
                            type="email"
                            value={customerData.customer_GeneralDetails.customer_Email}
                            placeholder="Email Address"
                            onChange={handleCustomerGeneralDetails}
                            className="flex-1 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />

                    </div>

                    {/* Phone Field */}
                    <div className="flex items-center space-x-10">
                        <label className="block text-sm font-medium text-gray-700">
                            Phone
                            <span className="ml-2 text-blue-500 relative group">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    className="h-4 w-4 inline-block"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 16h-1v-4h1m0-4h-1m0 0v4h1m0 0H12m0 0h1m-1-4h.01M12 16h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <span
                                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden 
                           group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10"
                                >
                                    Enter the customer's work and mobile phone numbers.
                                </span>
                            </span>
                        </label>
                        <div className="relative flex items-center">
                            <FaPhoneAlt className="absolute left-3 text-gray-500" />
                            <input
                                id="workPhone"
                                name="workPhone"
                                type="text"
                                value={customerData.customer_GeneralDetails.customer_Contact.workPhone}
                                placeholder="Work Phone"
                                onChange={handleCustomerGeneralDetails}
                                className="pl-8 flex-1 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />

                        </div>
                        <div className="relative flex items-center">
                            <FaPhoneAlt className="absolute left-3 text-gray-500" />
                            <input
                                id="mobilePhone"
                                name="mobilePhone"
                                type="text"
                                value={customerData.customer_GeneralDetails.customer_Contact.mobilePhone}
                                placeholder="Mobile Phone"
                                onChange={handleCustomerGeneralDetails}
                                className="pl-8 flex-1 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />

                        </div>
                    </div>
                </div>



                {/* Tab Navigation */}
                <ul className="flex space-x-6 border-b-2 border-gray-300 pb-3 mb-6 font-">
                    <li className="nav-item">
                        <div
                            role="tab"
                            className={`cursor-pointer text-md font-medium ${activeTab === "otherDetails"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-500 hover:text-blue-600"
                                }`}
                            onClick={() => handleTabClick("otherDetails")}
                        >
                            Other Details
                        </div>
                    </li>
                    <li className="nav-item">
                        <div
                            role="tab"
                            className={`cursor-pointer text-md font-medium ${activeTab === "address"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-500 hover:text-blue-600"
                                }`}
                            onClick={() => handleTabClick("address")}
                        >
                            Address
                        </div>
                    </li>
                    <li className="nav-item">
                        <div
                            role="tab"
                            className={`cursor-pointer text-md font-medium ${activeTab === "contactPersons"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-500 hover:text-blue-600"
                                }`}
                            onClick={() => handleTabClick("contactPersons")}
                        >
                            Contact Persons
                        </div>
                    </li>
                    <li className="nav-item">
                        <div
                            role="tab"
                            className={`cursor-pointer text-md font-medium ${activeTab === "remarks"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-500 hover:text-blue-600"
                                }`}
                            onClick={() => handleTabClick("remarks")}
                        >
                            Remarks
                        </div>
                    </li>
                </ul>

                {activeTab === "otherDetails" && <OtherDetails />}
                {activeTab === "address" && <Address />}
                {activeTab === "remarks" && <Remarks />}
                {activeTab === "contactPersons" && <ContactPersons />}

                <button
                    onClick={handleSubmit}
                    className="px-6 py-2 ml-4 bg-gray-300 text-gray-700 rounded-md"
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default EditCustomer;
