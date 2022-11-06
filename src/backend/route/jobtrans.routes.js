let express = require("express"),
  router = express.Router();

const { createJobTrans, getAllJobTrans, getOneJobTrans, getQueryJobTrans } = require("../controllers/JobTransController");

router.post("/", createJobTrans);
router.get("/", getAllJobTrans);
router.get("/history", getQueryJobTrans);
router.get("/:job", getOneJobTrans);
// router.delete("/:id", deleteZone);

module.exports = router;
