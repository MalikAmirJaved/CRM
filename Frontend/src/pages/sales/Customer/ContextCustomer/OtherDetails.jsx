import React, { useEffect } from "react";
import { Field, ErrorMessage, useFormikContext } from "formik";

const OtherDetails = () => {
  const { values, touched, errors } = useFormikContext();
  
  return (
    <>
      <div className="bg-white p-8 w-1/2">
        {/* VAT Registered */}
        {values.customer_GeneralDetails.customer_Type === "business" && (
          <div className="mb-6 flex items-center space-x-10">
            <label className="block text-sm font-medium text-gray-700 flex">
              VAT Registered
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
                  Check if VAT Registered.
                </span>
              </span>
            </label>
            <Field
              type="checkbox"
              name="customer_OtherDetails.customer_VATRegistered"
              className="form-checkbox h-5 w-5 text-indigo-600"
            />
            <ErrorMessage
              name="customer_OtherDetails.customer_VATRegistered"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>
        )}

        {/* TRN# Field */}
        {values.customer_GeneralDetails.customer_Type === "business" &&
          values.customer_OtherDetails.customer_VATRegistered === true &&
            (
              <div className="mb-6 flex items-center space-x-10">
                <label className="block text-sm font-medium text-gray-700 flex">
                  TRN#
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
                      Enter the TRN Number.
                    </span>
                  </span>
                </label>
                <Field
                  type="text"
                  name="customer_OtherDetails.customer_TRN"
                  className={`flex-1 mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                    touched.customer_OtherDetails?.customer_TRN ||
                    errors.customer_OtherDetails?.customer_TRN
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="15 digits"
                />
                <ErrorMessage
                  name="customer_OtherDetails.customer_TRN"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
            )}

        {values.customer_GeneralDetails.customer_Type === "business" && (
          <div className="mb-6 flex items-center space-x-10">
            <label className="block text-sm font-medium text-gray-700">
              Company ID
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
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                  Enter the Company ID.
                </span>
              </span>
            </label>
            <Field
              type="text"
              name="customer_OtherDetails.customer_CompanyId"
              className="flex-1 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Company ID"
            />
          </div>
        )}
        {/* Currency Field */}
        <div className="mb-6 flex items-center space-x-10">
          <label className="flex text-sm font-medium text-gray-700">
            Currency
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
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                This is preset to AED - UAE Dirham.
              </span>
            </span>
          </label>
          <Field
            as="select"
            name="customer_OtherDetails.customer_Currency"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="AED">AED - UAE Dirham</option>
            <option value="USD">USD - US Dollar</option>
          </Field>
        </div>

        {/* Tax Rate Field */}
        <div className="mb-6 flex items-center space-x-10">
          <label className="flex text-sm font-medium text-gray-700">
            Tax Rate
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
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                Enter Tax Rate.
              </span>
            </span>
          </label>
          <Field
            type="text"
            name="customer_OtherDetails.customer_TaxRate"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Tax Rate"
          />
          <ErrorMessage
            name="customer_OtherDetails.customer_TaxRate"
            component="div"
            className="text-red-500 text-sm"
          />
        </div>

        {/* Opening Balance Field */}
        <div className="mb-6 flex items-center space-x-10">
          <label className="block text-sm font-medium text-gray-700">
            Opening Balance
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
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                Opening balance is set to AED.
              </span>
            </span>
          </label>
          <div className="flex items-center border rounded-md shadow-sm border-gray-300">
            <Field
              type="number"
              name="customer_OtherDetails.customer_OpeningBalance"
              className="flex-1  block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter amount"
            />
          </div>
          <ErrorMessage
            name="customer_OtherDetails.customer_OpeningBalance"
            component="div"
            className="text-red-500 text-sm"
          />
        </div>

        <div className="mb-6 flex items-center space-x-10">
          <label className="block text-sm font-medium text-gray-700">
            Payment Terms
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
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                Select the Payment Terms for this customer.
              </span>
            </span>
          </label>
          <Field
            as="select"
            name="customer_OtherDetails.customer_PaymentTerms"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="DueonReceipt">Due on Receipt</option>
            <option value="Net15">Net 15</option>
            <option value="Net30">Net 30</option>
            <option value="Net45">Net 45</option>
            <option value="Net60">Net 60</option>
            <option value="DueEndofMonth">Due End of Month</option>
            <option value="DueEndofNextMonth">Due End of Next Month</option>
          </Field>
        </div>

        <div className="mb-6 flex items-center space-x-10">
          <label className="block text-sm font-medium text-gray-700">
            Enable Portal?
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
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                Enable portal access for this customer.
              </span>
            </span>
          </label>
          <div className="flex items-center space-x-2 flex-1">
            <Field
              type="checkbox"
              name="customer_OtherDetails.customer_EnablePortal"
              className="form-checkbox text-blue-600"
            />
            <span className="text-sm text-gray-600">Allow portal access</span>
          </div>
        </div>

        {/* Portal Language Field */}
        <div className="mb-6 flex items-center space-x-10">
          <label className="block text-sm font-medium text-gray-700">
            Portal Language
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
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                Select the Portal Language
              </span>
            </span>
          </label>
          <Field
            as="select"
            name="customer_OtherDetails.customer_PaymentTerms"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="ENGLISH">ENGLISH</option>
          </Field>
        </div>

        {/* Documents Field
<div className="mb-6 flex items-center space-x-10">
  <label className="block text-sm font-medium text-gray-700">
    Documents
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
      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
        Upload supporting documents (max 10 files, 10MB each).
      </span>
    </span>
  </label>
  <div className="flex flex-col items-center space-y-2 flex-1">
    <label
      htmlFor="file-upload"
      className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 focus:outline-none"
    >
      Upload File
    </label>
    <input
      id="file-upload"
      type="file"
      className="hidden"
      multiple
      accept="image/gif,image/jpeg,image/png,image/bmp,application/pdf,application/doc,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/xml,text/csv,.xml,text/xml"
    />
    <p className="text-gray-500 text-sm mt-1">
      You can upload a maximum of 10 files, 10MB each.
    </p>
  </div>
</div> */}

        {/* Customer Owner */}
        <div className="form-group mt-6">
          <div className="text-sm text-gray-600">
            <strong>Customer Owner:</strong> Assign a user as the customer owner
            to provide access only to the data of this customer.
            <a href="#" className="text-blue-600 hover:underline">
              Learn More
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default OtherDetails;
