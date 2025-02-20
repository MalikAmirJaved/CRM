import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import OtherDetails from "./OtherDetails";
import { useParams } from "react-router-dom";
import Address from "./Address";
import Remarks from "./Remarks";
import ContactPersons from "./ContactPersons";
import axios from "axios";
import * as Yup from "yup";

const API_URL = process.env.REACT_APP_API_URL;
const jwtLoginToken = localStorage.getItem("jwtLoginToken");

const validationSchema = Yup.object().shape({
  customer_GeneralDetails: Yup.object().shape({
    customer_Type: Yup.string().required("Please Enter the Business"),
    customer_PrimaryInfo: Yup.object().shape({
      salutation: Yup.string().required(
        "Please enter primary contact salutation"
      ),
      firstName: Yup.string().required(
        "Please enter primary contact first Name"
      ),
      lastName: Yup.string().required("Please enter primary contact last Name"),
    }),
    customer_CompanyName: Yup.string().when("customer_Type", {
      is: "business",
      then: (schema) =>
        schema.required("Please enter the customer company Name"),
      otherwise: (schema) => schema.notRequired(),
    }),
    customer_DisplayName: Yup.string().required(
      "Please enter customer display Name"
    ),
    customer_Email: Yup.string().required("Please enter the Email"),
    customer_Contact: Yup.object().shape({
      workPhone: Yup.string().when("$customer_GeneralDetails.customer_Type", {
        is: "business",
        then: (schema) =>
          schema.required("Please enter the customer WorkPhone"),
        otherwise: (schema) => schema.notRequired(),
      }),
      mobilePhone: Yup.string().when("$customer_GeneralDetails.customer_Type", {
        is: "individual",
        then: (schema) =>
          schema.required("Please enter the customer MobilePhone"),
        otherwise: (schema) => schema.notRequired(),
      }),
    }),
  }),
  customer_OtherDetails: Yup.object().shape({
    customer_VATRegistered: Yup.boolean(),
    customer_TRN: Yup.string().when(
      "$customer_OtherDetails.customer_VATRegistered",
      {
        is: true,
        then: (schema) =>
          schema
            .required("")
            .length(15, "Customer TRN must be exactly 15 digits"),
        otherwise: (schema) => schema.notRequired(),
      }
    ),
    customer_TaxRate: Yup.number().positive("Enter positive value please"),
    customer_OpeningBalance: Yup.number().min(
      0,
      "Enter 0 or a positive value please"
    ),
  }),
});

const CustomerForm = () => {
  const [activeTab, setActiveTab] = useState("otherDetails");
  const { customerId } = useParams();
  const [customerData, setCustomerData] = useState(null);

  
  const fetchCustomerData = async () => {
    try {
        const response = await axios.get(`${API_URL}/customer/${customerId}`, {
            headers: {
                Authorization: `Bearer ${jwtLoginToken}`,
            },
        });
        if (response.data.success) {
            console.log(response.data.information.customer)
            setCustomerData(response.data.information.customer);
        }
    } catch (error) {
        console.error("Error fetching customer data:", error);
    }
    
};

useEffect(() => {
    fetchCustomerData();
}, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return ( <>
    { customerData && <div className="mx-auto">
      <div className="bg-white p-4">
        <h1 className="text-2xl font-bold mb-4">New Customer</h1>
        <div className="bg-white p-8 w-full">
          <Formik
            initialValues={{
              customer_GeneralDetails: {
                customer_Type: `${customerData.customer_GeneralDetails.customer_Type || "business"}`,
                customer_PrimaryInfo: {
                  salutation: `${customerData.customer_GeneralDetails.customer_PrimaryInfo.salutation}`,
                  firstName: `${customerData.customer_GeneralDetails.customer_PrimaryInfo.firstName}`,
                  lastName: `${customerData.customer_GeneralDetails.customer_PrimaryInfo.lastName}`,
                },
                customer_CompanyName: `${customerData.customer_GeneralDetails.customer_CompanyName}`,
                customer_DisplayName: `${customerData.customer_GeneralDetails.customer_DisplayName}`,
                customer_Email: `${customerData.customer_GeneralDetails.customer_Email}`,
                customer_Contact: {
                  workPhone: `${customerData.customer_GeneralDetails.customer_Contact.workPhone || ""}`,
                  mobilePhone: `${customerData.customer_GeneralDetails.customer_Contact.mobilePhone || ""}`,
                },
              },
              customer_OtherDetails: {
                customer_VATRegistered: `${customerData.customer_OtherDetails.customer_VATRegistered || false }`,
                customer_TRN: `${customerData.customer_OtherDetails.customer_TRN || "" }`,
                customer_CompanyId: `${customerData.customer_OtherDetails.customer_CompanyId || "" }`,
                customer_Currency: `${customerData.customer_OtherDetails.customer_Currency || "" }`,
                customer_TaxRate: `${customerData.customer_OtherDetails.customer_TaxRate || 5 }`,
                customer_OpeningBalance: `${customerData.customer_OtherDetails.customer_OpeningBalance || 0 }` ,
                customer_PaymentTerms: `${customerData.customer_OtherDetails.customer_PaymentTerms || "DueonReceipt" }`,
                customer_EnablePortal: `${customerData.customer_OtherDetails.customer_EnablePortal || false }`,
                customer_PortalLanguage: `${customerData.customer_OtherDetails.customer_PortalLanguage|| "ENGLISH" }`,
              },
              customer_Address: {
                billingAddress: {
                  billingAddress_Attention: `${customerData.customer_Address.billingAddress.billingAddress_Attention || "" }`,
                  billingAddress_Country:  `${customerData.customer_Address.billingAddress.billingAddress_Country || "" }`,
                  billingAddress_State:  `${customerData.customer_Address.billingAddress.billingAddress_State || "" }`,
                  billingAddress_Address: `${customerData.customer_Address.billingAddress.billingAddress_Address || "" }`,
                  billingAddress_City:  `${customerData.customer_Address.billingAddress.billingAddress_City || "" }`,
                  billingAddress_ZipCode: `${customerData.customer_Address.billingAddress.billingAddress_ZipCode || "" }`,
                  billingAddress_Phone: `${customerData.customer_Address.billingAddress.billingAddress_Phone || "" }`,
                  billingAddress_FaxNo: `${customerData.customer_Address.billingAddress.billingAddress_FaxNo || "" }`,
                },
                shippingAddress: {
                    shippingAddress_Attention: `${customerData.customer_Address.shippingAddress.shippingAddress_Attention || "" }`,
                    shippingAddress_Country:  `${customerData.customer_Address.shippingAddress.shippingAddress_Country || "" }`,
                    shippingAddress_State:  `${customerData.customer_Address.shippingAddress.shippingAddress_State || "" }`,
                    shippingAddress_Address: `${customerData.customer_Address.shippingAddress.shippingAddress_Address || "" }`,
                    shippingAddress_City:  `${customerData.customer_Address.shippingAddress.shippingAddress_City || "" }`,
                    shippingAddress_ZipCode: `${customerData.customer_Address.shippingAddress.shippingAddress_ZipCode || "" }`,
                    shippingAddress_Phone: `${customerData.customer_Address.shippingAddress.shippingAddress_Phone || "" }`,
                    shippingAddress_FaxNo: `${customerData.customer_Address.shippingAddress.shippingAddress_FaxNo || "" }`,
                },
              },
              customer_ContactPersons: [
                {
                  salutation:  `${customerData.customer_ContactPersons.salutation || "" }`,
                  firstName: `${customerData.customer_ContactPersons.firstName || "" }`,
                  lastName: `${customerData.customer_ContactPersons.lastName || "" }`,
                  email: `${customerData.customer_ContactPersons.email || "" }`,
                  phone: `${customerData.customer_ContactPersons.phone || "" }`,
                  designation: `${customerData.customer_ContactPersons.designation || "" }`,
                },
              ],
              customer_Remarks: `${customerData.customer_Remarks || "" }`,
            }}
            validationSchema={validationSchema}
            onSubmit={async (values,{ resetForm }) => {
              console.log(values);

              try {
                const response = await axios.post(
                  `${API_URL}/customer/add-customer`,
                  values,
                  {
                    headers: {
                      Authorization: `Bearer ${jwtLoginToken}`,
                      "Content-Type": "application/json",
                    },
                  }
                );

                if (response.data.success) alert("Customer Created");
                resetForm();
              } catch (error) {
                console.error(error);
              }
            }}
          >
             {({ touched, errors, values }) => (
            <Form className="space-y-4">
              <div>
                <div className="mb-6 flex items-center space-x-5">
                  <label className="block text-sm font-medium text-gray-700">
                    Customer Type*
                  </label>
                  <span className="ml-2 text-blue-500 relative group flex">
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
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                      Enter the Customer Type.
                    </span>
                  </span>
                  <div className="flex-1">
                    <label className="inline-flex items-center">
                      <Field
                        type="radio"
                        name="customer_GeneralDetails.customer_Type"
                        value="business"
                        className="mr-2"
                      />
                      Business
                    </label>
                    <label className="inline-flex items-center ml-6">
                      <Field
                        type="radio"
                        name="customer_GeneralDetails.customer_Type"
                        value="individual"
                        className="mr-2"
                      />
                      Individual
                    </label>
                  </div>
                  {/* <ErrorMessage
                    name="customer_GeneralDetails.customer_Type"
                    component="div"
                    className="text-red-500 text-sm"
                  /> */}
                </div>

                <div className="mb-6 flex items-center space-x-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Primary Contact*
                  </label>
                  <span className="ml-2 text-blue-500 relative group flex">
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
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                      Enter the Primary Contact Information.
                    </span>
                  </span>
                  <div className="flex gap-4 w-full">
                    <Field
                      as="select"
                      name="customer_GeneralDetails.customer_PrimaryInfo.salutation"
                      className={`w-1/6 bg-gray-50 border ${
                        touched.customer_GeneralDetails?.customer_PrimaryInfo?.salutation &&
                        errors.customer_GeneralDetails?.customer_PrimaryInfo?.salutation
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md shadow-sm p-3`}                    >
                      <option value="">Salutation</option>
                      <option value="Mr.">Mr.</option>
                      <option value="Mrs.">Mrs.</option>
                      <option value="Ms.">Ms.</option>
                      <option value="Dr.">Dr.</option>
                    </Field>
                    {/* <ErrorMessage
                      name="customer_GeneralDetails.customer_PrimaryInfo.salutation"
                      component="div"
                      className="text-red-500 text-sm"
                    /> */}
                    <Field
                      type="text"
                      name="customer_GeneralDetails.customer_PrimaryInfo.firstName"
                      className={`w-1/3 px-3 py-2 border rounded-md ${
                        touched.customer_GeneralDetails?.customer_PrimaryInfo
                          ?.firstName &&
                        errors.customer_GeneralDetails?.customer_PrimaryInfo
                          ?.firstName
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="First Name"
                    />
                    {/* <ErrorMessage
                      name="customer_GeneralDetails.customer_PrimaryInfo.firstName"
                      component="div"
                      className="text-red-500 text-sm"
                    /> */}
                    <Field
                      type="text"
                      name="customer_GeneralDetails.customer_PrimaryInfo.lastName"
                      className={`w-1/3 px-3 py-2 border rounded-md ${
                        touched.customer_GeneralDetails?.customer_PrimaryInfo
                          ?.lastName &&
                        errors.customer_GeneralDetails?.customer_PrimaryInfo
                          ?.lastName
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}                      placeholder="Last Name"
                    />
                    {/* <ErrorMessage
                      name="customer_GeneralDetails.customer_PrimaryInfo.lastName"
                      component="div"
                      className="text-red-500 text-sm"
                    /> */}
                  </div>
                </div>

                {values.customer_GeneralDetails.customer_Type ===
                  "business" && (
                  <div className="mb-6 flex items-center space-x-5">
                    <label className="block text-sm font-medium text-gray-700">
                      Company Name
                    </label>
                    <span className="ml-2 text-blue-500 relative group flex">
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
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                      Enter the Company Name
                    </span>
                  </span>
                  <div className="flex gap-4 w-full">
                    <Field
                      type="text"
                      name="customer_GeneralDetails.customer_CompanyName"
                      className={`w-1/3 px-3 py-2 border rounded-md ${
                        touched.customer_GeneralDetails?.customer_CompanyName &&
                        errors.customer_GeneralDetails?.customer_CompanyName
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}                      placeholder="Company Name"
                    />
                    {/* <ErrorMessage
                      name="customer_GeneralDetails.customer_CompanyName"
                      component="div"
                      className="text-red-500 text-sm"
                    /> */}
                    </div>
                  </div>
                )}

                <div className="mb-6 flex items-center space-x-5">
                  <label className="block text-sm font-medium text-gray-700">
                    Display Name*
                  </label>
                  <span className="ml-2 text-blue-500 relative group flex">
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
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                    Enter the Company Display Name
                    </span>
                  </span>
                  <Field
                    type="text"
                    name="customer_GeneralDetails.customer_DisplayName"
                    className={`w-1/3 px-3 py-2 border rounded-md ${
                      touched.customer_GeneralDetails?.customer_DisplayName &&
                      errors.customer_GeneralDetails?.customer_DisplayName
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}                    
                    placeholder="Display Name"
                  />
                  {/* <ErrorMessage
                    name="customer_GeneralDetails.customer_DisplayName"
                    component="div"
                    className="text-red-500 text-sm"
                  /> */}
                </div>

                <div className="mb-6 flex items-center space-x-5">
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address*
                  </label>
                  <span className="ml-2 text-blue-500 relative group flex">
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
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                      Enter the Email Address.
                    </span>
                  </span>
                  <Field
                    type="text"
                    name="customer_GeneralDetails.customer_Email"
                    className={`w-1/3 px-3 py-2 border rounded-md ${
                      touched.customer_GeneralDetails?.customer_Email &&
                      errors.customer_GeneralDetails?.customer_Email
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}                    
                    placeholder="Email Addresss"
                  />
                  {/* <ErrorMessage
                    name="customer_GeneralDetails.customer_Email"
                    component="div"
                    className="text-red-500 text-sm"
                  /> */}
                </div>

                <div className="mb-6 flex items-center space-x-5">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone*
                  </label>
                  <span className="ml-2 text-blue-500 relative group flex">
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
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                      Enter the Phone Number.
                    </span>
                  </span>
                  <Field
                    type="text"
                    name="customer_GeneralDetails.customer_Contact.workPhone"
                    className={`w-1/3 px-3 py-2 border rounded-md ${
                      touched.customer_GeneralDetails?.customer_Contact?.workPhone &&
                      errors.customer_GeneralDetails?.customer_Contact?.workPhone
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}                   
                    placeholder="WorkPhone"
                  />
                  {/* <ErrorMessage
                    name="customer_GeneralDetails.customer_Contact.workPhone"
                    component="div"
                    className="text-red-500 text-sm"
                  /> */}
                  <Field
                    type="text"
                    name="customer_GeneralDetails.customer_Contact.mobilePhone"
                    className={`w-1/3 px-3 py-2 border rounded-md ${
                      touched.customer_GeneralDetails?.customer_Contact?.mobilePhone &&
                      errors.customer_GeneralDetails?.customer_Contact?.mobilePhone
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}                    placeholder="MobilePhone"
                  />
                  {/* <ErrorMessage
                    name="customer_GeneralDetails.customer_Contact.mobilePhone"
                    component="div"
                    className="text-red-500 text-xs"
                    /> */}
                </div>

                <div className="flex items-center space-x-4"></div>

                <ul className="flex space-x-6 border-b-2 border-gray-300 pb-3 mb-6 font-">
                  <li className="nav-item">
                    <div
                      role="tab"
                      className={`cursor-pointer text-md font-medium ${
                        activeTab === "otherDetails"
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
                      className={`cursor-pointer text-md font-medium ${
                        activeTab === "address"
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
                      className={`cursor-pointer text-md font-medium ${
                        activeTab === "contactPersons"
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
                      className={`cursor-pointer text-md font-medium ${
                        activeTab === "remarks"
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
              </div>
              <button
                type="submit"
                className="px-6 py-2 ml-4 bg-gray-300 text-blue-600 rounded-md"
              >
                Submit
              </button>
            </Form> )}
          </Formik>
        </div>
      </div>
    </div>}
    </>
  );
};

export default CustomerForm;
