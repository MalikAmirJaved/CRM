import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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

const Modal = ({ isOpen, title, message, onClose, onConfirm }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-delta rounded-lg p-6 shadow-lg w-96">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <p className="text-gray-600 mt-2">{message}</p>
        <div className="flex justify-end mt-4 space-x-4">
          {onConfirm && (
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Confirm
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const PanelInvoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [invoiceId, setInvoiceId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [timeFilter, setTimeFilter] = useState("All");
  const [selectAll, setSelectAll] = useState(false);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalAction, setModalAction] = useState(null);
  const [showActionPopup, setShowActionPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const navigate = useNavigate();
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

  const handleNewInvoice = () => {
    navigate("/add-invoice");
  };

  const handleTimeFilterChange = (event) => {
    setTimeFilter(event.target.value);
  };

  const fetchInvoices = async () => {
    try {
      const response = await axios.get(`${API_URL}/invoice/get-invoices`, {
        headers: { Authorization: `Bearer ${jwtLoginToken}` },
      });
      const invoicesFetched = response.data.information;
      console.log(response.data);

      if (response.data.success) {

        let filteredInvoices = response.data.information.invoices;

        if (timeFilter !== "All") {
          const now = new Date();
          filteredInvoices = filteredInvoices.filter((invoice) => {
            const invoiceDate = new Date(invoice.createdAt);
            const timeDifference = now - invoiceDate;
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

        setInvoices(filteredInvoices);
        setTotalInvoices(filteredInvoices.length);
      } else {
        setError("No Invoices Available.");
      }
    } catch (err) {
      setError("No Invoices Available.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  /** Handle Checkbox Submission */
  const handleCheckboxChange = (invoiceId) => {
    setSelectedInvoices((prev) =>
      prev.includes(invoiceId)
        ? prev.filter((id) => id !== invoiceId)
        : [...prev, invoiceId].map((id) => id.toString().replace(/'/g, '"'))
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedInvoices([]); // Deselect all
    } else {
      setSelectedInvoices(invoices.map((invoice) => invoice._id)); // Select all invoices
    }
    setSelectAll(!selectAll);
  };

  const handleApproveInvoice = (invoiceId) => {
    setModalTitle("Approve Invoice");
    setModalMessage("Are you sure you want to approve this invoice?");
    setModalAction(() => async () => {
      setIsModalOpen(false);
      try {
        const response = await axios.patch(
          `${API_URL}/invoice/approve/${invoiceId}`,
          { invoice_Identifier: invoiceId }, // Directly include the data here
          { headers: { Authorization: `Bearer ${jwtLoginToken}` } } // Headers should be separate
        );

        if (response.status === 200) {
          setInvoices((prevInvoices) =>
            prevInvoices.filter((invoice) => invoice._id !== invoiceId)
          );
        }
      } catch (error) {
        setModalMessage("Failed to approve the invoice. Please try again.");
        setModalAction(null);
        setIsModalOpen(true);
      }
    });
    setIsModalOpen(true);
  };

  const handleDeleteInvoice = (invoiceId) => {
    setModalTitle("Delete Invoice");
    setModalMessage("Are you sure you want to delete this invoice?");
    setModalAction(() => async () => {
      setIsModalOpen(false);
      try {
        const response = await axios.delete(
          `${API_URL}/invoice/delete/${invoiceId}`,
          {
            headers: { Authorization: `Bearer ${jwtLoginToken}` },
            data: { invoice_Identifier: invoiceId },
          }
        );

        if (response.status === 200) {
          setInvoices((prevInvoices) =>
            prevInvoices.filter((invoice) => invoice._id !== invoiceId)
          );
        }
      } catch (error) {
        setModalMessage("Failed to delete the invoice. Please try again.");
        setModalAction(null);
        setIsModalOpen(true);
      }
    });
    setIsModalOpen(true);
  };

  const handleMassDelete = async () => {
    const userConfirmed = window.confirm(
      "Are you sure you want to delete the selected invoices?"
    );
    if (!userConfirmed) {
      return;
    }
    try {
      const response = await axios.post(
        `${API_URL}/invoice/mass-delete`, // POST request
        { invoiceIds: selectedInvoices }, // Sending selected Invoices in the request body
        {
          headers: { Authorization: `Bearer ${jwtLoginToken}` },
        }
      );
    } catch (error) {
      console.error(
        "Error during mass delete:",
        error.response?.data || error.message
      );
      alert("An error occurred while deleting invoices. Please try again.");
    }
  };

  // Filter invoices based on search and time filter
  const filteredInvoices = invoices.filter((invoice) => {
    const searchLower = search.toLowerCase();
    return (
      invoice.invoice_Identifier?.toLowerCase().includes(searchLower) ||
      invoice.invoice_Creater?.toLowerCase().includes(searchLower) ||
      invoice.invoice_CustomerDetails?.customer_GeneralDetails?.customer_DisplayName
        ?.toLowerCase()
        .includes(searchLower)
    );
  });

  const handleViewInvoice = (invoiceId) => {
    navigate(`/view-invoice/${invoiceId}`);
  };

  const currentRecords = filteredInvoices.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const getStatusClass = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100";
      case "Unpaid":
        return "bg-red-100";
      default:
        return "bg-delta";
    }
  };

  return (
    <div className="p-5 bg-delta min-h-screen">
      <input
        type="text"
        placeholder="Search for invoices..."
        value={search}
        onChange={handleSearchChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex p-4 justify-between items-center">
        <h1 className="text-3xl font-bold text-textPrimaryClr">Invoices</h1>
        <button
          onClick={handleNewInvoice}
          className="bg-btnPrimaryClr text-white px-4 py-2 rounded-lg hover:bg-btnHoverClr transition"
        >
          + Invoice
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-6">
          <p className="text-gray-600 text-lg">Loading invoices...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center py-6">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      ) : totalInvoices === 0 ? (
        <div className="bg-delta p-6 rounded-lg shadow mb-6">
          <p className="text-red-500 text-center font-medium">
            No invoices available.
          </p>
        </div>
      ) : (
        <div className="bg-delta shadow">
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
                  Created At
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border">
                  Invoice Identifier
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border">
                  Created By
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border">
                  Customer
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border">
                  Total Price
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border">
                  Status
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {[...currentRecords].reverse().map((invoice) => (
                <tr key={invoice._id} className="hover:bg-gray-100 border-b">
                  <td className="px-4 py-2 border">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-blue-600"
                      checked={selectedInvoices.includes(invoice._id)}
                      onChange={() => handleCheckboxChange(invoice._id)}
                    />
                  </td>
                  <td
                    className="px-4 py-2 border"
                    onClick={() => navigate(`/view-invoice/${invoice._id}`)}
                  >
                    {invoice.createdAt
                      ? new Date(invoice.createdAt).toLocaleDateString()
                      : "Unknown"}
                  </td>
                  <td
                    className="px-4 py-2 border"
                    onClick={() => navigate(`/view-invoice/${invoice._id}`)}
                  >
                    {invoice.invoice_Identifier || "Unknown"}
                  </td>
                  <td
                    className="px-4 py-2 border"
                    onClick={() => navigate(`/view-invoice/${invoice._id}`)}
                  >
                    {invoice.invoice_Creater || "N/A"}
                  </td>
                  <td
                    className="px-4 py-2 border"
                    onClick={() => navigate(`/view-invoice/${invoice._id}`)}
                  >
                    {
                      invoice.invoice_CustomerDetails?.customer_GeneralDetails
                        ?.customer_DisplayName || "Unknown"
                    }
                  </td>
                  <td
                    className="px-4 py-2 border"
                    onClick={() => navigate(`/view-invoice/${invoice._id}`)}
                  >
                    {invoice.invoice_AfterDiscountPrice || "N/A"}
                  </td>
                  <td
                    className="px-4 py-2 border"
                    onClick={() => navigate(`/view-invoice/${invoice._id}`)}
                  >
                    {invoice.invoice_Details?.status || "N/A"}
                  </td>
                  <td className="px-4 py-2 border">
                    <select
                      className="relative px-2 py-1"
                      onChange={(e) => {
                        const selectedAction = e.target.value;
                        if (selectedAction === 'delete') {
                          handleDeleteInvoice(invoice._id);
                        } 
                        else if (selectedAction === 'invoiceapprove') {
                          handleApproveInvoice(invoice._id);
                        }
                        else if (selectedAction === 'cancel') {
                          setShowActionPopup(null);
                        }
                      }}
                    >
                      <option value="">Choose an Action</option>
                      <option value="delete">Delete Invoice</option>
                      <option value="cancel">Cancel</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end items-center space-x-4 m-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center px-4 py-2 mb-2 bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-100"
            >
              <i className="fas fa-arrow-left mr-2"></i> Previous
            </button>

            <span>
              Page {currentPage} of{" "}
              {Math.ceil(filteredInvoices.length / recordsPerPage)}
            </span>

            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={
                currentPage === Math.ceil(filteredInvoices.length / recordsPerPage)
              }
              className="flex items-center px-4 py-2 mb-2 bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-100"
            >
              Next <i className="fas fa-arrow-right ml-2"></i>
            </button>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        title={modalTitle}
        message={modalMessage}
        onClose={() => setIsModalOpen(false)}
        onConfirm={modalAction}
      />
    </div>
  );
};

export default PanelInvoice;
