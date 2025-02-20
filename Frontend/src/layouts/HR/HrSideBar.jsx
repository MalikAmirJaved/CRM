import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  FaTachometerAlt,
  FaUsers,
  FaBriefcase,
  FaClipboardList,
  FaCalendarCheck,
  FaChalkboardTeacher,
  FaFileInvoiceDollar,
  FaHandHoldingUsd,
  FaChartLine,
  FaTools,
  FaRegFileAlt,
} from "react-icons/fa";

function HrSideBar() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="w-64 bg-gray-800 text-white p-6 flex flex-col space-y-6">
      <h2 className="text-2xl font-semibold text-center text-white">HR Dashboard</h2>

      <nav className="flex flex-col space-y-4">
        {/* Dashboard */}
        <Link
          to={`/hr/${user.name}`}
          className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded-md"
        >
          <FaTachometerAlt />
          <span>Dashboard</span>
        </Link>

        {/* Employee Management */}
        <Link
          to=""
          className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded-md"
        >
          <FaUsers />
          <span>Employee Management</span>
        </Link>

        {/* Recruitment and Onboarding */}
        <Link
          to=""
          className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded-md"
        >
          <FaChalkboardTeacher />
          <span>Recruitment & Onboarding</span>
        </Link>

        {/* Attendance and Leave Management */}
        <Link
          to=""
          className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded-md"
        >
          <FaCalendarCheck />
          <span>Attendance & Leave Management</span>
        </Link>

        {/* Performance Management */}
        <Link
          to=""
          className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded-md"
        >
          <FaChartLine />
          <span>Performance Management</span>
        </Link>

        {/* Payroll Management */}
        <Link
          to=""
          className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded-md"
        >
          <FaFileInvoiceDollar />
          <span>Payroll Management</span>
        </Link>

        {/* Training and Development */}
        <Link
          to=""
          className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded-md"
        >
          <FaChalkboardTeacher />
          <span>Training & Development</span>
        </Link>

        {/* Employee Self Services */}
        <Link
          to=""
          className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded-md"
        >
          <FaBriefcase />
          <span>Employee Self Services</span>
        </Link>

        {/* Compensation and Benefits */}
        <Link
          to=""
          className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded-md"
        >
          <FaHandHoldingUsd />
          <span>Compensation & Benefits</span>
        </Link>

        {/* Workforce Planning & Forecasting */}
        <Link
          to=""
          className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded-md"
        >
          <FaClipboardList />
          <span>Workforce Planning</span>
        </Link>

        {/* Tools Assigned */}
        <Link
          to=""
          className="flex items-center space-x-3 hover:bg-gray-700 p-2 rounded-md"
        >
          <FaTools />
          <span>Tools Assigned</span>
        </Link>
      </nav>
    </div>
  );
}

export default HrSideBar;
