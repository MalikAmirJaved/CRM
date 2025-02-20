import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const AddStaff = () => {
  const [formData, setFormData] = useState({
    department_Name: "", // Default department
    employee_Name: "",
    employee_Email: "",
    employee_Password: "",
    employee_Address: "",
    employee_Contact: "",
    employee_Designation: "",
    employee_Image: null, // For image file
    previewUrl: null, // For image preview
  });

  const [departments, setDepartments] = useState([]);
  const [showNewProjectForm, setShowNewProjectForm] = useState(true);

  // Fetch departments when the form is shown
  useEffect(() => {
    if (showNewProjectForm) {
      const fetchDepartments = async () => {
        try {
          const jwtLoginToken = localStorage.getItem("jwtLoginToken");

          const response = await axios.get(
            `${API_URL}/department/get-departments`,
            {
              headers: { Authorization: `Bearer ${jwtLoginToken}` },
            }
          );

        
          const departmentData = response.data?.information?.departments || [];
          setDepartments(departmentData);
          
        } catch (err) {
          console.error("Error fetching departments:", err);
          setDepartments([]);
        }
      };

      fetchDepartments();
    }
  }, [showNewProjectForm]);

  // Handle input field changes (for text and select inputs)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle file input changes (for the image)
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData({
        ...formData,
        [name]: file,
        previewUrl: imageUrl, // Generate URL for preview
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("department_Name", formData.department_Name);
    formDataToSend.append("employee_Name", formData.employee_Name);
    formDataToSend.append("employee_Email", formData.employee_Email);
    formDataToSend.append("employee_Password", formData.employee_Password);
    formDataToSend.append("employee_Address", formData.employee_Address);
    formDataToSend.append("employee_Contact", formData.employee_Contact);
    formDataToSend.append("employee_Designation", formData.employee_Designation);

    if (formData.employee_Image) {
      formDataToSend.append("employee_Image", formData.employee_Image);
    }

    try {
      const jwtLoginToken = localStorage.getItem("jwtLoginToken");
      if (!jwtLoginToken) {
        alert("Unauthorized: Please log in.");
        return;
      }

      const response = await axios.patch(
        `${API_URL}/department/add-employee`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${jwtLoginToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        alert("Employee added successfully!");
        setFormData({
          department_Name: "",
          employee_Name: "",
          employee_Email: "",
          employee_Password: "",
          employee_Address: "",
          employee_Contact: "",
          employee_Designation: "",
          employee_Image: null,
          previewUrl: null,
        });
      } else {
        alert(`Failed to add employee: ${response.data.message}`);
      }
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">Add New Staff Member</h1>
        <button className="text-gray-500 hover:text-gray-800" onClick={() => setShowNewProjectForm(false)}>
          &times;
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Employee Image Box */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Profile Picture</label>
            <div className="w-36 h-36 mt-2 rounded-lg border-2 border-gray-300 bg-gray-100 flex items-center justify-center shadow-md hover:bg-gray-200 transition-all duration-300 ease-in-out">
              {formData.previewUrl ? (
                <img
                  src={formData.previewUrl}
                  alt="Profile Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <span className="text-gray-500">No Image</span>
              )}
            </div>
            <input
              type="file"
              name="employee_Image"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-4 w-full p-2 border rounded-lg bg-gray-50"
            />
          </div>

          {/* Department */}
          <div className="col-span-2">
            <label htmlFor="department_Name" className="block text-sm font-medium text-gray-700 mb-2">
              Department Name
            </label>
            <select
              id="department_Name"
              name="department_Name"
              value={formData.department_Name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            >
              <option value="">Select a Department</option>
              {departments.map((dept) => (
                <option key={dept.department_Name} value={dept.department_Name}>
                  {dept.department_Name}
                </option>
              ))}
            </select>
          </div>

          {/* Other Input Fields */}
          {["employee_Name", "employee_Email", "employee_Password", "employee_Address", "employee_Designation", "employee_Contact"].map((field) => (
            <div key={field}>
              <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-2">
                {field.replace("employee_", "").replace("_", " ")}
                <span className="text-red-500">*</span>
              </label>
              <input
                type={field === "employee_Password" ? "password" : "text"}
                id={field}
                name={field}
                placeholder={`Enter ${field.replace("employee_", "").replace("_", " ")}`}
                onChange={handleInputChange}
                value={formData[field]}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-6 gap-4">
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            onClick={() => setShowNewProjectForm(false)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStaff;
