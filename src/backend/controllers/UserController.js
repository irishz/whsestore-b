const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/user-schema");

const registerUser = asyncHandler(async (req, res) => {
  const { name, role, department, password } = req.body;
  // Check user exists
  const userExist = await User.findOne({ name });
  if (userExist) {
    return res.json({ msg: "ชื่อนี้มีในระบบอยู่แล้ว" });
  }

  // Hash Password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    role,
    department,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      msg: "เพิ่มผู้ใช้สำเร็จ",
      data: user,
    });
  } else {
    res.status(400).json({
      msg: "ไม่พบข้อมูล",
    });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { name, password } = req.body;
  const user = await User.findOne({ name });

    // Check User
  if (user && (await bcrypt.compare(password, user.password))) {
    return res.json({ msg: "Login User", data: {
        _id: user.id,
        name: user.name,
        role: user.role,
        token: generateToken(user._id)
    } });
  }
  res.json({ msg: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
});

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
}

const getAllUser = (req, res, next) => {
  User.find((error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
};

const getOneUser = (req, res) => {
  User.findById(req.params.id, (error, data) => {
    if (data) {
      res.json(data);
      return;
    }
    res.json({ msg: "ไม่พบผู้ใช้" });
  });
};

const updateUser = asyncHandler(async (req, res) => {
  User.findByIdAndUpdate(req.params.id, { $set: req.body }, (error, data) => {
    if (data) {
      res.json({ msg: "อัพเดทข้อมูลสำเร็จ" });
      return;
    }
    throw new Error("ไม่พบข้อมูล");
  });
});

const deleteUser = (req, res) => {
  User.findByIdAndRemove(req.params.id, (error, data) => {
    res.json({ msg: "ลบผู้ใช้สำเร็จ" });
  });
};

module.exports = {
  registerUser,
  loginUser,
  getAllUser,
  getOneUser,
  updateUser,
  deleteUser,
};
