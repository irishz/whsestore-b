let express = require("express"),
  router = express.Router();

const {
  createZone,
  getAllZone,
  getOneZone,
  deleteZone,
} = require("../controllers/ZoneController");

router.post("/", createZone);
router.get("/", getAllZone);
router.get("/:id", getOneZone);
router.delete("/:id", deleteZone);

module.exports = router;
