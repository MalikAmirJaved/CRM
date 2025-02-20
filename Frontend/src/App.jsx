import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminRoutes from "./routes/AdminRoutes";
import SuperAdminRoutes from "./routes/SuperAdminRoutes";
import SalesRoutes from "./routes/SalesRoutes";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        {SuperAdminRoutes()}
        {AdminRoutes()}
        {SalesRoutes()}
      </Routes>
    </Router>
  );
}; 

export default App;

