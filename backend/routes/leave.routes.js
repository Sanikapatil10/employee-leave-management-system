const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const { applyLeave, getMyLeaves, getAllLeaves, updateStatus } = require("../controllers/leave.controller");

router.post("/apply", auth, applyLeave);
router.get("/my-leaves", auth, getMyLeaves);
router.get("/all", auth, role("admin"), getAllLeaves);
router.put("/status", auth, role("admin"), updateStatus);

module.exports = router;