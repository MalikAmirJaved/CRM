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

const PanelQuote = () => {
  const [quotes, setQuotes] = useState([]);
  const [quoteId, setQuoteId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [totalQuotes, setTotalQuotes] = useState(0);
  const [timeFilter, setTimeFilter] = useState("All");
  const [selectAll, setSelectAll] = useState(false);
  const [selectedQuotes, setSelectedQuotes] = useState([]);
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

  const handleNewQuote = () => {
    navigate("/add-quote");
  };

  const handleTimeFilterChange = (event) => {
    setTimeFilter(event.target.value);
  };

  const fetchQuotes = async () => {
    try {
      const response = await axios.get(`${API_URL}/quote/get-quotes`, {
        headers: { Authorization: `Bearer ${jwtLoginToken}` },
      });
      const quotesFetched = response.data.information;

      console.log(response.data)
      if (response.data.success) {

        let filteredQuotes = response.data.information.quotes;

        if (timeFilter !== "All") {
          const now = new Date();
          filteredQuotes = filteredQuotes.filter((quote) => {
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

        setQuotes(filteredQuotes);
        setTotalQuotes(filteredQuotes.length);
      } else {
        setError("No Quotes Available.");
      }
    } catch (err) {
      setError("No Quotes Available.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  /** Handle Checkbox Submission */
  const handleCheckboxChange = (quoteId) => {
    setSelectedQuotes((prev) =>
      prev.includes(quoteId)
        ? prev.filter((id) => id !== quoteId)
        : [...prev, quoteId].map((id) => id.toString().replace(/'/g, '"'))
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedQuotes([]); // Deselect all
    } else {
      setSelectedQuotes(quotes.map((quote) => quote._id)); // Select all quotes
    }
    setSelectAll(!selectAll);
  };

  const handleApproveQuote = (quoteId, status) => {
    if (status === "Approved") {
      setModalTitle("Approve Quote");
      setModalMessage("Quote is already approved.");
      setModalAction(null);
      setIsModalOpen(true);
      return;
    }
  
    setModalTitle("Approve Quote");
    setModalMessage("Are you sure you want to approve this quote?");
    setModalAction(() => async () => {
      setIsModalOpen(false);
      try {
        const response = await axios.patch(
          `${API_URL}/quote/approve/${quoteId}`,
          { quote_Identifier: quoteId },
          { headers: { Authorization: `Bearer ${jwtLoginToken}` } }
        );
  
        if (response.status === 200) {
          setQuotes((prevQuotes) =>
            prevQuotes.map((quote) =>
              quote._id === quoteId ? { ...quote, quote_Details: { status: "Approved" } } : quote
            )
          );
        }
      } catch (error) {
        // Handle the error response correctly
        let errorMessage = "Failed to approve the quote. Please try again.";
  
        if (error.response && error.response.status === 400) {
          errorMessage = error.response.data.message || "Quote is already approved.";
        }
  
        setModalTitle("Approve Quote");
        setModalMessage(errorMessage);
        setModalAction(null);
        setIsModalOpen(true);
      }
    });
    setIsModalOpen(true);
  };
  

  const handleDeleteQuote = (quoteId) => {
    setModalTitle("Delete Quote");
    setModalMessage("Are you sure you want to delete this quote?");
    setModalAction(() => async () => {
      setIsModalOpen(false);
      try {
        const response = await axios.delete(
          `${API_URL}/quote/delete/${quoteId}`,
          {
            headers: { Authorization: `Bearer ${jwtLoginToken}` },
            data: { quote_Identifier: quoteId },
          }
        );

        if (response.status === 200) {
          setQuotes((prevQuotes) =>
            prevQuotes.filter((quote) => quote._id !== quoteId)
          );
        }
      } catch (error) {
        setModalMessage("Failed to delete the quote. Please try again.");
        setModalAction(null);
        setIsModalOpen(true);
      }
    });
    setIsModalOpen(true);
  };

  const handleMassDelete = async () => {
    const userConfirmed = window.confirm(
      "Are you sure you want to delete the selected leads?"
    );
    if (!userConfirmed) {
      return;
    }
    try {
      const response = await axios.post(
        `${API_URL}/quote/mass-delete`, // POST request
        { leadIds: selectedQuotes }, // Sending selected Quotes in the request body
        {
          headers: { Authorization: `Bearer ${jwtLoginToken}`
      },
    }
    
      );
    } catch (error) {
      console.error(
        "Error during mass delete:",
        error.response?.data || error.message
      );
      alert("An error occurred while deleting leads. Please try again.");
    }
  };

  // Filter quotes based on search and time filter
  const filteredQuotes = quotes.filter((quote) => {
    const searchLower = search.toLowerCase();
    return (
      quote.quote_Identifier?.toLowerCase().includes(searchLower) ||
      quote.quote_Creater?.toLowerCase().includes(searchLower) ||
      quote.quote_CustomerDetails?.customer_GeneralDetails?.customer_DisplayName
        ?.toLowerCase()
        .includes(searchLower)
    );
  });

  const handleViewQuote = (quoteId) => {
    navigate(`/view-quote/${quoteId}`);
  };

  const currentRecords = filteredQuotes.slice(
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
        placeholder="Search for quotes..."
        value={search}
        onChange={handleSearchChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex p-4 justify-between items-center">
        <h1 className="text-3xl font-bold text-textPrimaryClr">Quotes</h1>
        <button
          onClick={handleNewQuote}
          className="bg-btnPrimaryClr text-white px-4 py-2 rounded-lg hover:bg-btnHoverClr transition"
        >
          + Quote
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-6">
          <p className="text-gray-600 text-lg">Loading quotes...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center py-6">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      ) : totalQuotes === 0 ? (
        <div className="bg-delta p-6 rounded-lg shadow mb-6">
          <p className="text-red-500 text-center font-medium">
            No quotes available.
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
                  Quote Identifier
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
              {[...currentRecords].reverse().map((quote) => (
                <tr key={quote._id} className="hover:bg-gray-100 border-b">
                  <td className="px-4 py-2 border">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-blue-600"
                      checked={selectedQuotes.includes(quote._id)}
                      onChange={() => handleCheckboxChange(quote._id)}
                    />
                  </td>
                  <td
                    className="px-4 py-2 border"
                    onClick={() => navigate(`/view-quote/${quote._id}`)}
                  >
                    {quote.createdAt
                      ? new Date(quote.createdAt).toLocaleDateString()
                      : "Unknown"}
                  </td>
                  <td
                    className="px-4 py-2 border"
                    onClick={() => navigate(`/view-quote/${quote._id}`)}
                  >
                    {quote.quote_Identifier || "Unknown"}
                  </td>
                  <td
                    className="px-4 py-2 border"
                    onClick={() => navigate(`/view-quote/${quote._id}`)}
                  >
                    {quote.quote_Creater || "N/A"}
                  </td>
                  <td
                    className="px-4 py-2 border"
                    onClick={() => navigate(`/view-quote/${quote._id}`)}
                  >
                    {
                      quote.quote_CustomerDetails?.customer_GeneralDetails
                        ?.customer_DisplayName || "Unknown"
                    }
                  </td>
                  <td
                    className="px-4 py-2 border"
                    onClick={() => navigate(`/view-quote/${quote._id}`)}
                  >
                    {quote.quote_AfterDiscountPrice || "N/A"}
                  </td>
                  <td
                    className="px-4 py-2 border"
                    onClick={() => navigate(`/view-quote/${quote._id}`)}
                  >
                    {quote.quote_Details?.status || "N/A"}
                  </td>
                  <td className="px-4 py-2 border">
  <select
    className="relative px-2 py-1"
    onChange={(e) => {
      const selectedAction = e.target.value;
      if (selectedAction === 'delete') {
        handleDeleteQuote(quote._id);
      } 
      else if (selectedAction === 'quoteapprove') {
       handleApproveQuote(quote._id);
      }

     
    }}
  >
    <option value="">Choose an Action</option>
    <option value="delete">Delete Quote</option>
    <option value="quoteapprove">Approve Quote</option>
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
              {Math.ceil(filteredQuotes.length / recordsPerPage)}
            </span>

            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={
                currentPage ===
                Math.ceil(filteredQuotes.length / recordsPerPage)
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

export default PanelQuote;
