const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let locationStdSchema = new Schema(
  {
    box: {
      type: Number,
    },
    layer: {
      type: Number,
    },
    item: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: "location_std",
  }
);

module.exports = mongoose.model("LocationStd", locationStdSchema);
