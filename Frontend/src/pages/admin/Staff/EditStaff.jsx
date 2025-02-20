import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

const EditStaff = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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

  const [departments, setDepartments] = useState([]);
  const [employeeImageUrl, setEmployeeImageUrl] = useState("");
  const jwtLoginToken = localStorage.getItem("jwtLoginToken");

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/department/get-departments`,
          {
            headers: {
              Authorization: `Bearer ${jwtLoginToken}`,
            },
          }
        );
        const departmentData = response.data?.information?.departments || [];
        setDepartments(departmentData);
      } catch (err) {
        console.error("Failed to fetch departments:", err);
        setDepartments([]);
      }
    };

    fetchDepartments();
  }, [jwtLoginToken]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/department/get-employee/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${jwtLoginToken}`,
            },
          }
        );

        const user = response.data?.information?.user;
        const designation = response.data?.information?.employee_Designation;

        if (user) {
          setFormData({
            department_Name: user.department,
            employee_Name: user.name,
            employee_Email: user.email,
            employee_Password: "",
            employee_Address: user.address || "",
            employee_Contact: user.contact || "",
            employee_Designation: designation,
            employee_Image: null,
            previewUrl: null,
          });

          if (user.image?.filePath) {
            setEmployeeImageUrl(`${API_URL}${user.image.filePath}`);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user data", error);
        alert("Failed to load user data.");
      }
    };

    fetchUserData();
  }, [userId, jwtLoginToken]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFormData((prevData) => ({
        ...prevData,
        [name]: file,
        previewUrl,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("employee_NewDepartment", formData.department_Name);
    formDataToSend.append("employee_NewName", formData.employee_Name);
    formDataToSend.append("employee_NewEmail", formData.employee_Email);
    formDataToSend.append("employee_NewPassword", formData.employee_Password);
    formDataToSend.append("employee_NewDesignation", formData.employee_Designation);
    formDataToSend.append("employee_NewContact", formData.employee_Contact);
    formDataToSend.append("employee_NewAddress", formData.employee_Address);

    if (formData.employee_Image) {
      formDataToSend.append("employee_Image", formData.employee_Image);
    }

    try {
      const response = await axios.patch(
        `${API_URL}/department/update-employee/${userId}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${jwtLoginToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 && response.data.success) {
        alert("User information updated successfully!");
        navigate("/admin/department");
      } else {
        alert(`Failed to update employee: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Update failed", error);
      alert("Failed to update user information.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Edit Staff Information</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Employee Image */}
        <div className="text-center">
          <label className="block font-medium mb-2">Profile Picture</label>
          {formData.previewUrl ? (
            <img src={formData.previewUrl} alt="Profile Preview" className="w-32 h-32 mx-auto rounded-full mb-4" />
          ) : employeeImageUrl ? (
            <img src={employeeImageUrl} alt="Employee" className="w-32 h-32 mx-auto rounded-full mb-4" />
          ) : (
            <span className="text-gray-500">No Image</span>
          )}
          <input
            type="file"
            name="employee_Image"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>

        {/* Department Dropdown */}
        <div>
          <label htmlFor="department_Name" className="block font-medium mb-2">Department</label>
          <select
            id="department_Name"
            name="department_Name"
            value={formData.department_Name}
            onChange={handleInputChange}
            required
            className="block w-full px-4 py-2 border rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-500"
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.department_Name} value={dept.department_Name}>
                {dept.department_Name}
              </option>
            ))}
          </select>
        </div>

        {/* Input Fields */}
        {[
          { name: "employee_Name", type: "text", placeholder: "Enter Full Name" },
          { name: "employee_Email", type: "email", placeholder: "Enter Email" },
          { name: "employee_Password", type: "password", placeholder: "Enter Password" },
          { name: "employee_Address", type: "text", placeholder: "Enter Address" },
          { name: "employee_Contact", type: "tel", placeholder: "Enter Contact Number" },
          { name: "employee_Designation", type: "text", placeholder: "Enter Designation" }
        ].map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} className="block font-medium mb-2">
              {field.placeholder}
            </label>
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={handleInputChange}
              className="block w-full px-4 py-2 border rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-500"
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditStaff;
