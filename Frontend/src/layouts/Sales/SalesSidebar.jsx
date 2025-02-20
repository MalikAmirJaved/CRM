import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faChevronDown,
  faChevronRight,
  faHouse,
  faUserShield,
  faBuilding,
  faUserTie,
  faMoneyCheckDollar,
  faClipboardList,
  faReceipt,
  faCalendarAlt,
  faBoxOpen,
  faTruckLoading,
  faFileInvoiceDollar,
  faExchangeAlt,
  faUsers,
  faUserPen,
  faFileCirclePlus,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";
import companyLogo from "../../assets/images/CompanyLogo.jpg";
import "@fontsource/poppins"; // Import Poppins font

const SalesSidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const { user } = useSelector((state) => state.auth);
  const [activeItem, setActiveItem] = useState(null); // Track the currently active item
  const [openDropdowns, setOpenDropdowns] = useState({
    dashboard: false,
    sales: false,
    customers: false,
    reporting: false,
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
      className={`fixed inset-y-0 left-0 z-20 w-64 bg-white transform transition-transform duration-300 font-poppins ${
        isSidebarOpen ? "translate-x-0" : "lg:translate-x-0 -translate-x-full"
      }`}
    >
      <div className="m-8 h-[calc(100vh-6rem)]">
        <ul className="text-gray-800 font-poppins">
          {/* Dashboard */}
          <li
            className={`${
              activeItem === "dashboard" ? "bg-btnPrimaryClr text-white" : ""
            } flex items-center justify-between p-3 cursor-pointer hover:bg-blue-100 rounded-lg transition duration-200`}
            onClick={() => handleOptionClick("dashboard")}
          >
            <div className="flex items-center space-x-2 group">
              <FontAwesomeIcon
                icon={faHouse}
                className={`${
                  activeItem === "dashboard" ? "text-white" : "text-gray-900"
                } group-hover:text-gray-900 transition duration-200`}
              />
              <span
                className={`${
                  activeItem === "dashboard" ? "text-white" : "text-gray-900"
                } group-hover:text-gray-900 transition duration-200`}
              >
                Home
              </span>
            </div>
            <FontAwesomeIcon
              icon={openDropdowns.dashboard ? faChevronDown : faChevronRight}
              className={`${
                activeItem === "dashboard" ? "text-white" : "text-gray-900"
              } group-hover:text-gray-900 transition duration-200`}
            />
          </li>

          {/* Sales */}
          <li>
            <div
              className="flex items-center justify-between p-3 cursor-pointer hover:bg-blue-100 rounded-lg transition duration-200"
              onClick={() => toggleDropdown("sales")}
            >
              <div className="flex items-center space-x-2 group">
                <FontAwesomeIcon
                  icon={faClipboardList}
                  className="text-gray-900 group-hover:text-gray-900 transition duration-200"
                />
                <span className="group-hover:text-gray-900 transition duration-200">
                  Sales
                </span>
              </div>
              <FontAwesomeIcon
                icon={openDropdowns.sales ? faChevronDown : faChevronRight}
                className="text-gray-900 group-hover:text-gray-900 transition duration-200"
              />
            </div>
            {openDropdowns.sales && (
              <ul className="ml-6 mt-2 space-y-2 text-gray-600">
                <li>
                  <Link
                    to="/sales/customers"
                    className={`flex items-center space-x-2 p-2 rounded-lg transition duration-200 ${
                      activeItem === "customers"
                        ? "bg-btnPrimaryClr text-white"
                        : "hover:text-gray-900"
                    }`}
                    onClick={() => handleOptionClick("customers")}
                  >
                    <FontAwesomeIcon icon={faUsers} />
                    <span>Customers</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/sales/leads"
                    className={`flex items-center space-x-2 p-2 rounded-lg transition duration-200 ${
                      activeItem === "leads"
                        ? "bg-btnPrimaryClr text-white"
                        : "hover:text-gray-900"
                    }`}
                    onClick={() => handleOptionClick("leads")}
                  >
                    <FontAwesomeIcon icon={faUserPen} />
                    <span>Leads</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/sales/quotes"
                    className={`flex items-center space-x-2 p-2 rounded-lg transition duration-200 ${
                      activeItem === "quotes"
                        ? "bg-btnPrimaryClr text-white"
                        : "hover:text-gray-900"
                    }`}
                    onClick={() => handleOptionClick("quotes")}
                  >
                    <FontAwesomeIcon icon={faFileCirclePlus} />
                    <span>Quotes</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/sales/invoices"
                    className={`flex items-center space-x-2 p-2 rounded-lg transition duration-200 ${
                      activeItem === "invoices"
                        ? "bg-btnPrimaryClr text-white"
                        : "hover:text-gray-900"
                    }`}
                    onClick={() => handleOptionClick("invoices")}
                  >
                    <FontAwesomeIcon icon={faReceipt} />
                    <span>Invoices</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/sales/calendar"
                    className={`flex items-center space-x-2 p-2 rounded-lg transition duration-200 ${
                      activeItem === "calendar"
                        ? "bg-btnPrimaryClr text-white"
                        : "hover:text-gray-900"
                    }`}
                    onClick={() => handleOptionClick("calendar")}
                  >
                    <FontAwesomeIcon icon={faCalendarDays} />
                    <span>Calendar</span>
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

export default SalesSidebar;
