// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/dashboard.css";

function AdminDashboard() {
  const [leaves, setLeaves] = useState([]);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/leaves/all",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = res.data;

      // Calculate stats
      const pending = data.filter(l => l.status === "pending").length;
      const approved = data.filter(l => l.status === "approved").length;
      const rejected = data.filter(l => l.status === "rejected").length;

      // Unique employees count
      const employees = [...new Set(data.map(l => l.user_id))];

      setStats({
        totalEmployees: employees.length,
        pending,
        approved,
        rejected,
      });

      setLeaves(data.slice(0, 5)); // recent 5 requests
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Overview of all leave requests and employee statistics</p>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-grid">
        <div className="card">
          <h3>Total Employees</h3>
          <h2>{stats.totalEmployees}</h2>
          <p>Active users</p>
        </div>

        <div className="card">
          <h3>Pending Requests</h3>
          <h2>{stats.pending}</h2>
          <p>Awaiting action</p>
        </div>

        <div className="card">
          <h3>Approved Leaves</h3>
          <h2>{stats.approved}</h2>
          <p>Total approved</p>
        </div>

        <div className="card">
          <h3>Rejected Leaves</h3>
          <h2>{stats.rejected}</h2>
          <p>Total rejected</p>
        </div>
      </div>

      {/* Recent Requests Table */}
      <div className="table-card">
        <h3>Recent Leave Requests</h3>
        <table className="leave-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Leave Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Duration</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {leaves.length === 0 ? (
              <tr>
                <td colSpan="6">No data found</td>
              </tr>
            ) : (
              leaves.map((leave) => {
                const start = new Date(leave.start_date);
                const end = new Date(leave.end_date);
                const days =
                  Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

                return (
                  <tr key={leave.id}>
                    <td>{leave.name}</td>
                    <td>{leave.leave_type}</td>
                    <td>{start.toLocaleDateString()}</td>
                    <td>{end.toLocaleDateString()}</td>
                    <td>{days} days</td>
                    <td className={`status ${leave.status}`}>
                      {leave.status}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;