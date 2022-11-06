const asyncHandler = require("express-async-handler");
const jobTrans = require("../models/jobtrans-schema");

const createJobTrans = asyncHandler(async (req, res) => {
  const jobTransCreated = await jobTrans.create(req.body);
  if (jobTransCreated) {
    res.json({
      msg: "บันทึกข้อมูลสำเร็จ",
    });
  }
});

const getAllJobTrans = async (req, res) => {
  // if (req.query) {
  //   console.log("get query job",req.query);
  //   const { start_date, end_date, job } = req.query;
  //   const jobTransRes = await jobTrans
  //     .find({
  //       // createdAt: { $gt: start_date, $lt: end_date },
  //       job,
  //     })
  //     .populate("created_by");
  //   if (jobTransRes) {
  //     res.status(200).json(jobTransRes);
  //     return
  //   }
  // }
  console.log("get all job");
  const allJobTrans = await jobTrans.find().populate("created_by");
  if (allJobTrans) {
    res.json(allJobTrans);
    return;
  }
  throw new Error("เกิดข้อผิดพลาด ไม่พบข้อมูล");
};

const getQueryJobTrans = async (req, res) => {
  console.log(req.query);
  const { job, start_date, end_date } = req.query;
  const jobTransRes = await jobTrans
    .find({
      job,
      createdAt: { $gt: new Date(start_date), $lt: new Date(end_date) },
    })
    .sort([
      ["createdAt", 1],
      ["job", 1],
      ["item_matl", 1],
    ])
    .populate("created_by");
  if (jobTransRes) {
    res.status(200).json(jobTransRes);
    return;
  }
  throw new Error("เกิดข้อผิดพลาด ไม่พบข้อมูล");
};

const getOneJobTrans = async (req, res) => {
  const singleJobTrans = await jobTrans
    .findById(req.params.job)
    .populate("created_by");
  if (singleJobTrans) {
    res.json(singleJobTrans);
    return;
  }
  throw new Error("เกิดข้อผิดพลาด ไม่พบข้อมูล");
};

module.exports = {
  createJobTrans,
  getAllJobTrans,
  getOneJobTrans,
  getQueryJobTrans,
};
