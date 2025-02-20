import React, { useState, useEffect } from "react";
import { Field, ErrorMessage } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { createAddress } from "../../../../features/customerSlice";
import { Country, State, City } from "country-state-city";

const Address = () => {
  const [billingCountryCode, setBillingCountryCode] = useState("");
  const [shippingCountryCode, setShippingCountryCode] = useState("");

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
    const country = Country.getAllCountries().find(
      (c) => c.name === countryName
    );

    if (addressType === "billingAddress") {
      setBillingCountryCode(country.isoCode);
      setBillingStates(State.getStatesOfCountry(country.isoCode));
      setBillingCities([]);
    } else {
      setShippingCountryCode(country.isoCode);
      setShippingStates(State.getStatesOfCountry(country.isoCode));
      setShippingCities([]);
    }
  };

  const handleStateChange = (addressType, stateName) => {
    const countryCode =
      addressType === "billingAddress"
        ? billingCountryCode
        : shippingCountryCode;
    const state = State.getStatesOfCountry(countryCode).find(
      (s) => s.name === stateName
    );

    if (addressType === "billingAddress") {
      setBillingCities(City.getCitiesOfState(countryCode, state.isoCode));
    } else {
      setShippingCities(City.getCitiesOfState(countryCode, state.isoCode));
    }
  };

  return (
    <>
      <div className="tab-pane  ">
        <div className="lg:space-y-6">
          
          <div className="lg:space-x-32 w-2/3 lg:grid lg:grid-cols-2">
            {/* Billing Address */}
            <div className="xl:w-[360px] lg:w-[330px]">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Billing Address
              </h3>

              {/* Attention */}
              <div className="flex items-center space-x-4 mb-4 ">
                <label className="text-sm font-semibold text-gray-600 w-1/3">
                  Attention
                </label>
                <Field
                  type="text"
                  name="customer_Address.billingAddress.billingAddress_Attention"
                  className="flex-1  block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Attention"
                />
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <label className="text-sm font-semibold text-gray-600 w-1/3">
                  Country
                </label>
                <Field name="customer_Address.billingAddress.billingAddress_Country">
                  {({ field }) => (
                    <select
                      {...field}
                      onChange={(e) => {
                        field.onChange(e); // update Formik state
                        handleCountryChange("billingAddress", e.target.value); // update local state
                      }}
                      className="flex-1 block w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select a Country</option>
                      {countries.map((country) => (
                        <option key={country.isoCode} value={country.name}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  )}
                </Field>
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <label className="text-sm font-semibold text-gray-600 w-1/3">
                  State
                </label>
                <Field name="customer_Address.billingAddress.billingAddress_State">
                  {({ field }) => (
                    <select
                      {...field}
                      onChange={(e) => {
                        field.onChange(e); // update Formik state
                        handleStateChange("billingAddress", e.target.value); // update local state
                      }}
                      className="flex-1 block w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select a State</option>
                      {billingStates.map((state) => (
                        <option key={state.isoCode} value={state.name}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  )}
                </Field>
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <label className="text-sm font-semibold text-gray-600 w-1/3">
                  City
                </label>
                <Field name="customer_Address.billingAddress.billingAddress_City">
                  {({ field }) => (
                    <select
                      {...field}
                      onChange={(e) => {
                        field.onChange(e); // update Formik state
                        // (If you need any local state updates for City, you can add them here)
                      }}
                      className="flex-1 block w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select a City</option>
                      {billingCities.map((city) => (
                        <option key={city.name} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  )}
                </Field>
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <label className="text-sm font-semibold text-gray-600 w-1/3">Address</label>
                <Field
                  name="customer_Address.shippingAddress.shippingAddress_Address"
                  as="textarea"
                  rows="3"
                  cols="100"
                  className="flex-1  block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter Address here"
                />
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <label className="text-sm font-semibold text-gray-600 w-1/3">Zip Code</label>
                <Field
                  type="text"
                  name="customer_Address.billingAddress.billingAddress_ZipCode"
                  className="flex-1  block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="ZipCode"
                />
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <label className="text-sm font-semibold text-gray-600 w-1/3">Phone</label>
                <Field
                  type="text"
                  name="customer_Address.billingAddress.billingAddress_Phone"
                  className="flex-1  block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Phone"
                />
              </div>

              {/* Fax Number */}
              <div className="flex items-center space-x-4 mb-4">
                <label className="text-sm font-semibold text-gray-600 w-1/3">Fax Number</label>
                <Field
                  type="text"
                  name="customer_Address.billingAddress.billingAddress_FaxNo"
                  className="flex-1  block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="FaxNo"
                />
              </div>
            </div>



            {/* Shipping Address */}
            <div className="xl:w-[360px] lg:w-[330px]">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Shipping Address
              </h3>

              {/* Attention */}
              <div className="flex items-center space-x-4 mb-4 ">
                <label className="text-sm font-semibold text-gray-600 w-1/3">
                  Attention
                </label>
                <Field
                  type="text"
                  name="customer_Address.shippingAddress.shippingAddress_Attention"
                  className="flex-1  block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Attention"
                />
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <label className="text-sm font-semibold text-gray-600 w-1/3">
                  Country
                </label>
                <Field name="customer_Address.shippingAddress.shippingAddress_Country">
                  {({ field }) => (
                    <select
                      {...field}
                      onChange={(e) => {
                        field.onChange(e); // update Formik state
                        handleCountryChange("shippingAddress", e.target.value); // update local state
                      }}
                      className="flex-1 block w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select a Country</option>
                      {countries.map((country) => (
                        <option key={country.isoCode} value={country.name}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  )}
                </Field>
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <label className="text-sm font-semibold text-gray-600 w-1/3">
                  State
                </label>
                <Field name="customer_Address.shippingAddress.shippingAddress_State">
                  {({ field }) => (
                    <select
                      {...field}
                      onChange={(e) => {
                        field.onChange(e); // update Formik state
                        handleStateChange("shippingAddress", e.target.value); // update local state
                      }}
                      className="flex-1 block w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select a State</option>
                      {shippingStates.map((state) => (
                        <option key={state.isoCode} value={state.name}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  )}
                </Field>
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <label className="text-sm font-semibold text-gray-600 w-1/3">
                  City
                </label>
                <Field name="customer_Address.shippingAddress.shippingAddress_City">
                  {({ field }) => (
                    <select
                      {...field}
                      onChange={(e) => {
                        field.onChange(e); // update Formik state
                        // (If you need any local state updates for City, you can add them here)
                      }}
                      className="flex-1 block w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select a City</option>
                      {shippingCities.map((city) => (
                        <option key={city.name} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  )}
                </Field>
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <label className="text-sm font-semibold text-gray-600 w-1/3">Address</label>
                <Field
                  name="customer_Address.shippingAddress.shippingAddress_Address"
                  as="textarea"
                  rows="3"
                  cols="100"
                  className="flex-1  block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter Address here"
                />
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <label className="text-sm font-semibold text-gray-600 w-1/3">Zip Code</label>
                <Field
                  type="text"
                  name="customer_Address.shippingAddress.shippingAddress_ZipCode"
                  className="flex-1  block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="ZipCode"
                />
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <label className="text-sm font-semibold text-gray-600 w-1/3">Phone</label>
                <Field
                  type="text"
                  name="customer_Address.shippingAddress.shippingAddress_Phone"
                  className="flex-1  block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Phone"
                />
              </div>

              {/* Fax Number */}
              <div className="flex items-center space-x-4 mb-4">
                <label className="text-sm font-semibold text-gray-600 w-1/3">Fax Number</label>
                <Field
                  type="text"
                  name="customer_Address.shippingAddress.shippingAddress_FaxNo"
                  className="flex-1  block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="FaxNo"
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
