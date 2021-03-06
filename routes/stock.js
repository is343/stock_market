"use strict";
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const router = express.Router({ mergeParams: true });
const axios = require("axios");
const db = require("../models");

router.get("/stocks", getStockList);
router.post("/stocks/:stock", createStock);

//////////////////////
// HELPER FUNCTIONS //
//////////////////////

function getStockList(req, res) {
  db.Stock.find({}, (err, stocks) => {
    if (err) {
      console.error(err);
      res.status(400).json(err);
    } else {
      res.status(200).json(stocks);
    }
  });
}

function createStock(req, res) {
  const stock = req.params.stock;
  const newStock = new db.Stock({ stock });
  db.Stock.create(newStock)
    .then(createdStock => {
      res.status(200).json(createdStock);
    })
    .catch(err => {
      console.error("DB create error:", err);
    });
}

module.exports = router;
