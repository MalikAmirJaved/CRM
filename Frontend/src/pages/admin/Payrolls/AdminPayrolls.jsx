import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const AdminPayrolls = () => {
  const [currentPage, setCurrentPage] = useState(1); // State to manage the current page

  // Employee data (split into pages)
  const employees = {
    1: [
      {
        name: "South Shyanne",
        email: "southshyanne@example.com",
        role: "Web Developer",
        salary: "$2000",
        status: "Done",
        statusColor: "bg-blue-500",
      },
      {
        name: "Zoe Baker",
        email: "zoebaker@example.com",
        role: "Graphics Designer",
        salary: "$770",
        status: "Done",
        statusColor: "bg-blue-500",
      },
      {
        name: "Colin Brown",
        email: "colinbrown@example.com",
        role: "HTML Developer",
        salary: "$653",
        status: "Pending",
        statusColor: "bg-yellow-500",
      },
      {
        name: "Kevin Gill",
        email: "kevingill@example.com",
        role: "Mobile Developer",
        salary: "$813",
        status: "Pending",
        statusColor: "bg-yellow-500",
      },
    ],
    2: [
      {
        name: "Brandon Smith",
        email: "brandonsmith@example.com",
        role: "Java FrontEnd",
        salary: "$963",
        status: "Done",
        statusColor: "bg-blue-500",
      },
      {
        name: "Colin Brown",
        email: "colinbrown@example.com",
        role: "Designer",
        salary: "$431",
        status: "Pending",
        statusColor: "bg-yellow-500",
      },
      {
        name: "Kevin Gill",
        email: "kevingill@example.com",
        role: "Team Leader",
        salary: "$543",
        status: "Pending",
        statusColor: "bg-yellow-500",
      },
      {
        name: "Brandon Smith",
        email: "brandonsmith@example.com",
        role: "Mobile",
        salary: "$1,090",
        status: "Done",
        statusColor: "bg-blue-500",
      },
    ],
  };

  const statistics = [
    { title: "Web Developer", amount: "$18,960", change: "1.52%" },
    { title: "App Developer", amount: "$11,783", change: "11.38%" },
    { title: "Designer", amount: "$2,254", change: "9.61%" },
    { title: "Marketing", amount: "$8,751", change: "1.22%" },
  ];

  // Navigate to specific page
  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= Object.keys(employees).length) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      

      {/* Employee Table Section */}
      <div className="bg-white p-4 rounded shadow">
        
       
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">EMPLOYEE</th>
                <th className="py-2">ROLE</th>
                <th className="py-2">SALARY</th>
                <th className="py-2">STATUS</th>
                <th className="py-2">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {employees[currentPage]?.map((employee, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-white">
                        {employee.name[0]}
                      </div>
                      <div>
                        <p className="font-bold">{employee.name}</p>
                        <p className="text-sm text-gray-500">{employee.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-2">{employee.role}</td>
                  <td className="py-2">{employee.salary}</td>
                  <td className="py-2">
                    <span
                      className={`text-white px-3 py-1 rounded-full text-sm ${employee.statusColor}`}
                    >
                      {employee.status}
                    </span>
                  </td>
                  <td className="py-2 flex space-x-3">
                    <button className="text-blue-500">
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button className="text-yellow-500">
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className="text-red-500">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-500">
            Showing {currentPage} of {Object.keys(employees).length} pages
          </p>
          <div className="flex items-center space-x-1">
            <button
              className={`px-2 py-1 text-sm rounded ${
                currentPage === 1 ? "bg-gray-200 text-gray-500" : "bg-blue-500 text-white"
              }`}
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Object.keys(employees).map((page) => (
              <button
                key={page}
                className={`px-2 py-1 text-sm rounded ${
                  currentPage === Number(page)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
                onClick={() => goToPage(Number(page))}
              >
                {page}
              </button>
            ))}
            <button
              className={`px-2 py-1 text-sm rounded ${
                currentPage === Object.keys(employees).length
                  ? "bg-gray-200 text-gray-500"
                  : "bg-blue-500 text-white"
              }`}
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === Object.keys(employees).length}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPayrolls;
