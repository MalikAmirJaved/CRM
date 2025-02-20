  import { createSlice } from "@reduxjs/toolkit";

  const initialState = {
    customer_GeneralDetails: {
      customer_Type: "business",
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
    customer_OtherDetails: {
      customer_TRN: "",
      customer_CompanyId: "",
      customer_Currency: "",
      customer_PaymentTerms: "Due On Receipt", 
      customer_EnablePortal: false,
      customer_OpeningBalance: 0,
      customer_TaxRate: 0,
      customer_PortalLanguage: "",
      customer_Documents: [
        {
          filePath: "",
        },
      ],
    },
    customer_Address: {
      billingAddress: {
        billingAddress_Attention: "",
        billingAddress_Country: "",
        billingAddress_State: "",
        billingAddress_Address: "",
        billingAddress_City: "",
        billingAddress_ZipCode: "",
        billingAddress_Phone: "",
        billingAddress_FaxNo: "",
      },
      shippingAddress: {
        shippingAddress_Attention: "",
        shippingAddress_Country: "",
        shippingAddress_State: "",
        shippingAddress_Address: "",
        shippingAddress_City: "",
        shippingAddress_ZipCode: "",
        shippingAddress_Phone: "",
        shippingAddress_FaxNo: "",
      },
    },
    customer_ContactPersons: [
      {
        salutation: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        designation: "",
      },
    ],
    customer_Remarks: "",
  };

  const setNestedValue = (state, path, value) => {
    const keys = path.split('.');
    keys.reduce((acc, key, idx) => {
      if (idx === keys.length - 1) {
        acc[key] = value; // update the last key
      } else {
        if (!acc[key]) acc[key] = {}; // create an object if it doesn't exist
      }
      return acc[key];
    }, state);
  };

  const customerSlice = createSlice({
    name: "customer",
    initialState,
    reducers: {
      updateCustomerField: (state, action) => {
        const { name, value } = action.payload;
        setNestedValue(state, name, value); // use the utility to set the value
        console.log(JSON.parse(JSON.stringify(state)));
      },
      createGeneralDetails: (state, action) => {
        const { field, value } = action.payload;
        if (
          field === "salutation" ||
          field === "firstName" ||
          field === "lastName"
        ) {
          state.customer_GeneralDetails.customer_PrimaryInfo[field] = value;
        }
        if (field === "workPhone" || field === "mobilePhone") {
          state.customer_GeneralDetails.customer_Contact[field] = value;
        } else {
          state.customer_GeneralDetails[field] = value;
        }
      },
      createOtherDetails: (state, action) => {
        const { field, value } = action.payload;
        if (field === "document") {
          return;
        } else {
          state.customer_OtherDetails[field] = value;
        }
        console.log(JSON.parse(JSON.stringify(state)));
      },
      createAddress: (state, action) => {
        const { addressType, field, value } = action.payload;

        if (addressType === "billingAddress") {
          state.customer_Address.billingAddress[field] = value;
        } else if (addressType === "shippingAddress") {
          state.customer_Address.shippingAddress[field] = value;
        }
      },
      createContactPersons: (state, action) => {
        const { field, index, value, action: contactAction } = action.payload;

        if (contactAction === "remove") {
          state.customer_ContactPersons = state.customer_ContactPersons.filter(
            (_, i) => i !== index
          );
        } else if (state.customer_ContactPersons[index]) {
          state.customer_ContactPersons[index][field] = value;
        } else {
          state.customer_ContactPersons.push({
            salutation: "",
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            designation: "",
          });
          state.customer_ContactPersons[index][field] = value;
        }
      },
      createRemarks: (state, action) => {
        const { field, value } = action.payload;
        state[field] = value;
      },
      setCustomerData: (state, action) => {
        state = action.payload.customer;
        return { ...state, ...action.payload };
      },
      setInitialDetailsLeadToQuoteConversion: (state, action) => {
        const { lead } = action.payload;
        if (lead.lead_Type === "individual") {
          state.customer_GeneralDetails.customer_Type = lead.lead_Type;
          state.customer_GeneralDetails.customer_PrimaryInfo.firstName = lead.lead_Customer.customer_Name || "";
          state.customer_GeneralDetails.customer_Contact.mobilePhone = lead.lead_Customer.customer_Contact || "";
          state.customer_GeneralDetails.customer_Email = lead.lead_Customer.customer_Email || "";
        } else if (lead.lead_Type === "business") {
          state.customer_GeneralDetails.customer_Type = lead.lead_Type;
          state.customer_GeneralDetails.customer_CompanyName = lead.lead_Customer.customer_Name || "";
          state.customer_GeneralDetails.customer_DisplayName = lead.lead_Customer.customer_Name || "";
          state.customer_GeneralDetails.customer_PrimaryInfo.firstName = lead.lead_ContactPerson.contactPerson_Name || "";
          state.customer_GeneralDetails.customer_Email = lead.lead_Customer.customer_Email || "";
          state.customer_GeneralDetails.customer_Contact.workPhone = lead.lead_Customer.customer_Contact || "";
        } 
      },
      resetCustomer: () => initialState,
    },
  });

  export const {
    updateCustomerField,
    createGeneralDetails,
    createOtherDetails,
    createAddress,
    createContactPersons,
    createRemarks,
    setCustomerData,
    resetCustomer,
    setInitialDetailsLeadToQuoteConversion
  } = customerSlice.actions;
  export default customerSlice.reducer;
