import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { createOtherDetails } from "../../../../features/customerSlice";
import { ErrorMessage, Field } from "formik";

const OtherDetails = () => {
  const dispatch = useDispatch();
  const customerData = useSelector((state) => state.customer);

  const handleOtherDetails = (e) => {
    const { name, value, type, checked } = e.target;
    dispatch(
      createOtherDetails({
        field: name,
        value: type === "checkbox" ? checked : value,
      })
    );
  };

  return (
    <>
      <div className="bg-white p-8 w-2/3">
        {/* TRN# Field */}
        
        {customerData?.customer_GeneralDetails.customer_Type === "business" && (
          <div className="mb-6 flex items-center space-x-10">
            <label className="block text-sm font-medium text-gray-700">
              TRN#
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
                  Enter the TRN Number.
                </span>
              </span>
            </label>
            <Field
              id="customer_TRN"
              type="text"
              placeholder="TRN#"
              name="customer_TRN"
              value={customerData.customer_OtherDetails.customer_TRN}
              onChange={handleOtherDetails}
              className="flex-1 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {/* <ErrorMessage
              name="customer_OtherDetails.customer_TRN"
              component="div"
              className="text-red-600"
            /> */}
          </div>
        )}

        {/* Company ID Field */}
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
          <input
            id="customer_CompanyId"
            name="customer_CompanyId"
            type="text"
            value={customerData.customer_OtherDetails.customer_CompanyId}
            onChange={handleOtherDetails}
            placeholder="Company ID"
            className="flex-1 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

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
          <select
            id="customer_Currency"
            name="customer_Currency"
            value={customerData.customer_OtherDetails.customer_Currency}
            onChange={handleOtherDetails}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="AED">AED - UAE Dirham</option>
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="INR">INR - Indian Rupee</option>
            <option value="JPY">JPY - Japanese Yen</option>
            <option value="CAD">CAD - Canadian Dollar</option>
            <option value="AUD">AUD - Australian Dollar</option>
            <option value="CHF">CHF - Swiss Franc</option>
            <option value="CNY">CNY - Chinese Yuan</option>
            <option value="BRL">BRL - Brazilian Real</option>
            <option value="ZAR">ZAR - South African Rand</option>
            <option value="SAR">SAR - Saudi Riyal</option>
            <option value="PKR">PKR - Pakistani Rupee</option>
            <option value="MXN">MXN - Mexican Peso</option>
            <option value="RUB">RUB - Russian Ruble</option>
            <option value="NZD">NZD - New Zealand Dollar</option>
            <option value="TRY">TRY - Turkish Lira</option>
            <option value="SEK">SEK - Swedish Krona</option>
            <option value="NOK">NOK - Norwegian Krone</option>
            <option value="DKK">DKK - Danish Krone</option>
            <option value="HUF">HUF - Hungarian Forint</option>
            <option value="SGD">SGD - Singapore Dollar</option>
          </select>
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
                Select the applicable Tax Rate.
              </span>
            </span>
          </label>
          <input
            id="customer_TaxRate"
            name="customer_TaxRate"
            type="text"
            value={customerData.customer_OtherDetails.customer_TaxRate}
            onChange={handleOtherDetails}
            placeholder="Tax Rate"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
            <span className="text-sm font-medium bg-gray-200 text-gray-700 p-2 rounded-l-md">
              AED
            </span>
            <input
              id="customer_OpeningBalance"
              name="customer_OpeningBalance"
              type="number"
              value={customerData.customer_OtherDetails.customer_OpeningBalance}
              onChange={handleOtherDetails}
              placeholder="Enter amount"
              className="flex-1  block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
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
          <select
            id="customer_PaymentTerms"
            name="customer_PaymentTerms"
            value={customerData.customer_OtherDetails.customer_PaymentTerms}
            onChange={handleOtherDetails}
            className="flex-1 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="Net15">Net 15</option>
            <option value="Net30">Net 30</option>
            <option value="Net45">Net 45</option>
            <option value="Net60">Net 60</option>
            <option value="DueonRecipt">Due on Receipt</option>
            <option value="DueEndofMonth">Due End of Month</option>
            <option value="DueEndofNextMonth">Due End of Next Month</option>
          </select>
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
            <input
              id="customer_EnablePortal"
              name="customer_EnablePortal"
              type="checkbox"
              checked={customerData.customer_OtherDetails.customer_EnablePortal}
              onChange={handleOtherDetails}
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
                Select the preferred portal language.
              </span>
            </span>
          </label>
          <select
            id="customer_PortalLanguage"
            name="customer_PortalLanguage"
            value={customerData.customer_OtherDetails.customer_PortalLanguage}
            onChange={handleOtherDetails}
            className="flex-1  block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option>English</option>
          </select>
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
