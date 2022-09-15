const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let issueMatlSchema = new Schema(
  {
    job: {
      type: String,
    },
    item_matl: {
      type: String,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: { currentTime: () => Date() },
    collection: "IssueMatl",
  }
);

module.exports = mongoose.model("IssueMatl", issueMatlSchema);
