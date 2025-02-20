import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import GoogleLogo from "../assets/images/google-logo.png";
import LoginPageImage from "../assets/images/image1.png";

const API_URL = process.env.REACT_APP_API_URL;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      if (response.status === 200 && response.data.success) {
        const { user, jwtLoginToken } = response.data.information;

        // Dispatch the user information to the Redux store
        dispatch(login(user));
        // Save the JWT token in localStorage
        localStorage.setItem("jwtLoginToken", jwtLoginToken);
        // Navigate based on user role
        if (user.access === "SuperAdmin") {
          navigate(`/superadmin/${user.name}`);
        } else if (user.access === "Admin") {
          navigate(`/admin/${user.name}`);
        } else if (user.access === "HR") {
          navigate(`/hr/${user.name}`);
        }else if(user.access==="Sales"){
          navigate(`/sales/${user.name}`);
        }
        
        else {
          alert("Role not supported");
        }
      } else {
        throw new Error("Invalid login response");
      }
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Section with Image */}
      <div className="flex flex-1 items-center justify-center bg-blue-50">
        <div className="flex flex-1 lg:flex-[1.5] items-center justify-center bg-blue-50">
          <div className="max-w-md">
            <img
              src={LoginPageImage} // Correctly uses the imported image variable
              alt="Illustration"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* Right Section with Form */}
      <div className="flex flex-1 items-center justify-center bg-white">
        <div className="w-full max-w-sm p-6 bg-white shadow-md rounded-lg">
          <div>
            <h1 className="text-left text-2xl font-semibold text-gray-800">
              Welcome to CRM
            </h1>
            <p className="text-sm text-gray-500 text-left mb-6">
              Your admin dashboard
            </p>
          </div>

          {/* Google Sign-in Button */}
          <div className="flex justify-start">
            <button className="flex items-center gap-2 py-2 px-4 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition">
              <img
                src={GoogleLogo} // Correctly uses the imported Google logo variable
                alt="Google Logo"
                className="w-5 h-5"
              />
              Sign in with Google
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="text-xs text-gray-500">or sign in manually</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-bold text-left text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-bold text-left text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                autoComplete="current-password"
              />
            </div>

            {/* Options */}
            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-gray-600">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="ml-2">Remember this device</span>
              </label>
              <a href="/" className="text-sm text-blue-500 hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Sign In
            </button>
          </form>

          {/* Signup Link */}
          <p className="text-sm text-left text-gray-500 mt-6">
            New to CRM?{" "}
            <a href="/" className="text-blue-500 hover:underline">
              Create an account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
