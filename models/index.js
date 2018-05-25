"use strict";
const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");

// SETUP
mongoose.set("debug", true);
mongoose.Promise = global.Promise;

// CONNECT
mongoose.connect(
  process.env.MONGO_URI || "mongodb://localhost/test",
  error => {
    if (error) {
      console.error("Please make sure Mongodb is installed and running!");
      throw error;
    }
  },
  {
    keepAlive: true,
    reconnectTries: Number.MAX_VALUE,
    useMongoClient: true,
  },
);

// EXPORT MODELS
module.exports.Stock = require("./stock");
