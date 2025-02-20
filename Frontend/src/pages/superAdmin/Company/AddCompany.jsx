import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const AddCompany = () => {
  const jwtLoginToken = localStorage.getItem("jwtLoginToken");
  const [formData, setFormData] = useState({
    company_Name: "",
    company_Email: "",
    company_Address: "",
    package_Type: "",
    company_Image: null,
  });

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/superadmin/package/get-packages`,
          {
            headers: {
              Authorization: `Bearer ${jwtLoginToken}`,
            },
          }
        );
        // Correctly access the packages array
        setPackages(response.data.information.packages || []);
      } catch (error) {
        console.error("Failed to fetch packages:", error);
        setMessage("Failed to load packages. Please try again.");
      }
    };

    fetchPackages();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, company_Image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formDataToSend = new FormData();
    formDataToSend.append("company_Name", formData.company_Name);
    formDataToSend.append("company_Email", formData.company_Email);
    formDataToSend.append("company_Address", formData.company_Address);
    formDataToSend.append("package_Type", formData.package_Type);
    formDataToSend.append("company_Image", formData.company_Image);

    try {
      const response = await axios.post(
        `${API_URL}/superadmin/company/add-company`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${jwtLoginToken}`,
          },
        }
      );

      setMessage("Company added successfully!");
    } catch (error) {
      setMessage("Failed to add company. Please try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Add Company</h2>
        {message && (
          <p
            className={`text-center text-sm ${
              message.includes("success") ? "text-green-600" : "text-red-600"
            } mb-4`}
          >
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="company_Name"
              className="block text-sm font-medium text-gray-700"
            >
              Company Name
            </label>
            <input
              type="text"
              id="company_Name"
              name="company_Name"
              value={formData.company_Name}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            />
          </div>
          <div>
            <label
              htmlFor="company_Email"
              className="block text-sm font-medium text-gray-700"
            >
              Company Email
            </label>
            <input
              type="email"
              id="company_Email"
              name="company_Email"
              value={formData.company_Email}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            />
          </div>
          <div>
            <label
              htmlFor="company_Address"
              className="block text-sm font-medium text-gray-700"
            >
              Company Address
            </label>
            <input
              type="text"
              id="company_Address"
              name="company_Address"
              value={formData.company_Address}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            />
          </div>
          <div>
            <label
              htmlFor="package_Type"
              className="block text-sm font-medium text-gray-700"
            >
              Package Type
            </label>
            <select
              id="package_Type"
              name="package_Type"
              value={formData.package_Type}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              required
            >
              <option value="" disabled>
                Select a package
              </option>
              {packages.map((pkg) => (
                <option key={pkg._id} value={pkg.package_Name}>
                  {pkg.package_Name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="company_Image"
              className="block text-sm font-medium text-gray-700"
            >
              Company Image
            </label>
            <input
              type="file"
              id="company_Image"
              name="company_Image"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? "Adding..." : "Add Company"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCompany;
