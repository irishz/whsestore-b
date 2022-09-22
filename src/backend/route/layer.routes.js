let express = require("express"),
  router = express.Router();

const {
  createLayer,
  getAllLayer,
  getOneLayer,
  deleteLayer
} = require("../controllers/LayerController");

router.post("/", createLayer);
router.get("/", getAllLayer);
router.get("/:id", getOneLayer);
router.delete("/:id", deleteLayer);

module.exports = router;
