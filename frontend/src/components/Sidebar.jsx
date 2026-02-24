// src/components/Sidebar.jsx
import { Link, useNavigate } from "react-router-dom";
import "../styles/sidebar.css";

const Sidebar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  
  // Debug: Log user to console for troubleshooting
  console.log("Sidebar user:", user);
  
  // Defensive: ensure role is always lowercase and handle edge cases
  const role = user?.role ? String(user.role).toLowerCase().trim() : "";

  const handleLogout = () => {
    localStorage.clear();
    onLogout();
    navigate("/");
  };

  const isEmployee = role === "employee";
  const isAdmin = role === "admin";

  return (
    <div className="sidebar">
      <div>
        <h2 className="logo" onClick={() => navigate("/dashboard")}>
          Leave Manager
        </h2>

        <nav className="nav-links">
          <Link to="/dashboard" className="nav-item">Dashboard</Link>

          {isEmployee && (
            <>
              <Link to="/apply-leave" className="nav-item">Apply Leave</Link>
              <Link to="/my-leaves" className="nav-item">My Leaves</Link>
            </>
          )}

          {isAdmin && (
            <Link to="/leave-requests" className="nav-item">Leave Requests</Link>
          )}
        </nav>
      </div>

      <div className="user-section">
        <div className="avatar">{user?.name?.charAt(0)}</div>
        <div className="user-info">
          <p className="user-name">{user?.name}</p>
          <p className="user-email">{user?.email}</p>
        </div>

        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Sidebar;
