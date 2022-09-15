const express = require("express");
const router = express.Router();
const {
  createDepartment,
  getAllDepartment,
  getOneDepartment,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/DepartmentController");

router.post("/", createDepartment);
router.get("/", getAllDepartment);
router.get("/:id", getOneDepartment);
router.put("/:id", updateDepartment);
router.delete("/:id", deleteDepartment);

module.exports = router;
