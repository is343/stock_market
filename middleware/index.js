"use strict";

const db = require("../models");

exports.dummyUserData = function(req, res, next) {
  db.User.count().exec((err, count) => {
    if (count > 0) {
      return next();
    }
    const user1 = new db.User({
      id: 0,
      firstName: "John",
      lastName: "Doe",
    });
    const user2 = new db.User({
      id: 1,
      firstName: "Jane",
      lastName: "Doe",
    });
    const user3 = new db.User({
      id: 2,
      firstName: "Mary",
      lastName: "Swanson",
    });

    db.User.create([user1, user2, user3], error => {
      if (!error) {
        console.log("Dummy data created");
      }
    });
  });
};
