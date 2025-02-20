import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createAddress } from "../../../../features/customerSlice";
import { Country, State, City } from "country-state-city";

const Address = () => {
  const dispatch = useDispatch();
  const customerData = useSelector((state) => state.customer);
  const [ billingCountryCode, setBillingCountryCode ] = useState("");
  const [ shippingCountryCode, setShippingCountryCode ] = useState("");

  // State for storing dynamic data
  const [countries, setCountries] = useState([]);
  const [billingStates, setBillingStates] = useState([]);
  const [billingCities, setBillingCities] = useState([]);
  const [shippingStates, setShippingStates] = useState([]);
  const [shippingCities, setShippingCities] = useState([]);

  // Load all countries on component mount
  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  // Handle change for country selection
  const handleCountryChange = (addressType, countryName) => {
    const country = Country.getAllCountries().find(c => c.name === countryName);
    dispatch(createAddress({ addressType, field: `${addressType}_Country`, value: country.name }));
  
    if (addressType === "billingAddress") {
      setBillingCountryCode(country.isoCode);
      setBillingStates(State.getStatesOfCountry(country.isoCode));
      setBillingCities([]);
      dispatch(createAddress({ addressType, field: `${addressType}_State`, value: "" }));
      dispatch(createAddress({ addressType, field: `${addressType}_City`, value: "" }));
    } else {
      setShippingCountryCode(country.isoCode);
      setShippingStates(State.getStatesOfCountry(country.isoCode));
      setShippingCities([]);
      dispatch(createAddress({ addressType, field: `${addressType}_State`, value: "" }));
      dispatch(createAddress({ addressType, field: `${addressType}_City`, value: "" }));
    }
  };

  const handleStateChange = (addressType, stateName) => {
    const countryCode = addressType === "billingAddress" ? billingCountryCode : shippingCountryCode;
    const state = State.getStatesOfCountry(countryCode).find(s => s.name === stateName);
    
    dispatch(createAddress({ addressType, field: `${addressType}_State`, value: state.name }));
  
    if (addressType === "billingAddress") {
      setBillingCities(City.getCitiesOfState(countryCode, state.isoCode));
      dispatch(createAddress({ addressType, field: `${addressType}_City`, value: "" }));
    } else {
      setShippingCities(City.getCitiesOfState(countryCode, state.isoCode));
      dispatch(createAddress({ addressType, field: `${addressType}_City`, value: "" }));
    }
  };

  // Handle change for other fields
  const handleAddress = (addressType, field) => (e) => {
    dispatch(
      createAddress({
        addressType,
        field,
        value: e.target.value,
      })
    );
  };
  
  return (
    <>
      <div className="tab-pane w-2/3">
        <div className="space-y-6">
          {/* Billing Address */}
          <div className="flex space-x-6">
            <div className="w-1/2">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Billing Address</h3>

              {/* Attention */}
              <div className="flex items-center space-x-4 mb-4 ">
                <label className="text-sm font-semibold text-gray-600 w-1/3">Attention</label>
                <input
                  id="billingAddress_Attention"
                  name="billingAddress_Attention"
                  type="text"
                  value={customerData.customer_Address.billingAddress.billingAddress_Attention}
                  onChange={handleAddress("billingAddress", "billingAddress_Attention")}
                  placeholder="Attention"
                  className="flex-1  block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

          {/* Country */}
          <div className="flex items-center space-x-4 mb-4">
              <label className="text-sm font-semibold text-gray-600 w-1/3">Country</label>
              <select
                value={customerData.customer_Address.billingAddress.billingAddress_Country}
                onChange={(e) => handleCountryChange("billingAddress", e.target.value)}
                className="flex-1 block w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">{customerData.customer_Address.billingAddress.billingAddress_State || "Select a Country"}</option>
                {countries.map((country) => (
                  <option key={country.isoCode} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            {/* State */}
            <div className="flex items-center space-x-4 mb-4">
              <label className="text-sm font-semibold text-gray-600 w-1/3">State</label>
                <select
                value={customerData.customer_Address.billingAddress.billingAddress_State || "qwewqr"}
                onChange={(e) => handleStateChange("billingAddress", e.target.value)}
                className="flex-1 block w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">{customerData.customer_Address.billingAddress.billingAddress_State || "Select a State"}</option>
                {billingStates.map((state) => (
                  <option key={state.isoCode} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
            <div className="flex items-center space-x-4 mb-4">
              <label className="text-sm font-semibold text-gray-600 w-1/3">City</label>
              <select
  value={customerData.customer_Address.billingAddress.billingAddress_City || ""}
  onChange={handleAddress("billingAddress", "billingAddress_City")}
  className="flex-1 block w-full p-2 border border-gray-300 rounded-md"
>
  <option value="">{customerData.customer_Address.billingAddress.billingAddress_City || "Select a City"}</option>
  {billingCities.map((city) => (
    <option key={city.name} value={city.name}>
      {city.name}
    </option>
  ))}
</select>
            </div>

              {/* Address */}
              <div className="flex items-center space-x-4 mb-4">
                <label className="text-sm font-semibold text-gray-600 w-1/3">Address</label>
                <textarea
                  id="billingAddress_Address"
                  name="billingAddress_Address"
                  type="text"
                  value={customerData.customer_Address.billingAddress.billingAddress_Address}
                  onChange={handleAddress("billingAddress", "billingAddress_Address")}
                  placeholder="Address"
                  className="flex-1  block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                ></textarea>
              </div>



              {/* Zip Code */}
              <div className="flex items-center space-x-4 mb-4">
                <label className="text-sm font-semibold text-gray-600 w-1/3">Zip Code</label>
                <input
                  id="billingAddress_ZipCode"
                  name="billingAddress_ZipCode"
                  type="text"
                  value={customerData.customer_Address.billingAddress.billingAddress_ZipCode}
                  onChange={handleAddress("billingAddress", "billingAddress_ZipCode")}
                  placeholder="Zip Code"
                  className="flex-1  block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Phone */}
              <div className="flex items-center space-x-4 mb-4">
                <label className="text-sm font-semibold text-gray-600 w-1/3">Phone</label>
                <input
                  id="billingAddress_Phone"
                  name="billingAddress_Phone"
                  type="text"
                  value={customerData.customer_Address.billingAddress.billingAddress_Phone}
                  onChange={handleAddress("billingAddress", "billingAddress_Phone")}
                  placeholder="Phone"
                  className="flex-1  block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Fax Number */}
              <div className="flex items-center space-x-4 mb-4">
                <label className="text-sm font-semibold text-gray-600 w-1/3">Fax Number</label>
                <input
                  id="billingAddress_FaxNo"
                  name="billingAddress_FaxNo"
                  type="text"
                  value={customerData.customer_Address.billingAddress.billingAddress_FaxNo}
                  onChange={handleAddress("billingAddress", "billingAddress_FaxNo")}
                  placeholder="Fax #"
                  className="flex-1  block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              </div>
    

            {/* Shipping Address */}
            <div className="w-1/2">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Shipping Address</h3>

              {/* Attention */}
              <div className="flex items-center space-x-4 mb-4 ">
                <label className="text-sm font-semibold text-gray-600 w-1/3">Attention</label>
                <input
                  id="shippingAddress_Attention"
                  name="shippingAddress_Attention"
                  type="text"
                  value={customerData.customer_Address.shippingAddress.shippingAddress_Attention}
                  onChange={handleAddress("shippingAddress", "shippingAddress_Attention")}
                  placeholder="Attention"
                  className="flex-1  block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              
            {/* Country */}
            <div className="flex items-center space-x-4 mb-4">
              <label className="text-sm font-semibold text-gray-600 w-1/3">Country</label>
              <select
                value={customerData.customer_Address.shippingAddress.shippingAddress_Country}
                onChange={(e) => handleCountryChange("shippingAddress", e.target.value)}
                className="flex-1 block w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">{customerData.customer_Address.shippingAddress.shippingAddress_Country || "Select a Country"}</option>
                {countries.map((country) => (
                  <option key={country.isoCode} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            {/* State */}
            <div className="flex items-center space-x-4 mb-4">
              <label className="text-sm font-semibold text-gray-600 w-1/3">State</label>
              <select
                onChange={(e) => handleStateChange("shippingAddress", e.target.value)}
                className="flex-1 block w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">{customerData.customer_Address.shippingAddress.shippingAddress_State || "Select a State"}</option>
                {shippingStates.map((state) => (
                  <option key={state.isoCode} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
            <div className="flex items-center space-x-4 mb-4">
              <label className="text-sm font-semibold text-gray-600 w-1/3">City</label>
              <select
                onChange={handleAddress("shippingAddress", "shippingAddress_City")}
                className="flex-1 block w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">{customerData.customer_Address.shippingAddress.shippingAddress_City || "Select a City"}</option>
                {shippingCities.map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

              {/* Address */}
              <div className="flex items-center space-x-4 mb-4">
                <label className="text-sm font-semibold text-gray-600 w-1/3">Address</label>
                <textarea
                  id="shippingAddress_Address"
                  name="shippingAddress_Address"
                  type="text"
                  value={customerData.customer_Address.shippingAddress.shippingAddress_Address}
                  onChange={handleAddress("shippingAddress", "shippingAddress_Address")}
                  placeholder="Address"
                  className="flex-1  block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                ></textarea>
              </div>

           

              {/* Zip Code */}
              <div className="flex items-center space-x-4 mb-4">
                <label className="text-sm font-semibold text-gray-600 w-1/3">Zip Code</label>
                <input
                  id="shippingAddress_ZipCode"
                  name="shippingAddress_ZipCode"
                  type="text"
                  value={customerData.customer_Address.shippingAddress.shippingAddress_ZipCode}
                  onChange={handleAddress("shippingAddress", "shippingAddress_ZipCode")}
                  placeholder="Zip Code"
                  className="flex-1  block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Phone */}
              <div className="flex items-center space-x-4 mb-4">
                <label className="text-sm font-semibold text-gray-600 w-1/3">Phone</label>
                <input
                  id="shippingAddress_Phone"
                  name="shippingAddress_Phone"
                  type="text"
                  value={customerData.customer_Address.shippingAddress.shippingAddress_Phone}
                  onChange={handleAddress("shippingAddress", "shippingAddress_Phone")}
                  placeholder="Phone"
                  className="flex-1  block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Fax Number */}
              <div className="flex items-center space-x-4 mb-4">
                <label className="text-sm font-semibold text-gray-600 w-1/3">Fax Number</label>
                <input
                  id="shippingAddress_FaxNo"
                  name="shippingAddress_FaxNo"
                  type="text"
                  value={customerData.customer_Address.shippingAddress.shippingAddress_FaxNo}
                  onChange={handleAddress("shippingAddress", "shippingAddress_FaxNo")}
                  placeholder="Fax #"
                  className="flex-1  block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
          </div>
   
    </div>
    </>

  );
};

export default Address;