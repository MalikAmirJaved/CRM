import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
const jwtLoginToken = localStorage.getItem("jwtLoginToken");

const PanelCustomers = () => {
  const [showForm, setShowForm] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [showMassLeadTransferPopup, setShowMassLeadTransferPopup] =
    useState(false);
  const [transferUserId, setTransferUserId] = useState("");
  const [leadId, setLeadId] = useState(null);
  const [timeFilter, setTimeFilter] = useState("All");
  const recordsPerPage = 10;
  const navigate = useNavigate();

  /** Fetch Customers */
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
    fetchCustomers();
  }, []);

  const handleNavigateToEditCustomer = (customerId) => {
    navigate(`/edit-customer/${customerId}`)
  }

  /** Pagination Handlers */
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

  const filteredCustomers = customers.filter((customer) => {
    const searchLower = search.toLowerCase();
    return (
      customer.customer_GeneralDetails.customer_PrimaryInfo.firstName
        ?.toLowerCase()
        .includes(searchLower) ||
      customer.customer_GeneralDetails.customer_PrimaryInfo.lastName
        ?.toLowerCase()
        .includes(searchLower) ||
      customer.customer_GeneralDetails.customer_CompanyName
        ?.toLowerCase()
        .includes(searchLower) ||
      customer.customer_GeneralDetails.customer_Email
        ?.toLowerCase()
        .includes(searchLower)
    );
  });

  const currentRecords = filteredCustomers.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredCustomers.length / recordsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNavigateAddCustomerForm = () => {
    navigate("/add-customer");
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedCustomers(filteredCustomers.map((customer) => customer._id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleCheckboxChange = (id) => {
    if (selectedCustomers.includes(id)) {
      setSelectedCustomers(
        selectedCustomers.filter((customerId) => customerId !== id)
      );
    } else {
      setSelectedCustomers([...selectedCustomers, id]);
    }
  };

  const handleMassDelete = () => {
    // Implement mass delete logic here
  };

  const handleMassTransfer = () => {
    // Implement mass transfer logic here
  };

  const handleTimeFilterChange = (e) => {
    setTimeFilter(e.target.value);
  };

  return (
    <div className="p-5 bg-delta min-h-screen">
      <div className="relative">
        <input
          type="text"
          placeholder="Search for customers..."
          value={search}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

      </div>

      <section className="">
        <div className="flex justify-between items-center p-4 border-b">
          <h1 className="text-3xl font-bold text-textPrimaryClr">Customers</h1>
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

            <button
              className="px-4 py-2 text-white bg-btnPrimaryClr hover:bg-btnHoverClr rounded-lg"
              onClick={handleNavigateAddCustomerForm}
            >
              + Customer
            </button>
          </div>
        </div>

        {/* Customers Table */}
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
                  Name
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border">
                  Company
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border">
                  Email
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border">
                  Phone
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {[...currentRecords].reverse().map((customer) => (
                <tr key={customer._id} className="hover:bg-gray-100 border-b">
                  <td className="px-4 py-2 border">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-blue-600"
                      checked={selectedCustomers.includes(customer._id)}
                      onChange={() => handleCheckboxChange(customer._id)}
                    />
                  </td>
                  <td className="px-4 py-2 border">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border">
                    {
                      customer.customer_GeneralDetails.customer_PrimaryInfo
                        .firstName
                    }{" "}
                    {
                      customer.customer_GeneralDetails.customer_PrimaryInfo
                        .lastName
                    }
                  </td>
                  <td className="px-4 py-2 border">
                    {customer.customer_GeneralDetails.customer_CompanyName}
                  </td>
                  <td className="px-4 py-2 border">
                    {customer.customer_GeneralDetails.customer_Email}
                  </td>
                  <td className="px-4 py-2 border" >
                    {
                      customer.customer_GeneralDetails.customer_Contact
                        .mobilePhone
                    }
                  </td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => handleNavigateToEditCustomer(customer._id)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>
      </section>

      {/* Pagination Controls */}
      <div className="flex justify-end items-center space-x-4 m-4">
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
          {Math.ceil(filteredCustomers.length / recordsPerPage)}
        </span>

        <button
          onClick={handleNextPage}
          disabled={
            currentPage === Math.ceil(filteredCustomers.length / recordsPerPage)
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

export default PanelCustomers;
