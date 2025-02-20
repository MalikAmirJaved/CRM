import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  FaBuilding,
  FaIndustry,
  FaMapMarkerAlt,
  FaUserTie,
  FaFileAlt,
  FaRedo,
  FaDollarSign,
  FaEnvelope,
  FaHandshake,
} from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL;

const OptionalDataLead = () => {
  const { leadId } = useParams(); // Extract leadId from params
  const [formData, setFormData] = useState({
    lead_Demography: {
      company_Size: "",
      location: "",
      job_Title: "",
      misaligned_Demographics: false,
      industry_Match: false,
    },
    lead_Behaviour: {
      visited_Pricing_Page: "",
      downloaded_White_Paper: false,
      repeated_Website_Visits: false,
      ignore_Email_or_Unsubscribed: false,
    },
    lead_Action: {
      requested_Demo_or_Quote: false,
      attended_Sales_Call: false,
      opted_for_Trial_Services: false,
    },
    lead_AttributesOrAction: {
      invalid_Email_or_ContactInfo: false,
      competitor: false,
      budget_Below_Threshold: false,
    },
  });

  // Custom placeholders for each field
  const placeholders = {
    company_Size: "Company Size",
    location: "Location",
    job_Title: "Job Title",
    misaligned_Demographics: "Misaligned Demographics",
    industry_Match: "Industry Match",
    visited_Pricing_Page: "Visited Pricing Page",
    downloaded_White_Paper: "Downloaded White Paper",
    repeated_Website_Visits: "Repeated Website Visits",
    ignore_Email_or_Unsubscribed: "Ignored Email or Unsubscribed",
    requested_Demo_or_Quote: "Requested Demo or Quote",
    attended_Sales_Call: "Attended Sales Call",
    opted_for_Trial_Services: "Opted for Trial Services",
    invalid_Email_or_ContactInfo: "Invalid Email or Contact Info",
    competitor: "Competitor",
    budget_Below_Threshold: "Budget Below Threshold",
  };

  const handleChange = (event, field, subField) => {
    const { type, checked, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: {
        ...prevFormData[field],
        [subField]: type === "checkbox" ? checked : value,
      },
    }));
  };

  const jwtLoginToken = localStorage.getItem("jwtLoginToken");
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.patch(
        `${API_URL}/lead/update/${leadId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${jwtLoginToken}`,
          },
        }
      );
      console.log("Response:", response.data);
      window.alert("Form submitted successfully!");
    } catch (error) {
      console.error("Error:", error);
      window.alert("Error submitting the form. Please try again.");
    }
  };

  const renderInputField = (field, subField, value, type, icon, placeholder) => (
    <div className="flex items-center border border-gray-300 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-blue-400 mb-6">
      <span className="p-3 text-gray-500">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={type === "checkbox" ? undefined : value}
        onChange={(e) => handleChange(e, field, subField)}
        checked={type === "checkbox" ? value : undefined}
        className="w-full p-3 focus:outline-none"
      />
    </div>
  );

  const renderCheckboxField = (field, subField, value, label) => (
    <div className="flex items-center space-x-3 mb-6">
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => handleChange(e, field, subField)}
        className="h-5 w-5 border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
      />
      <label className="text-gray-700 text-sm font-medium">{label}</label>
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-gray-50 space-y-4 text-center"
    >
      <h2 className="text-2xl font-bold text-gray-800">Update Lead Details</h2>
      {Object.entries(formData).map(([section, fields]) => (
        <div key={section} className="space-y-6">
          <h3 className="text-xl font-semibold text-blue-600 capitalize">
            {section.replace(/_/g, " ")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Object.entries(fields).map(([key, value]) =>
              typeof value === "boolean"
                ? renderCheckboxField(
                    section,
                    key,
                    value,
                    placeholders[key] || key.replace(/_/g, " ") // Use custom or fallback placeholder
                  )
                : renderInputField(
                    section,
                    key,
                    value,
                    "text",
                    // Assign icons for specific keys
                    key === "company_Size"
                      ? <FaBuilding />
                      : key === "industry_Match"
                      ? <FaIndustry />
                      : key === "location"
                      ? <FaMapMarkerAlt />
                      : key === "job_Title"
                      ? <FaUserTie />
                      : key === "visited_Pricing_Page"
                      ? <FaDollarSign />
                      : key === "downloaded_White_Paper"
                      ? <FaFileAlt />
                      : key === "repeated_Website_Visits"
                      ? <FaRedo />
                      : key === "ignore_Email_or_Unsubscribed"
                      ? <FaEnvelope />
                      : key === "requested_Demo_or_Quote"
                      ? <FaHandshake />
                      : null, // Default case for no icon
                    placeholders[key] || key.replace(/_/g, " ") // Use custom or fallback placeholder
                  )
            )}
          </div>
        </div>
      ))}
      <button
        type="submit"
        className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Submit
      </button>
    </form>
  );
};

export default OptionalDataLead;
