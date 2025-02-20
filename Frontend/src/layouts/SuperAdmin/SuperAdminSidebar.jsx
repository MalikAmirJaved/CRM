import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronRight,
  faBuilding,
} from "@fortawesome/free-solid-svg-icons";

const SuperAdminSidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const [activeItem, setActiveItem] = useState(null); // Track the currently active item
  const [openDropdowns, setOpenDropdowns] = useState({
    company: false,
  });

  const toggleDropdown = (section) => {
    setOpenDropdowns((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const handleOptionClick = (item) => {
    setActiveItem(item); // Update the active item
    if (isSidebarOpen) toggleSidebar();
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-20 w-64 bg-gray-100 shadow-lg transform transition-transform duration-300 ${
        isSidebarOpen ? "translate-x-0" : "lg:translate-x-0 -translate-x-full"
      }`}
    >
      <div className="mt-4 overflow-y-auto h-[calc(100vh-6rem)]">
        <ul className="text-gray-800">
          {/* Company */}
          <li>
            <div
              className="flex items-center justify-between p-3 cursor-pointer hover:bg-blue-100 rounded-lg transition duration-200"
              onClick={() => toggleDropdown("company")}
            >
              <div className="flex items-center space-x-2 group">
                <FontAwesomeIcon
                  icon={faBuilding}
                  className="text-gray-900 group-hover:text-gray-900 transition duration-200"
                />
                <span className="group-hover:text-gray-900 transition duration-200">
                  Company
                </span>
              </div>
              <FontAwesomeIcon
                icon={openDropdowns.company ? faChevronDown : faChevronRight}
                className="text-gray-900 group-hover:text-gray-900 transition duration-200"
              />
            </div>
            {openDropdowns.company && (
              <ul className="ml-6 mt-2 space-y-2 text-gray-600">
                <li>
                  <Link
                    to="/superadmin/add-company"
                    className={`flex items-center space-x-2 p-2 rounded-lg transition duration-200 ${
                      activeItem === "add-company"
                        ? "bg-blue-500 text-white"
                        : "hover:text-gray-900"
                    }`}
                    onClick={() => handleOptionClick("add-company")}
                  >
                    <FontAwesomeIcon icon={faBuilding} />
                    <span>Add Company</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/superadmin/companies"
                    className={`flex items-center space-x-2 p-2 rounded-lg transition duration-200 ${
                      activeItem === "companies"
                        ? "bg-blue-500 text-white"
                        : "hover:text-gray-900"
                    }`}
                    onClick={() => handleOptionClick("companies")}
                  >
                    <FontAwesomeIcon icon={faBuilding} />
                    <span>Companies</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/superadmin/add-package"
                    className={`flex items-center space-x-2 p-2 rounded-lg transition duration-200 ${
                      activeItem === "add-package"
                        ? "bg-blue-500 text-white"
                        : "hover:text-gray-900"
                    }`}
                    onClick={() => handleOptionClick("add-package")}
                  >
                    <FontAwesomeIcon icon={faBuilding} />
                    <span>Add Package</span>
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SuperAdminSidebar;
