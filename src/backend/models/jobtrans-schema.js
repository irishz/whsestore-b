const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let jobTransSchema = new Schema(
  {
    job: {
      type: String,
    },
    item_matl: {
      type: [{
        item: String,
        status: Boolean,
      }],
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
    collection: "jobtrans",
  }
);

module.exports = mongoose.model("jobTrans", jobTransSchema);
