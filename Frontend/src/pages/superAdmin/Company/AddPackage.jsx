import React, { useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const AddPackage = () => {
  const [formData, setFormData] = useState({
    package_Name: "",
    package_Description: "",
    package_price: "",
    package_Services: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const jwtLoginToken = localStorage.getItem("jwtLoginToken");
    if (!jwtLoginToken) {
      setMessage("User is not logged in!");
      setLoading(false);
      return;
    }

    const dataToSend = {
      package_Name: formData.package_Name,
      package_Description: formData.package_Description,
      package_price: Number(formData.package_price),
      package_Services: formData.package_Services
        .split(",")
        .map((service) => service.trim()),
    };

    try {
      const response = await axios.post(
        `${API_URL}/superadmin/package/create-package`,
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtLoginToken}`,
          },
        }
      );
      setMessage("Package added successfully!");
    } catch (error) {
      setMessage("Failed to add package. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Add Package</h2>
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
              htmlFor="package_Name"
              className="block text-sm font-medium text-gray-700"
            >
              Package Name
            </label>
            <input
              type="text"
              id="package_Name"
              name="package_Name"
              value={formData.package_Name}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            />
          </div>
          <div>
            <label
              htmlFor="package_Description"
              className="block text-sm font-medium text-gray-700"
            >
              Package Description
            </label>
            <textarea
              id="package_Description"
              name="package_Description"
              value={formData.package_Description}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="package_price"
              className="block text-sm font-medium text-gray-700"
            >
              Package Price
            </label>
            <input
              type="number"
              id="package_price"
              name="package_price"
              value={formData.package_price}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            />
          </div>
          <div>
            <label
              htmlFor="package_Services"
              className="block text-sm font-medium text-gray-700"
            >
              Package Services (comma-separated)
            </label>
            <input
              type="text"
              id="package_Services"
              name="package_Services"
              value={formData.package_Services}
              onChange={handleChange}
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
              {loading ? "Adding..." : "Add Package"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPackage;
