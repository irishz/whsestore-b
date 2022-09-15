let express = require("express"),
  router = express.Router();

const {
  createLocation,
  getAllLocation,
  getOneLocation,
  updateLocation,
  deleteLocation,
} = require("../controllers/LocationController");

router.post("/", createLocation);
router.get("/", getAllLocation);
router.get("/:id", getOneLocation);
router.put("/:id", updateLocation);
router.delete("/:id", deleteLocation);

module.exports = router;