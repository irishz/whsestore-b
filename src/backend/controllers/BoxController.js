const asyncHandler = require("express-async-handler");
const Box = require("../models/box-schema");

const createBox = asyncHandler(async (req, res) => {
  const { box } = req.body;
  const boxExist = await Box.findOne({ box });

  // Check box exist
  if (boxExist) {
    return res.json({ msg: "กล่องนี้มีในระบบอยู่แล้ว" });
  }

  // Create box
  const boxCreated = await Box.create({ box });

  if (boxCreated) {
    return res.status(200).json({ msg: "เพิ่มกล่องสำเร็จ" });
  }
  throw new Error("เกิดข้อผิดพลาด");
});

const getAllBox = (req, res) => {
  Box.find((error, data) => {
    if (data) {
      return res.json(data);
    }
    throw new Error("เกิดข้อผิดพลาด ไม่พบข้อมูล");
  });
};

// Get one box
const getOneBox = (req, res) => {
  Box.findById(req.params.id, (error, data) => {
    if (data) {
      return res.json(data);
    }
    throw new Error("เกิดข้อผิดพลาด ไม่พบข้อมูล");
  });
};

// const updateBox = asyncHandler(async (req, res, next) => {
//   Box.findByIdAndUpdate(
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

const deleteBox = (req, res) => {
  Box.findByIdAndRemove(req.params.id, (error, data) => {
    if (data) {
      return res.json({ msg: "ลบข้อมูลสำเร็จ" });
    }
  });
};

module.exports = {
  createBox,
  getAllBox,
  getOneBox,
//   updateBox,
  deleteBox,
};
