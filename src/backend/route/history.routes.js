let express = require("express"),
  router = express.Router();

let history = require("../models/history-schema");

router.route("/create").post((req, res, next) => {
  history.create(req.body, (error, data) => {
    if (error) {
      return next(error);
    } else {
      console.log(data);
      res.json(data);
    }
  });
});

router.route("/").get((req, res, next) => {
  // eslint-disable-next-line array-callback-return
  history.find((error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

router.route("/edit/:id").get((req, res, next) => {
  history.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

router.route("/update/").put((req, res, next) => {
  console.log(req.body[0], req.body[1]);

  history.updateMany(
    req.body[0],
    {
      $set: req.body[1],
    },
    (error, data) => {
      if (error) {
        console.log(error);
        return next(error);
      } else {
        res.json(data);
        console.log("history updated successfully !");
      }
    }
  );
});

router.route("/delete").delete((req, res, next) => {
  // deleteMany
  history.remove({}, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data,
      });
    }
  });
});

router.route("/delete").delete((req, res, next) => {
  // deleteOne
  history.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data,
      });
    }
  });
});

module.exports = router;
