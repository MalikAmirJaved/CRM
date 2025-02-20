import React from "react";
import {
  FaUsers,
  FaChartBar,
  FaFileInvoice,
  FaProjectDiagram,
} from "react-icons/fa";

const HrDashboard = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        HR Dashboard
      </h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Users */}
        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-700">Total Users</h3>
            <p className="text-2xl font-bold text-blue-500">1,245</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-full text-blue-500">
            <FaUsers size={30} />
          </div>
        </div>

        {/* Total Invoices */}
        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-700">
              Total Invoices
            </h3>
            <p className="text-2xl font-bold text-green-500">$15,630</p>
          </div>
          <div className="bg-green-100 p-4 rounded-full text-green-500">
            <FaFileInvoice size={30} />
          </div>
        </div>

        {/* Projects */}
        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-700">Projects</h3>
            <p className="text-2xl font-bold text-yellow-500">8 Active</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-full text-yellow-500">
            <FaProjectDiagram size={30} />
          </div>
        </div>

        {/* Analytics */}
        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-700">Analytics</h3>
            <p className="text-2xl font-bold text-purple-500">78%</p>
          </div>
          <div className="bg-purple-100 p-4 rounded-full text-purple-500">
            <FaChartBar size={30} />
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Recent Activity
        </h2>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-full text-blue-500">
              <FaUsers size={20} />
            </div>
            <div>
              <p className="text-gray-700 font-semibold">
                New user registration
              </p>
              <p className="text-sm text-gray-500">
                John Doe registered as a new user.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-3 rounded-full text-green-500">
              <FaFileInvoice size={20} />
            </div>
            <div>
              <p className="text-gray-700 font-semibold">New Invoice Created</p>
              <p className="text-sm text-gray-500">
                Invoice #1234 was created and sent to the client.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="bg-yellow-100 p-3 rounded-full text-yellow-500">
              <FaProjectDiagram size={20} />
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Project Completed</p>
              <p className="text-sm text-gray-500">
                The "Client Website Redesign" project was completed.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-3 rounded-full text-purple-500">
              <FaChartBar size={20} />
            </div>
            <div>
              <p className="text-gray-700 font-semibold">
                Analytics Report Updated
              </p>
              <p className="text-sm text-gray-500">
                Your monthly analytics report has been updated.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Graphs or Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Example: You can integrate a graph/chart library like Chart.js or Recharts here */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Sales Analytics
          </h2>
          <div className="bg-gray-200 h-56 rounded-md">
            {/* Chart or graph placeholder */}
            <p className="text-gray-500 text-center pt-20">
              Graph Placeholder (use chart library)
            </p>
          </div>
        </div>

        {/* Another Chart or Graph */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            User Growth
          </h2>
          <div className="bg-gray-200 h-56 rounded-md">
            {/* Chart or graph placeholder */}
            <p className="text-gray-500 text-center pt-20">
              Graph Placeholder (use chart library)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HrDashboard;
