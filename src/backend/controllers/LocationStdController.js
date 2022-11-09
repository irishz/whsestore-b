const asyncHandler = require("express-async-handler");
const LocationStd = require("../models/locationstd-schema");

const createLocationStd = asyncHandler(async (req, res) => {
  const { item, layer, box } = req.body;
  const itemExist = await LocationStd.findOne({ item });

  // Check location exist
  if (itemExist) {
    return res.json({ msg: "item นี้มีในระบบอยู่แล้ว" });
  }

  // Create location
  const location = await LocationStd.create({ item, box, layer });

  if (location) {
    return res.status(200).json({ msg: "เพิ่มข้อมูลสำเร็จ" });
  }
  throw new Error("เกิดข้อผิดพลาด");
});

const getAllLocationStd = (req, res) => {
  LocationStd.find((error, data) => {
    if (data) {
      return res.json(data);
    }
    throw new Error("เกิดข้อผิดพลาด ไม่พบข้อมูล");
  });
};

const getOneLocationStd = (req, res) => {
  LocationStd.findById(req.params.id, (error, data) => {
    if (data) {
      return res.json(data);
    }
    throw new Error("เกิดข้อผิดพลาด ไม่พบข้อมูล");
  });
};

const updateLocationStd = asyncHandler(async (req, res, next) => {
  LocationStd.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    (error, data) => {
      if (data) {
        return res.json({ msg: "อัพเดทข้อมูลสำเร็จ" });
      }
      return next(error)
    }
  );
});

const deleteLocationStd = (req, res) => {
  LocationStd.findByIdAndRemove(req.params.id, (error, data) => {
    if (data) {
      return res.json({ msg: "ลบข้อมูลสำเร็จ" });
    }
  });
};

module.exports = {
  createLocationStd,
  getAllLocationStd,
  getOneLocationStd,
  updateLocationStd,
  deleteLocationStd,
};
