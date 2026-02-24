const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import models to create tables
require("./models/user.model");
require("./models/leave.model");

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/leaves", require("./routes/leave.routes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});