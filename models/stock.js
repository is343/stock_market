"use strict";

const mongoose = require("mongoose");

const StockSchema = new mongoose.Schema({
  stock: {
    type: String,
    unique: true,
  },
});

module.exports = mongoose.model("Stock", StockSchema);
