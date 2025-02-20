import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Assuming you use react-router-dom for navigation

const API_URL = process.env.REACT_APP_API_URL;

const PanelCompany = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const jwtLoginToken = localStorage.getItem("jwtLoginToken");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      if (!jwtLoginToken) {
        setError("Authentication token missing. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${API_URL}/superadmin/company/get-companies`,
          {
            headers: {
              Authorization: `Bearer ${jwtLoginToken}`,
            },
          }
        );
        setCompanies(response.data.information.companies || []);
      } catch (err) {
        setError(err.response?.data?.message || "No Companies");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleAddAdmin = (companyId) => {
    navigate(`/superadmin/${companyId}/add-admin-to-company`);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-lg rounded-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Companies</h2>
        </div>
        {loading ? (
          <div className="p-4 text-center text-gray-500">
            Loading companies...
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : companies.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No companies found.
          </div>
        ) : (
          <table className="w-full border-collapse text-sm text-gray-700">
            <thead className="bg-gray-50 border-b text-left">
              <tr>
                <th className="p-3">Company ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Address</th>
                <th className="p-3">Package</th>
                <th className="p-3">Created At</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr className="border-b hover:bg-gray-100" key={company._id}>
                  <td className="p-3">{company.companyId}</td>
                  <td className="p-3">{company.company_Name}</td>
                  <td className="p-3">{company.company_Email}</td>
                  <td className="p-3">{company.company_Address}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-md text-white ${
                        company.package_Type?.package_Name === "free"
                          ? "bg-blue-500"
                          : "bg-green-500"
                      }`}
                    >
                      {company.package_Type?.package_Name || "N/A"}
                    </span>
                  </td>
                  <td className="p-3">
                    {new Date(company.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleAddAdmin(company.companyId)}
                      className="flex items-center justify-center px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      title="Add Admin"
                    >
                      <span className="text-lg font-bold">+ Add Admin</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PanelCompany;
