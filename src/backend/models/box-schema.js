const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let boxSchema = new Schema(
  {
    box: {
      type: Number,
    },
  },
  {
    timestamps: true,
    collection: "box",
  }
);

module.exports = mongoose.model("Box", boxSchema);
