import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faAddressBook,
  faPhone,
  faBuilding,
  faTag,
  faGlobe,
  faTimes,
  faMapMarkerAlt,
  faFire,
  faSun,
  faSnowflake,
  faCaretSquareDown,
} from "@fortawesome/free-solid-svg-icons";

const API_URL = process.env.REACT_APP_API_URL;

const SalesPanelLeads = () => {
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState("individual");
  const [formData, setFormData] = useState({
    customer_Name: "",
    customer_Email: "",
    customer_Address: "",
    customer_Contact: "",
    contactPerson_Name: "",
    contactPerson_Email: "",
    contactPerson_Contact: "",
    lead_Type: "individual",
    lead_Scope: "",
    lead_Title: "",
    lead_Source: "",
  });
  const [leads, setLeads] = useState([]);
  const [salesEmployees, setSalesEmployees] = useState([]);
  const [showMassLeadTransferPopup, setShowMassLeadTransferPopup] =
    useState(false);
  const [transferUserId, setTransferUserId] = useState("");
  const [leadId, setLeadId] = useState("");
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);
  const [showActionPopup, setShowActionPopup] = useState(false);
  const [showMassActionsPopup, setShowMassActionsPopup] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [selectAll, setSelectAll] = useState(false);
  const [timeFilter, setTimeFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const jwtLoginToken = localStorage.getItem("jwtLoginToken");
  const navigate = useNavigate();

  /** Fetch Sales Employees */
  const fetchSalesEmployees = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/department/get-sales-employees`,
        {
          headers: { Authorization: `Bearer ${jwtLoginToken}` },
        }
      );
      if (response.data.success && response.data.information?.users) {
        setSalesEmployees(response.data.information.users);
      }
    } catch (err) {
      console.error("Error fetching sales employees:", err);
    }
  };

  /** Fetch Leads */
  const fetchLeads = async () => {
    try {
      const response = await axios.get(`${API_URL}/lead/get-sales-employee-leads`, {
        headers: { Authorization: `Bearer ${jwtLoginToken}` },
      });

      if (response.data.success) {
        let filteredLeads = response.data.information.allLeads;
        console.log(response.data.information.allLeads)

        if (timeFilter !== "All") {
          const now = new Date();
          filteredLeads = filteredLeads.filter((quote) => {
            const quoteDate = new Date(quote.createdAt);
            const timeDifference = now - quoteDate;
            switch (timeFilter) {
              case "Day":
                return timeDifference <= 24 * 60 * 60 * 1000;
              case "Week":
                return timeDifference <= 7 * 24 * 60 * 60 * 1000;
              case "Month":
                return timeDifference <= 30 * 24 * 60 * 60 * 1000;
              default:
                return true;
            }
          });
        }

        setLeads(filteredLeads);
        setTotalLeads(filteredLeads.length);
      } else {
        console.log("Error fetching leads ");
      }
    } catch (err) {
      console.log("Error fetching leads ");
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/customer/get-all-customers`,
        {
          headers: { Authorization: `Bearer ${jwtLoginToken}` },
        }
      );
      if (response.data.success && response.data.information?.customers) {
        setCustomers(response.data.information.customers);
      }
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  };

  useEffect(() => {
    fetchSalesEmployees();
    fetchCustomers();
    fetchLeads();
  }, [leads]);



  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  /** Time Filter Change */
  const handleTimeFilterChange = (event) => {
    setTimeFilter(event.target.value);
  };

  /** Handle Checkbox Submission */
  const handleCheckboxChange = (leadId) => {
    setSelectedLeads((prev) =>
      prev.includes(leadId)
        ? prev.filter((id) => id !== leadId)
        : [...prev, leadId].map((id) => id.toString().replace(/'/g, '"'))
    );
  };

  /** Handle Search Change */
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  // Handle Select All
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedLeads([]); // Deselect all
    } else {
      setSelectedLeads(leads.map((lead) => lead._id)); // Select all leads
    }
    setSelectAll(!selectAll);
  };

  /** Handle Form Submission */
  const handleFormSubmit = async (event) => {
    event.preventDefault();
  
    console.log(formData);
    try {
      await axios.post(`${API_URL}/lead/create-lead`, formData, {
        headers: { Authorization: `Bearer ${jwtLoginToken}` },
      });
      setShowForm(false); // Close the form modal
      fetchLeads(); // Refresh leads after creation
    } catch (error) {
      alert(error.response?.data || "Error submitting form.");
    }
  };
  
  const handleMassActionChange = (action) => {
    if (action === "delete") {
      handleMassDelete();
    } else if (action === "transfer") {
      setShowMassLeadTransferPopup(true);
    }
  };

  /** Handle Mass Delete */
  const handleMassDelete = async () => {
    const userConfirmed = window.confirm(
      "Are you sure you want to delete the selected leads?"
    );
    if (!userConfirmed) {
      return;
    }
    try {
      const response = await axios.post(
        `${API_URL}/lead/mass-delete`, // POST request
        { leadIds: selectedLeads }, // Sending selectedLeads in the request body
        {
          headers: { Authorization: `Bearer ${jwtLoginToken}` },
        }
      );
      setShowMassActionsPopup(false); // Close the mass action popup
    } catch (error) {
      console.error(
        "Error during mass delete:",
        error.response?.data || error.message
      );
      alert("An error occurred while deleting leads. Please try again.");
    }
  };
  

  /** Handle Mass Delete */
  const handleMassTransfer = async () => {
    const userConfirmed = window.confirm(
      "Are you sure you want to transfer the selected leads?"
    );
    if (!userConfirmed) {
      return;
    }
    try {
      const response = await axios.post(
        `${API_URL}/lead/mass-transfer`, // POST request
        {
          receivedById: transferUserId,
          leadIds: selectedLeads,
        },
        {
          headers: { Authorization: `Bearer ${jwtLoginToken}` },
        }
      );
      setShowMassLeadTransferPopup(false); // Close the transfer modal
    } catch (error) {
      console.error(
        "Error during mass transfer:",
        error.response?.data || error.message
      );
      alert("An error occurred while transferring leads. Please try again.");
    }
  };
  

  /** Pagination Handlers */
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

  const filteredLeads = leads.filter((lead) => {
    const searchLower = search.toLowerCase();
    return (
      lead.lead_CreaterName?.toLowerCase().includes(searchLower) ||
      lead.lead_Title?.toLowerCase().includes(searchLower) ||
      lead.lead_AssignedToUserName?.toLowerCase().includes(searchLower) ||
      lead.lead_PreviousOwnerName?.toLowerCase().includes(searchLower)
    );
  });

  const currentRecords = filteredLeads.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredLeads.length / recordsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle Approve Lead (if applicable)
  const handleApproveLead = async (leadId) => {
    if (window.confirm('Are you sure you want to approve this lead?')) {
      try {
        const response = await axios.patch(
          `${API_URL}/lead/approve-lead/${leadId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${jwtLoginToken}`,
            },
          }
        );

        if (response.status === 200) {
          setLeads((prevLeads) =>
            prevLeads.filter((lead) => lead._id !== leadId)
          );
         // Navigate after the lead is approved/deleted

        } else {
          throw new Error(response.data.message || 'Failed to approve the lead.');
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'An error occurred. Please try again later.';
        alert(errorMessage);
      }
    }
  };
  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-white'; // Red for Pending
      case 'Approved':
        return 'bg-green-200'; // Green for Approved
      default:
        return 'bg-white'; // Default if status is not defined
    }
  };

  return (
    <div className="p-5 bg-delta min-h-screen">
      <div className="relative">
        <input
          type="text"
          placeholder="Search for leads..."
          value={search}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {showMassActionsPopup && (
          <div className="absolute right-0 mt-16 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
            <button
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-red-100 hover:text-red-700"
              onClick={handleMassDelete}
            >
              Delete
            </button>
            <button
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-700"
              onClick={() => setShowMassLeadTransferPopup(true)}
            >
              Transfer
            </button>
          </div>
        )}
      </div>

      <section className="">
        <div className="flex justify-between items-center p-4 border-b">
          <h1 className="text-3xl font-bold text-textPrimaryClr">Leads</h1>
          <div className="space-x-2">
            <select
              value={timeFilter}
              onChange={handleTimeFilterChange}
              className="bg-white border border-gray-300 rounded-lg p-2"
            >
              <option value="All">All</option>
              <option value="Day">Last 24 Hours</option>
              <option value="Week">Last Week</option>
              <option value="Month">Last Month</option>
            </select>
            <select
              onChange={(e) => handleMassActionChange(e.target.value)}
              defaultValue=""
              className="bg-white border border-gray-300 rounded-lg p-2"
            >
              <option value="" placeholder="Actions">
                Actions
              </option>
              <option value="delete" onClick={handleMassDelete}>Delete</option>
              <option value="transfer" onClick={() => setShowMassLeadTransferPopup(true)}>Transfer</option>
            </select>
            <button
              className="px-4 py-2 text-white bg-btnPrimaryClr hover:bg-btnHoverClr rounded-lg"
              onClick={() => setShowForm(true)}
            >
              + Lead
            </button>
          </div>
        </div>

        {/* Leads Table */}
        <div className="text-left bg-white overflow-hidden">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-blue-600"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border">
                  Created at
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border">
                  Lead Creator
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border">
                  Title
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border">
                  Customer
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border">
                  Label
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border">
                  Status
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border">
                  Transferred By
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border">
                  Previous Owner
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border">
                  Assigned To
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {[...currentRecords].reverse().map((lead) => (
                <tr
                  key={lead._id}
                  className={`hover:bg-gray-100 border-b ${getStatusClass(lead.lead_Status)}`} // Apply the conditional class here
                >
                  <td className="px-4 py-2 border">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-blue-600"
                      checked={selectedLeads.includes(lead._id)}
                      onChange={() => handleCheckboxChange(lead._id)}
                    />
                  </td>
                  <td
                    className="px-4 py-2 border"
                    onClick={() => navigate(`/sales/lead-detail/${lead._id}`)}
                  >
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                  <td
                    className="px-4 py-2 border"
                    onClick={() => navigate(`/sales/lead-detail/${lead._id}`)}
                  >
                    {lead.lead_CreaterName}
                  </td>

                  <td
                    className="px-4 py-2 border"
                    onClick={() => navigate(`/sales/lead-detail/${lead._id}`)}
                  >
                    {lead.lead_Title.length > 20
                      ? `${lead.lead_Title.slice(0, 20)}...`
                      : lead.lead_Title}
                  </td>
                  <td
                    className="px-4 py-2 border"
                    onClick={() => navigate(`/sales/lead-detail/${lead._id}`)}
                  >
                    {
                      lead.lead_Customer.customer_Name
                    }
                  </td>
                  <td
                    className="flex justify-center align-center mt-2"
                    onClick={() => navigate(`/sales/lead-detail/${lead._id}`)}
                  >
                    {lead.lead_Label === "Hot" && (
                      <FontAwesomeIcon
                        icon={faFire}
                        className="text-red-500 text-lg"
                      />
                    )}
                    {lead.lead_Label === "Warm" && (
                      <FontAwesomeIcon
                        icon={faSun}
                        className="text-orange-500 text-lg"
                      />
                    )}
                    {lead.lead_Label === "Cold" && (
                      <FontAwesomeIcon
                        icon={faSnowflake}
                        className="text-blue-500 text-lg"
                      />
                    )}
                  </td>
                  <td className="px-4 py-2 border">
                    {lead.lead_Status}
                  </td>

                  <td
                    className="px-4 py-2 border"
                    onClick={() => navigate(`/sales/lead-detail/${lead._id}`)}
                  >
                    {lead.lead_TransferredByUserName}
                  </td>
                  <td
                    className="px-4 py-2 border"
                    onClick={() => navigate(`/sales/lead-detail/${lead._id}`)}
                  >
                    {lead.lead_PreviousOwnerName}
                  </td>
                  <td
                    className="px-4 py-2 border"
                    onClick={() => navigate(`/sales/lead-detail/${lead._id}`)}
                  >
                    {lead.lead_AssignedToUserName}
                  </td>
                  <td className="px-4 py-2">
  <select
    className="relative px-2 py-1  text-black text-sm "
    onChange={(e) => {
      const action = e.target.value;
      if (action === 'addOptionalData') {
        navigate(`/sales/optional-data-lead/${lead._id}`);
      } else if (action === 'convertToQuote') {
        navigate(`/sales/add-quote`);
      } else if (action === 'approveLead') {
        handleApproveLead(lead._id);
      } else if (action === 'cancel') {
        setShowActionPopup(null);
      }
    }}
    value={showActionPopup === lead._id ? 'selectAction' : ''}
  >
    <option value="" disabled>Select an Action</option>
    <option value="addOptionalData">Add Optional Data</option>
    <option value="convertToQuote">Convert to Quote</option>
    <option value="approveLead">Approve Lead</option>
    <option value="cancel">Cancel</option>
  </select>
</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white w-full max-w-lg p-5 rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Add Lead</h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Radio Buttons */}
              <div className="flex space-x-4 mb-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="formType"
                    value="individual"
                    checked={formType === 'individual'}
                    onChange={() => {
                      setFormType('individual');
                      setFormData({
                        customer_Name: "",
                        customer_Email: "",
                        customer_Address: "",
                        customer_Contact: "",
                        contactPerson_Name: "",
                        contactPerson_Email: "",
                        contactPerson_Contact: "",
                        lead_Type: "individual",
                        lead_Scope: "",
                        lead_Title: "",
                        lead_Source: "",
                      });
                    }}
                    className="mr-2"
                  />
                  Individual
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="formType"
                    value="business"
                    checked={formType === 'business'}
                    onChange={() => {
                      setFormType('business');
                      setFormData({
                        customer_Name: "",
                        customer_Email: "",
                        customer_Address: "",
                        customer_Contact: "",
                        contactPerson_Name: "",
                        contactPerson_Email: "",
                        contactPerson_Contact: "",
                        lead_Type: "business",
                        lead_Scope: "",
                        lead_Title: "",
                        lead_Source: "",
                      });
                    }}
                    className="mr-2"
                  />
                  Business
                </label>
              </div>

              {/* Input fields with icons */}
              {formType === 'business' ? (
                [
                  { id: "customer_Name", icon: faUser, placeholder: "Company Name", type: "text" },
                  { id: "customer_Email", icon: faEnvelope, placeholder: "Company Email", type: "email" },
                  { id: "customer_Contact", icon: faAddressBook, placeholder: "Company Contact Number", type: "text" },
                  { id: "customer_Address", icon: faAddressBook, placeholder: "Company Address", type: "text" },
                  { id: "contactPerson_Name", icon: faPhone, placeholder: "Company Contact Person Name", type: "text" },
                  { id: "contactPerson_Email", icon: faEnvelope, placeholder: "Company Contact Person Email", type: "email" },
                  { id: "contactPerson_Contact", icon: faPhone, placeholder: "Company Contact Person Contact", type: "text" },
                  { id: "lead_Scope", icon: faMapMarkerAlt, placeholder: "Lead Scope", type: "text" },
                  { id: "lead_Title", icon: faTag, placeholder: "Lead Title", type: "text" },
                ].map((field) => (
                  <div key={field.id} className="flex items-center border border-btnPrimaryClr p-3 rounded focus-within:ring-2 focus-within:ring-green-500">
                    <FontAwesomeIcon icon={field.icon} className="text-gray-500 mr-3" />
                    <input
                      id={field.id}
                      type={field.type}
                      value={formData[field.id]}
                      onChange={handleInputChange}
                      className="w-full outline-none"
                      required
                      placeholder={field.placeholder}
                    />
                  </div>
                ))
              ) : (
                [
                  { id: "customer_Name", icon: faUser, placeholder: "Customer Name", type: "text" },
                  { id: "customer_Email", icon: faEnvelope, placeholder: "Customer Email", type: "email" },
                  { id: "customer_Contact", icon: faEnvelope, placeholder: "Customer Contact", type: "text" },
                  { id: "customer_Address", icon: faAddressBook, placeholder: "Customer Address", type: "text" },
                  { id: "lead_Scope", icon: faMapMarkerAlt, placeholder: "Lead Scope", type: "text" },
                  { id: "lead_Title", icon: faTag, placeholder: "Lead Title", type: "text" },
                ].map((field) => (
                  <div key={field.id} className="flex items-center border border-btnPrimaryClr p-3 rounded focus-within:ring-2 focus-within:ring-green-500">
                    <FontAwesomeIcon icon={field.icon} className="text-gray-500 mr-3" />
                    <input
                      id={field.id}
                      type={field.type}
                      value={formData[field.id]}
                      onChange={handleInputChange}
                      className="w-full outline-none"
                      required
                      placeholder={field.placeholder}
                    />
                  </div>
                ))
              )}

              {/* Source Selection */}
              <div className="flex items-center border border-btnPrimaryClr p-3 rounded focus-within:ring-2 focus-within:ring-green-500">
                <FontAwesomeIcon icon={faGlobe} className="text-gray-500 mr-3" />
                <select
                  id="lead_Source"
                  value={formData.source}
                  onChange={handleInputChange}
                  className="w-full outline-none"
                  required
                >
                  <option value="">Select Source</option>
                  <option value="Whatsapp">Whatsapp</option>
                  <option value="Emails">Emails</option>
                  <option value="Calls">Calls</option>
                  <option value="Website Forms">Website Forms</option>
                  <option value="References">References</option>
                  <option value="Social Media">Social Media</option>
                </select>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-btnTerClr text-gray-700 hover:bg-btnTerHoverClr"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-btnSecClr text-white hover:bg-btnSecHoverClr"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lead Transfer Popup */}
      {showMassLeadTransferPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6">
            <h3 className="text-lg font-bold text-gray-700">Transfer Leads</h3>
            <select
              className="w-full p-2 border mt-4"
              value={transferUserId}
              onChange={(e) => setTransferUserId(e.target.value)}
            >
              <option value="">Select Sales Employee</option>
              {salesEmployees.map((employee) => (
                <option key={employee._id} value={employee.userId}>
                  {employee.name}
                </option>
              ))}
            </select>
            <button
              className="mt-4 px-4 py-2 bg-btnSecClr text-white hover:bg-btnSecHoverClr"
              onClick={handleMassTransfer}
              
            >
              Transfer
            </button>
            <button
              className="mt-4 mx-5 px-4 py-2 bg-btnTerClr text-black hover:bg-btnTerHoverClr"
              onClick={() => setShowMassLeadTransferPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex  justify-end items-center space-x-4 m-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="flex items-center px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-100"
        >
          <i className="fas fa-arrow-left mr-2"></i>{" "}
          {/* FontAwesome left arrow icon */}
          Previous
        </button>

        <span>
          Page {currentPage} of{" "}
          {Math.ceil(filteredLeads.length / recordsPerPage)}
        </span>

        <button
          onClick={handleNextPage}
          disabled={
            currentPage === Math.ceil(filteredLeads.length / recordsPerPage)
          }
          className="flex items-center px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-100"
        >
          Next
          <i className="fas fa-arrow-right ml-2"></i>{" "}
          {/* FontAwesome right arrow icon */}
        </button>
      </div>
    </div>
  );
};

export default SalesPanelLeads;
