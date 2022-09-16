const asyncHandler = require("express-async-handler");
const Zone = require("../models/zone-schema");

const createZone = asyncHandler(async (req, res) => {
  const { zone } = req.body;
  const zoneExist = await Zone.findOne({ zone });

  // Check zone exist
  if (zoneExist) {
    return res.json({ msg: "zone นี้มีในระบบอยู่แล้ว" });
  }

  // Create zone
  const zoneCreated = await Zone.create({ zone });

  if (zoneCreated) {
    return res.status(200).json({ msg: "เพิ่ม zone สำเร็จ" });
  }
  throw new Error("เกิดข้อผิดพลาด");
});

const getAllZone = (req, res) => {
  Zone.find((error, data) => {
    if (data) {
      return res.json(data);
    }
    throw new Error("เกิดข้อผิดพลาด ไม่พบข้อมูล");
  });
};

// Get one zone
const getOneZone = (req, res) => {
  Zone.findById(req.params.id, (error, data) => {
    if (data) {
      return res.json(data);
    }
    throw new Error("เกิดข้อผิดพลาด ไม่พบข้อมูล");
  });
};

// const updateZone = asyncHandler(async (req, res, next) => {
//   Zone.findByIdAndUpdate(
//     req.params.id,
//     {
//       $set: req.body,
//     },
//     (error, data) => {
//       if (data) {
//         return res.json({ msg: "อัพเดทข้อมูลสำเร็จ" });
//       }
//       return next(error)
//     }
//   );
// });

const deleteZone = (req, res) => {
  Zone.findByIdAndRemove(req.params.id, (error, data) => {
    if (data) {
      return res.json({ msg: "ลบข้อมูลสำเร็จ" });
    }
  });
};

module.exports = {
  createZone,
  getAllZone,
  getOneZone,
//   updateZone,
  deleteZone,
};
