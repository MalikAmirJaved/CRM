import React from "react";
import HrNavbar from "./HrNavbar";
import  HrSideBar from "./HrSideBar";

const HrLayout = ({ children }) => {
  return (
    <>
      {/* Navbar */}
      <HrNavbar />

      {/*/HrSideBar and Main Content */}
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 text-white">
          <HrSideBar />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto bg-gray-100">
          <div className="p-6">{children}</div>
        </div>
      </div>
    </>
  );
};

export default HrLayout;
