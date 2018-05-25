"use strict";

const express = require("express");
const router = express.Router({ mergeParams: true });
const db = require("../models");
var middleware = require("../middleware");

router.get("/users", middleware.dummyUserData, getAllUserInfo);

//////////////////////
// HELPER FUNCTIONS //
//////////////////////

function getAllUserInfo(req, res) {
  db.User.find({}, (err, user) => {
    if (err) {
      console.error(err);
      res.status(400).json(err);
    } else {
      res.status(200).json(user);
    }
  });
}

module.exports = router;
