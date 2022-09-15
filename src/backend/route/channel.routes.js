let express = require("express"),
  router = express.Router();

const {
  createChannel,
  getAllChannel,
  getOneChannel,
  deleteChannel,
} = require("../controllers/ChannelController");

router.post("/", createChannel);
router.get("/", getAllChannel);
router.get("/:id", getOneChannel);
router.delete("/:id", deleteChannel);

module.exports = router;
