const db = require("../config/db");

// ============================
// Apply Leave (Employee)
// ============================
exports.applyLeave = (req, res) => {
  const { leaveType, start_date, end_date, reason } = req.body;
  const userId = req.user.id;

  if (!leaveType || !start_date || !end_date || !reason) {
    return res.status(400).json({ message: "All fields are required" });
  }

  db.query(
    "INSERT INTO leaves (user_id, leave_type, start_date, end_date, reason, status) VALUES (?, ?, ?, ?, ?, 'pending')",
    [userId, leaveType, start_date, end_date, reason],
    (err) => {
      if (err) {
        console.error("DB ERROR:", err);
        return res.status(500).json({ message: err.message });
      }

      res.json({ message: "Leave request submitted successfully" });
    }
  );
};

// ============================
// Get My Leaves (Employee)
// ============================
exports.getMyLeaves = (req, res) => {
  const userId = req.user.id;

  db.query(
    "SELECT * FROM leaves WHERE user_id = ? ORDER BY start_date DESC",
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ message: err.message });

      const leaves = results.map((leave) => {
        const start = new Date(leave.start_date);
        const end = new Date(leave.end_date);
        const days =
          Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

        return { ...leave, days };
      });

      res.json(leaves);
    }
  );
};

// ============================
// Dashboard Summary (Employee)
// ============================
exports.getDashboardSummary = (req, res) => {
  const userId = req.user.id;

  db.query(
    "SELECT status, start_date, end_date FROM leaves WHERE user_id = ?",
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ message: err.message });

      let totalTaken = 0;
      let pending = 0;
      let approved = 0;
      const totalAllowed = 20;

      results.forEach((leave) => {
        const start = new Date(leave.start_date);
        const end = new Date(leave.end_date);
        const days =
          Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

        if (leave.status === "approved") {
          totalTaken += days;
          approved += days;
        }

        if (leave.status === "pending") {
          pending += days;
        }
      });

      res.json({
        totalTaken,
        remaining: totalAllowed - totalTaken,
        pending,
        approved,
      });
    }
  );
};

// ============================
// Admin - Get All Leaves
// ============================
exports.getAllLeaves = (req, res) => {
  db.query(
    `SELECT leaves.*, users.name, users.email
     FROM leaves
     JOIN users ON leaves.user_id = users.id
     ORDER BY leaves.start_date DESC`,
    (err, results) => {
      if (err) {
        console.error("Fetch Error:", err);
        return res.status(500).json({ message: err.message });
      }

      res.json(results);
    }
  );
};

// ============================
// Admin - Update Leave Status
// ============================
exports.updateStatus = (req, res) => {
  // Accept both id and leaveId from frontend
  const { id, leaveId, status } = req.body;

  const leave_id = leaveId || id;

  // Validation
  if (!leave_id || !["approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid data" });
  }

  db.query(
    "UPDATE leaves SET status = ? WHERE id = ?",
    [status, leave_id],
    (err, result) => {
      if (err) {
        console.error("Update Error:", err);
        return res.status(500).json({ message: err.message });
      }

      res.json({
        message: "Leave status updated successfully",
        leaveId: leave_id,
        status: status,
      });
    }
  );
};

