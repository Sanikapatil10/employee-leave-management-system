// src/pages/ApplyLeave.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/ApplyLeave.css";

function ApplyLeave({ refreshLeaves }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ leaveType: "", startDate: "", endDate: "", reason: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.leaveType || !formData.startDate || !formData.endDate || !formData.reason) return alert("Fill all fields");

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/leaves/apply",
        { leaveType: formData.leaveType, start_date: formData.startDate, end_date: formData.endDate, reason: formData.reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await refreshLeaves();
      setFormData({ leaveType: "", startDate: "", endDate: "", reason: "" });
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit leave request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="apply-container">
      <h2>Apply for Leave</h2>
      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Leave Type *</label>
          <select name="leaveType" value={formData.leaveType} onChange={handleChange}>
            <option value="">Select leave type</option>
            <option value="Sick">Sick Leave</option>
            <option value="Casual">Casual Leave</option>
            <option value="Annual">Annual Leave</option>
          </select>
        </div>

        <div className="date-row">
          <div className="form-group">
            <label>Start Date *</label>
            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>End Date *</label>
            <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
          </div>
        </div>

        <div className="form-group">
          <label>Reason *</label>
          <textarea name="reason" value={formData.reason} onChange={handleChange}></textarea>
        </div>

        <div className="form-actions">
          <button type="submit">{loading ? "Submitting..." : "Submit Request"}</button>
          <button type="button" onClick={() => navigate("/dashboard")}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default ApplyLeave;