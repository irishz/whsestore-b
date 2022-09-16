const asyncHandler = require("express-async-handler");
const Channel = require("../models/channel-schema");

const createChannel = asyncHandler(async (req, res) => {
  const { ch } = req.body;
  const chExist = await Channel.findOne({ ch });

  // Check channel exist
  if (chExist) {
    return res.json({ msg: "ช่องนี้มีในระบบอยู่แล้ว" });
  }

  // Create channel
  const chCreated = await Channel.create({ ch });

  if (chCreated) {
    return res.status(200).json({ msg: "เพิ่มช่องสำเร็จ" });
  }
  throw new Error("เกิดข้อผิดพลาด");
});

const getAllChannel = (req, res) => {
  Channel.find((error, data) => {
    if (data) {
      return res.json(data);
    }
    throw new Error("เกิดข้อผิดพลาด ไม่พบข้อมูล");
  });
};

//Get one channel
const getOneChannel = (req, res) => {
  Channel.findById(req.params.id, (error, data) => {
    if (data) {
      return res.json(data);
    }
    throw new Error("เกิดข้อผิดพลาด ไม่พบข้อมูล");
  });
};

// const updateChannel = asyncHandler(async (req, res, next) => {
//   Channel.findByIdAndUpdate(
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

const deleteChannel = (req, res) => {
  Channel.findByIdAndRemove(req.params.id, (error, data) => {
    if (data) {
      return res.json({ msg: "ลบข้อมูลสำเร็จ" });
    }
  });
};

module.exports = {
  createChannel,
  getAllChannel,
  getOneChannel,
//   updateChannel,
  deleteChannel,
};
