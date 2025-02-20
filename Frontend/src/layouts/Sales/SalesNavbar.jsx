import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { logout } from "../../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  faUser,
  faEnvelope,
  faBell,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import companyLogo from "../../assets/images/CompanyLogo.jpg";

const SalesNavbar = ({ toggleSidebar }) => {
  const dispatch = useDispatch();
  const API_URL = process.env.REACT_APP_API_URL;
  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const jwtLoginToken = localStorage.getItem("jwtLoginToken");

  // Fetch notifications on component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${API_URL}/event/get-user-events`, {
          headers: {
            Authorization: `Bearer ${jwtLoginToken}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setNotifications(data.information.events);
          setUnreadCount(
            data.information.events.filter((n) => !n.event_Read).length
          );
        }
      } catch (error) {
        // console.error("Error fetching notifications:", error);
      }
    };

    if (jwtLoginToken) {
      // fetchNotifications(); 
      // const intervalId = setInterval(fetchNotifications, 1000); 

      // return () => clearInterval(intervalId); 
    }
  }, [API_URL, jwtLoginToken]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("jwtLoginToken");
  };

  // Mark notification as read

  const markAsRead = async (notificationId) => {
    try {
      const response = await axios.patch(
        `${API_URL}/event/marked-as-read/${notificationId}`,
        { read: true },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtLoginToken}`, // Ensure the token is passed
          },
        }
      );

      if (response.data.success) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification._id === notificationId
              ? { ...notification, event_Read: true }
              : notification
          )
        );
        setUnreadCount((prevCount) => prevCount - 1);
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <div className="relative  font-poppins bg-white text-black">
      {/* Primary Navbar */}
      <div className="flex items-center justify-between bg-white text-black h-20 px-4">
        {/* Logo and Company Name */}
        <div className="flex items-center space-x-4">
          <img
            src={companyLogo}
            alt="Company Logo"
            className="w-8 h-8 rounded"
          />
          <h1 className="text-lg font-bold">ACSSLC</h1>
        </div>

        {/* Navbar Controls */}
        <div className="flex items-center space-x-6">
          <FontAwesomeIcon icon={faEnvelope} className="hover:text-gray-500" />
          <div className="relative">
            <FontAwesomeIcon
              icon={faBell}
              className="hover:text-gray-500 cursor-pointer"
              onClick={() => setShowModal(true)} // Open modal
            />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <FontAwesomeIcon icon={faUser} className="hover:text-gray-500" />

          {/* Conditionally Show Login or Logout Button */}
          {jwtLoginToken ? (
            <button
              onClick={handleLogout}
              className="font-medium py-1 px-3 rounded hover:bg-red-600 transition duration-300 bg-red-500 text-white"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => {
                console.log("Redirecting to login...");
                // Add your login redirection logic here
              }}
              className="font-medium py-1 px-3 rounded hover:bg-green-600 transition duration-300 bg-green-500 text-white"
            >
              Login
            </button>
          )}

          {/* Sidebar Toggle Button */}
          <button
            className="md:hidden p-2 rounded bg-gray-300 hover:bg-gray-400"
            onClick={toggleSidebar}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
      </div>

      {/* Notification Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-96 p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Notifications</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowModal(false)}
              >
                ✖
              </button>
            </div>
            <div className="space-y-4">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-3 rounded ${
                      notification.event_Read ? "bg-gray-100" : "bg-blue-100"
                    }`}
                  >
                    <h1>{notification.event_Title}</h1>
                    <p>{notification.event_Description}</p>

                    {!notification.event_Read && (
                      <button
                        className="mt-2 text-sm text-white bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
                        onClick={() => markAsRead(notification._id)}
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No notifications available.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesNavbar;
