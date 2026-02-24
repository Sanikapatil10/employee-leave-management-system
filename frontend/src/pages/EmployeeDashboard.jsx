// src/pages/EmployeeDashboard.jsx
import "../styles/dashboard.css";

function EmployeeDashboard({ leaves, refreshLeaves }) {
  const user = JSON.parse(localStorage.getItem("user"));

  const totalLeaves = leaves.length;
  const approved = leaves.filter(l => l.status.toLowerCase() === "approved").length;
  const pending = leaves.filter(l => l.status.toLowerCase() === "pending").length;
  const remaining = 20 - totalLeaves; // assuming 20 annual leaves

  // helper to capitalize leave type
  const formatLeaveType = (type) => {
    if (!type) return "";
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name}</h1>
        <p>Here's an overview of your leave status</p>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h3>Total Leaves Taken</h3>
          <h2>{totalLeaves}</h2>
          <p>Out of 20 days</p>
        </div>

        <div className="card">
          <h3>Remaining Leaves</h3>
          <h2>{remaining}</h2>
          <p>Available days</p>
        </div>

        <div className="card">
          <h3>Pending Requests</h3>
          <h2>{pending}</h2>
          <p>Awaiting approval</p>
        </div>

        <div className="card">
          <h3>Approved Leaves</h3>
          <h2>{approved}</h2>
          <p>This year</p>
        </div>
      </div>

      <div className="table-card">
        <h3>Recent Leave Requests</h3>
        {leaves.length === 0 ? (
          <p className="empty-text">No leave requests found. Apply for a leave to get started.</p>
        ) : (
          <table className="leave-table">
            <thead>
              <tr>
                <th>Leave Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Days</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.slice(-5).map(leave => (
                <tr key={leave.id}>
                  <td className="leave-type">{formatLeaveType(leave.leave_type || leave.leaveType)}</td>
                  <td>{leave.start_date}</td>
                  <td>{leave.end_date}</td>
                  <td>{leave.days}</td>
                  <td className={`status ${leave.status.toLowerCase()}`}>{leave.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default EmployeeDashboard;