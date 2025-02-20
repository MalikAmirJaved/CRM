import React, { useState, useEffect } from "react";
import { LineChart, Line, BarChart, Bar, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { FiUsers } from "react-icons/fi";
import { FaCalendarAlt, FaRegMoneyBillAlt, FaRegChartBar, FaUserTie } from "react-icons/fa";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { useSelector } from "react-redux";

const data = [
  { name: "Jan", Design: 400, Development: 240, Marketing: 300 },
  { name: "Feb", Design: 300, Development: 139, Marketing: 200 },
  { name: "Mar", Design: 200, Development: 180, Marketing: 278 },
  { name: "Apr", Design: 278, Development: 390, Marketing: 250 },
];

const revenueData = [
  { name: "Jan", value: 200 },
  { name: "Feb", value: 400 },
  { name: "Mar", value: 300 },
  { name: "Apr", value: 500 },
];

const AdminDashboard = () => {
  const [balance, setBalance] = useState(0);
  const [animatedData, setAnimatedData] = useState([]);
  const { user } = useSelector((state) => state.auth); // Access the logged-in user from Redux

  useEffect(() => {
    // Animate balance counter
    let currentBalance = 0;
    const targetBalance = 20508;
    const balanceInterval = setInterval(() => {
      currentBalance += 100;
      if (currentBalance >= targetBalance) {
        currentBalance = targetBalance;
        clearInterval(balanceInterval);
      }
      setBalance(currentBalance);
    }, 30);

    return () => {
      clearInterval(balanceInterval);
    };
  }, []);

  const areaChartData = [
    { name: "Start", balance: 0 },
    { name: "Bank of America", balance: 628 },
    { name: "RBC Bank", balance: 1160 },
    { name: "First Bank", balance: 1781 },
    { name: "Total", balance: 20508 },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-100 p-4 md:p-6">
      {/* Welcome Section */}
      <div className="mb-6 p-4 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Welcome {user?.name || "User"}!
        </h2>
        <p className="text-gray-500">
          Measure how fast you're growing monthly recurring revenue.{" "}
          <a href="#" className="text-blue-500">
            Learn More
          </a>
        </p>
      </div>

      {/* Quick Stats Section */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-6">
        {[ // Quick Stats Data
          { icon: <FiUsers />, title: "Users", count: 5 },
          { icon: <FaCalendarAlt />, title: "Holidays", count: 8 },
          { icon: <FaRegChartBar />, title: "Events", count: 15 },
          { icon: <FaRegMoneyBillAlt />, title: "Payroll", count: 20 },
          { icon: <FaUserTie />, title: "Accounts", count: 12 },
          { icon: <HiOutlineDocumentReport />, title: "Reports", count: 30 },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="p-4 bg-white shadow-md rounded-lg text-center transform hover:scale-105 transition-transform duration-200"
          >
            <div className="text-gray-500 text-4xl mx-auto mb-2">{stat.icon}</div>
            <h3 className="text-gray-800 text-2xl font-bold">{stat.count}</h3>
            <p className="text-gray-600">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Salary Statistics */}
        <div className="p-4 bg-white shadow-md rounded-lg transform hover:scale-105 transition-transform duration-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Salary Statistics</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data}>
              <Tooltip />
              <Bar dataKey="Design" fill="#8884d8" />
              <Bar dataKey="Development" fill="#82ca9d" />
              <Bar dataKey="Marketing" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
          <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg">
            Generate Report
          </button>
        </div>

        {/* Revenue */}
        <div className="p-4 bg-white shadow-md rounded-lg transform hover:scale-105 transition-transform duration-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Revenue</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={revenueData}>
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
          <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg">
            Send Report
          </button>
        </div>

        {/* My Balance with Mountain Graph */}
        <div className="p-4 bg-white shadow-md rounded-lg transform hover:scale-105 transition-transform duration-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">My Balance</h3>
          <p className="text-3xl font-bold text-gray-800">${balance.toLocaleString()}</p>
          <div className="mt-4">
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={areaChartData}>
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="#8884d8"
                  fillOpacity={0.3}
                  fill="#8884d8"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
