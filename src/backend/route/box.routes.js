let express = require("express"),
  router = express.Router();

const {
  createBox,
  getAllBox,
  getOneBox,
  deleteBox
} = require("../controllers/BoxController");

router.post("/", createBox);
router.get("/", getAllBox);
router.get("/:id", getOneBox);
router.delete("/:id", deleteBox);

module.exports = router;
