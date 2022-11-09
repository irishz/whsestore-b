let express = require("express"),
  router = express.Router();

const {
  createLocationStd,
  getAllLocationStd,
  getOneLocationStd,
  updateLocationStd,
  deleteLocationStd,
} = require("../controllers/LocationStdController");

router.post("/", createLocationStd);
router.get("/", getAllLocationStd);
router.get("/:id", getOneLocationStd);
router.put("/:id", updateLocationStd);
router.delete("/:id", deleteLocationStd);

module.exports = router;
