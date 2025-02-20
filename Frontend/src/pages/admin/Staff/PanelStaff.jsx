import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL;

const Modal = ({ isOpen, title, message, onClose, onConfirm }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg w-96">
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

const PanelStaff = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalAction, setModalAction] = useState(null);
  const navigate = useNavigate();
  const jwtLoginToken = localStorage.getItem("jwtLoginToken");

  const pageSize = 5;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/department/get-employees`,
          {
            headers: {
              Authorization: `Bearer ${jwtLoginToken}`,
            },
          }
        );

        const enrichedUsers = response.data.information.users
          .filter((user) => !user.deleted)
          .map((user) => {
            let department = "Unknown";

            if (user.access === "HR") department = "HR";
            if (user.access === "Admin") department = "Admin";
            if (user.access === "Sales") department = "Sales";

            return {
              ...user,
              department,
            };
          });

        setUsers(enrichedUsers);
      } catch (err) {
        setError("Error fetching staff data");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [jwtLoginToken]);

  const handleDelete = (email) => {
    setModalTitle("Delete Staff Member");
    setModalMessage("Are you sure you want to delete this staff member?");
    setModalAction(() => async () => {
      try {
        await axios.delete(`${API_URL}/department/delete-employee`, {
          data: { email },
          headers: {
            Authorization: `Bearer ${jwtLoginToken}`,
          },
        });

        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.email !== email)
        );
        setIsModalOpen(false);
      } catch (error) {
        alert("Failed to delete staff member. Try again.");
      }
    });
    setIsModalOpen(true);
  };

  const handleUpdate = (userId) => {
    navigate(`/update-staff/${userId}`);
  };

  const handleAddStaff = () => {
    navigate("/addStaff");
  };

  const totalPages = Math.ceil(users.length / pageSize);
  const currentPageData = users.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const renderPageNumbers = () => {
    return Array.from({ length: totalPages }, (_, index) => (
      <button
        key={index + 1}
        onClick={() => setCurrentPage(index + 1)}
        className={`px-3 py-1 rounded ${
          currentPage === index + 1
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-blue-500 hover:bg-blue-100"
        }`}
      >
        {index + 1}
      </button>
    ));
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Staff Management</h2>
        <button
          onClick={handleAddStaff}
          className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
        >
          Add Staff
        </button>
      </div>

      <div className="bg-white rounded shadow p-4">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">#</th>
              <th className="py-2">Name</th>
              <th className="py-2">Department</th>
              <th className="py-2">Email</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.map((user, index) => (
              <tr key={user._id} className="border-b">
                <td className="py-2">{(currentPage - 1) * pageSize + index + 1}</td>
                <td className="py-2">{user.name}</td>
                <td className="py-2">{user.department}</td>
                <td className="py-2">{user.email}</td>
                <td className="py-2 flex space-x-3">
                  <button
                    onClick={() => handleUpdate(user.userId)}
                    className="text-yellow-500"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(user.email)}
                    className="text-red-500"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end items-center mt-4 space-x-2">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${
            currentPage === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-200 text-blue-500 hover:bg-blue-100"
          }`}
        >
          Previous
        </button>
        {renderPageNumbers()}
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded ${
            currentPage === totalPages
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-200 text-blue-500 hover:bg-blue-100"
          }`}
        >
          Next
        </button>
      </div>

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

export default PanelStaff;
