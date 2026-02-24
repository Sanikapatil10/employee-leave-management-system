// src/App.js
import { useState, useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

import EmployeeDashboard from "./pages/EmployeeDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import LeaveRequests from "./pages/LeaveRequests";
import ApplyLeave from "./pages/ApplyLeave";
import MyLeaves from "./pages/MyLeaves";
import Login from "./pages/Login";
import Register from "./pages/Register";
import axios from "axios";

function App() {
  const location = useLocation();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [leaves, setLeaves] = useState([]);

  const role = user?.role?.toLowerCase();
  const hideSidebar = location.pathname === "/" || location.pathname === "/register";

  // Fetch employee leaves dynamically
  const refreshLeaves = async () => {
    if (!user || role === "admin") return;
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:5000/api/leaves/my-leaves", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaves(res.data); // store leaves
    } catch (err) {
      console.error("Failed to fetch leaves:", err.response?.data || err);
    }
  };

  useEffect(() => {
    refreshLeaves();
  }, [user]);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setLeaves([]);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {!hideSidebar && user && <Sidebar user={user} onLogout={handleLogout} />}

      <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
        <Routes>
          {/* PUBLIC */}
          <Route path="/" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />

          {/* DASHBOARD */}
          <Route
            path="/dashboard"
            element={
              !user ? (
                <Navigate to="/" />
              ) : role === "admin" ? (
                <AdminDashboard />
              ) : (
                <EmployeeDashboard leaves={leaves} refreshLeaves={refreshLeaves} />
              )
            }
          />

          {/* EMPLOYEE */}
          <Route
            path="/apply-leave"
            element={
              <ProtectedRoute allowedRoles={["employee"]}>
                <ApplyLeave refreshLeaves={refreshLeaves} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-leaves"
            element={
              <ProtectedRoute allowedRoles={["employee"]}>
                <MyLeaves leaves={leaves} refreshLeaves={refreshLeaves} />
              </ProtectedRoute>
            }
          />

          {/* ADMIN */}
          <Route
            path="/leave-requests"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <LeaveRequests />
              </ProtectedRoute>
            }
          />

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;