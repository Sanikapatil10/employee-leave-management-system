// src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css";

function Login({ setUser }) {
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call backend login API
      const res = await axios.post("http://localhost:5000/api/auth/login", data);

      // Backend returns: token, user: { id, name, email, role }
      const user = {
        name: res.data.user.name,
        email: res.data.user.email,
        role: (res.data.user.role || "").toLowerCase(), // lowercase for consistency
      };

      // Save user & token to localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", res.data.token);

      // Update App state
      setUser(user);

      // Navigate based on role
      if (user.role === "admin") {
        navigate("/leave-requests");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login Error:", err.response?.data || err);
      alert(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">

        {/* Left Card */}
        <div className="login-card">

          <div className="logo-row">
            <div className="logo-box">📅</div>
            <div>
              <h3>Leave Manager</h3>
              <p className="subtitle">Employee Leave Management</p>
            </div>
          </div>

          <div className="welcome">
            <h3>Welcome back</h3>
            <p>Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email Address</label>
              <input
                name="email"
                type="email"
                value={data.email}
                placeholder="you@company.com"
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={data.password}
                placeholder="Enter your password"
                onChange={handleChange}
                required
              />
            </div>

            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="signup-text">
            Don’t have an account? <Link to="/register">Sign up</Link>
          </p>

          <div className="demo-box">
            <strong>Admin Login:</strong><br />
            Email: admin@gmail.com<br />
            Password: 123456
          </div>

        </div>

        {/* Right Side */}
        <div className="info-card">
          <h2>Manage Your Leave Requests Efficiently</h2>
          <p>
            Streamline your organization's leave management with our intuitive platform.
            Track, approve, and manage leave requests all in one place.
          </p>

          <div className="stats">
            <div className="stat-box">
              <h3>500+</h3>
              <p>Active Users</p>
            </div>
            <div className="stat-box">
              <h3>99.9%</h3>
              <p>Uptime</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;