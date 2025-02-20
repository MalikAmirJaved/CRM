import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";

const HrNavbar = () => {
  const dispatch = useDispatch();
  const name = useSelector((state) => state.auth.user?.name);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="bg-gray-100 text-black p-4 flex justify-between items-center border-b border-gray-300">
      <div className="text-sm font-medium">
        Welcome to Human Resource DashBoard<br/>{name}
      </div>
      <button
        onClick={handleLogout}
        className="font-medium py-1 px-3 rounded hover:bg-brown-600 transition duration-300"
        style={{
          backgroundColor: "#D2B48C", // Light brown
          color: "#fff", // White text
        }}
      >
        Logout
      </button>
    </nav>
  );
};

export default HrNavbar;
