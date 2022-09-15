const asyncHandler = require("express-async-handler");
const Department = require("../models/department-schema");

const createDepartment = asyncHandler(async (req, res) => {
  const { department } = req.body;
  const deptExist = await Department.findOne({ department });

  // Check department exist
  if (deptExist) {
    return res.json({ msg: "ชื่อแผนกนี้มีในระบบอยู่แล้ว" });
  }

  // Create department
  const dept = await Department.create({
    department,
  });

  if (dept) {
    return res.status(200).json({ msg: "เพิ่มแผนกสำเร็จ" });
  }
  throw new Error("เกิดข้อผิดพลาด");
});

const getAllDepartment = (req, res) => {
  Department.find((error, data) => {
    if (data) {
      return res.json(data);
    }
    throw new Error("เกิดข้อผิดพลาด ไม่พบข้อมูล");
  });
};

const getOneDepartment = (req, res) => {
  Department.findById(req.params.id, (error, data) => {
    if (data) {
      return res.json(data);
    }
    throw new Error("เกิดข้อผิดพลาด ไม่พบข้อมูล");
  });
};

const updateDepartment = asyncHandler(async (req, res) => {
  const { department } = req.body;
  const deptExist = Department.findOne({ department });
  if (deptExist) {
    return res.json({ msg: "ชื่อแผนกนี้มีในระบบอยู่แล้ว" });
  }

  Department.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    (error, data) => {
      if (data) {
        return res.json({ msg: "อัพเดทข้อมูลสำเร็จ" });
      }
      throw new Error("เกิดข้อผิดพลาด");
    }
  );
});

const deleteDepartment = (req, res) => {
  Department.findByIdAndRemove(req.params.id, (error, data) => {
    if (data) {
      return res.json({ msg: "ลบข้อมูลสำเร็จ" });
    }
  });
};

module.exports = {
  createDepartment,
  getAllDepartment,
  getOneDepartment,
  updateDepartment,
  deleteDepartment,
};
