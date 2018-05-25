"use strict";

const db = require("../models");

exports.dummyStockData = function() {
  db.Stock.count().exec((err, count) => {
    if (count > 0) {
      return;
    }
    const stock0 = new db.Stock({
      stock: "FB",
    });
    const stock1 = new db.Stock({
      stock: "TSLA",
    });

    db.Stock.create([stock0, stock1], error => {
      if (!error) {
        console.log("Dummy data created");
      }
    });
  });
};
