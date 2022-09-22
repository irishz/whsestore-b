const asyncHandler = require("express-async-handler");
const Layer = require("../models/layer-schema");

const createLayer = asyncHandler(async (req, res) => {
  const { layer } = req.body;
  const layerExist = await Layer.findOne({ layer });

  // Check layer exist
  if (layerExist) {
    return res.json({ msg: "ชั้นนี้มีในระบบอยู่แล้ว" });
  }

  // Create layer
  const layerCreated = await Layer.create({ layer });

  if (layerCreated) {
    return res.status(200).json({ msg: "เพิ่มชั้นสำเร็จ" });
  }
  throw new Error("เกิดข้อผิดพลาด");
});

const getAllLayer = (req, res) => {
  Layer.find((error, data) => {
    if (data) {
      return res.json(data);
    }
    throw new Error("เกิดข้อผิดพลาด ไม่พบข้อมูล");
  });
};

// Get one layer
const getOneLayer = (req, res) => {
  Layer.findById(req.params.id, (error, data) => {
    if (data) {
      return res.json(data);
    }
    throw new Error("เกิดข้อผิดพลาด ไม่พบข้อมูล");
  });
};

// const updateLayer = asyncHandler(async (req, res, next) => {
//   Layer.findByIdAndUpdate(
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

const deleteLayer = (req, res) => {
  Layer.findByIdAndRemove(req.params.id, (error, data) => {
    if (data) {
      return res.json({ msg: "ลบข้อมูลสำเร็จ" });
    }
  });
};

module.exports = {
  createLayer,
  getAllLayer,
  getOneLayer,
//   updateLayer,
  deleteLayer,
};
