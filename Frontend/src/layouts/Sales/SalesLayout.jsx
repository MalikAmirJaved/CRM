import React, { useState } from "react";
import SalesSidebar from "./SalesSidebar";
import SalesNavbar from "./SalesNavbar";

const SalesLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <div className="z-20">
        <SalesNavbar toggleSidebar={toggleSidebar} />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`z-10 transform transition-transform duration-300 bg-gray-100 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 lg:static w-64`}
        >
          <SalesSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </div>

        {/* Main Content */}
        <div className="flex-1  overflow-y-auto bg-gray-50 p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SalesLayout;
