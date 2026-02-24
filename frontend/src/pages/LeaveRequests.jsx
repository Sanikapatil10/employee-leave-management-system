import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/leaveRequests.css";

function LeaveRequests() {
  const [filter, setFilter] = useState("All");
  const [requests, setRequests] = useState([]);

  const token = localStorage.getItem("token");

  // Fetch all leave requests from backend
  const fetchRequests = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/leaves/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const formatted = res.data.map((leave) => {
        const start = new Date(leave.start_date);
        const end = new Date(leave.end_date);
        const days =
          Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

        return {
          id: leave.id,
          employee: leave.name || leave.email,
          type: leave.leave_type,
          start: start.toLocaleDateString(),
          end: end.toLocaleDateString(),
          duration: `${days} days`,
          reason: leave.reason || "-",
          status:
            leave.status.charAt(0).toUpperCase() +
            leave.status.slice(1),
        };
      });

      setRequests(formatted);
    } catch (err) {
      console.error("Error fetching leaves", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Approve Leave
  const handleApprove = async (id) => {
    try {
      await axios.put(
        "http://localhost:5000/api/leaves/status",
        {
          id: id,            // ✅ important
          status: "approved",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchRequests(); // refresh after update
    } catch (err) {
      console.error("Approve error", err.response?.data || err.message);
    }
  };

  // Reject Leave
  const handleReject = async (id) => {
    try {
      await axios.put(
        "http://localhost:5000/api/leaves/status",
        {
          id: id,            // ✅ important
          status: "rejected",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchRequests(); // refresh after update
    } catch (err) {
      console.error("Reject error", err.response?.data || err.message);
    }
  };

  // Filter logic
  const filteredRequests =
    filter === "All"
      ? requests
      : requests.filter((req) => req.status === filter);

  const countByStatus = (status) =>
    requests.filter((r) => r.status === status).length;

  return (
    <div className="leave-container">
      <h1>Leave Requests</h1>
      <p>Review and manage employee leave requests</p>

      {/* FILTER BUTTONS */}
      <div className="filter-box">
        <button
          className={filter === "All" ? "active" : ""}
          onClick={() => setFilter("All")}
        >
          All ({requests.length})
        </button>

        <button
          className={filter === "Pending" ? "active" : ""}
          onClick={() => setFilter("Pending")}
        >
          Pending ({countByStatus("Pending")})
        </button>

        <button
          className={filter === "Approved" ? "active" : ""}
          onClick={() => setFilter("Approved")}
        >
          Approved ({countByStatus("Approved")})
        </button>

        <button
          className={filter === "Rejected" ? "active" : ""}
          onClick={() => setFilter("Rejected")}
        >
          Rejected ({countByStatus("Rejected")})
        </button>
      </div>

      {/* TABLE */}
      <div className="table-card">
        <h3>All Requests ({filteredRequests.length})</h3>

        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Leave Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Duration</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredRequests.map((req) => (
              <tr key={req.id}>
                <td>{req.employee}</td>
                <td>{req.type}</td>
                <td>{req.start}</td>
                <td>{req.end}</td>
                <td>{req.duration}</td>
                <td className="reason-cell">{req.reason}</td>

                <td>
                  <span className={`status ${req.status.toLowerCase()}`}>
                    {req.status}
                  </span>
                </td>

                <td>
                  {req.status === "Pending" ? (
                    <>
                      <button
                        className="approve-btn"
                        onClick={() => handleApprove(req.id)}
                      >
                        ✔
                      </button>

                      <button
                        className="reject-btn"
                        onClick={() => handleReject(req.id)}
                      >
                        ✖
                      </button>
                    </>
                  ) : (
                    "Processed"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LeaveRequests;