import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Register.css";

function Register() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "employee"
  });

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password match check
    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role
        }
      );

      alert(res.data.message);

      // Redirect to login
      navigate("/");

    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">

        <div className="logo-row">
          <div className="logo-box">📅</div>
          <div>
            <h3>Leave Manager</h3>
            <p className="subtitle">Employee Leave Management</p>
          </div>
        </div>

        <div className="register-title">
          <h3>Create an account</h3>
          <p>Get started with Leave Manager</p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <label>Full Name</label>
            <input
              name="name"
              value={data.name}
              placeholder="John Doe"
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <input
              name="email"
              value={data.email}
              placeholder="you@company.com"
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={data.password}
              placeholder="Minimum 6 characters"
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={data.confirmPassword}
              placeholder="Re-enter your password"
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Role</label>
            <select
              name="role"
              value={data.role}
              onChange={handleChange}
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button className="register-btn">Create Account</button>
        </form>

        <p className="signin-text">
          Already have an account? <Link to="/">Sign in</Link>
        </p>

      </div>
    </div>
  );
}

export default Register;