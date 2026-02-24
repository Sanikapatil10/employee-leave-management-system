// src/pages/MyLeaves.jsx
import { useEffect } from "react";
import "../styles/MyLeaves.css";

function MyLeaves({ leaves = [], refreshLeaves }) {

  // Fetch latest leaves when page loads
  useEffect(() => {
    if (refreshLeaves) {
      refreshLeaves();
    }
  }, [refreshLeaves]);

  return (
    <div className="myleaves-container">
      <div className="myleaves-header">
        <h2>My Leaves</h2>
        <p>View and track your leave requests</p>
      </div>

      <div className="table-card">
        {leaves.length === 0 ? (
          <div className="no-data">No leave requests found.</div>
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
              {leaves.map((leave) => (
                <tr key={leave.id}>
                  <td>{leave.leaveType}</td>
                  <td>{leave.start_date}</td>
                  <td>{leave.end_date}</td>
                  <td>{leave.days}</td>
                  <td>
                    <span className={`status ${leave.status.toLowerCase()}`}>
                      {leave.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default MyLeaves;