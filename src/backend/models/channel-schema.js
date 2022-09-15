const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let channelSchema = new Schema(
  {
    ch: {
      type: Number,
    },
  },
  {
    timestamps: true,
    collection: "channel",
  }
);

module.exports = mongoose.model("Channel", channelSchema);
