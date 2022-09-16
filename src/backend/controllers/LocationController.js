const asyncHandler = require("express-async-handler");
const Location = require("../models/location-schema");

const createLocation = asyncHandler(async (req, res) => {
  const { job, item, ch, zone } = req.body;
  const jobExist = await Location.findOne({ job });

  // Check location exist
  if (jobExist) {
    return res.json({ msg: "job นี้มีในระบบอยู่แล้ว" });
  }

  // Create location
  const location = await Location.create({ job, item, ch, zone });

  if (location) {
    return res.status(200).json({ msg: "เพิ่มข้อมูลสำเร็จ" });
  }
  throw new Error("เกิดข้อผิดพลาด");
});

const getAllLocation = (req, res) => {
  Location.find((error, data) => {
    if (data) {
      return res.json(data);
    }
    throw new Error("เกิดข้อผิดพลาด ไม่พบข้อมูล");
  });
};

const getOneLocation = (req, res) => {
  Location.findById(req.params.id, (error, data) => {
    if (data) {
      return res.json(data);
    }
    throw new Error("เกิดข้อผิดพลาด ไม่พบข้อมูล");
  });
};

const updateLocation = asyncHandler(async (req, res, next) => {
  Location.findByIdAndUpdate(
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

const deleteLocation = (req, res) => {
  Location.findByIdAndRemove(req.params.id, (error, data) => {
    if (data) {
      return res.json({ msg: "ลบข้อมูลสำเร็จ" });
    }
  });
};

module.exports = {
  createLocation,
  getAllLocation,
  getOneLocation,
  updateLocation,
  deleteLocation,
};
