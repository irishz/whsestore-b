const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let departmentSchema = new Schema(
  {
    department: {
      type: String,
      required: [true, "กรุณาระบุชื่อแผนก"],
      unique: true,
    },
  },
  {
    timestamps: true,
    collection: "department",
  }
);

module.exports = mongoose.model("Department", departmentSchema);
