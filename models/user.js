"use strict";

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  id: Number,
  firstName: String,
  lastName: String,
});

module.exports = mongoose.model("User", UserSchema);
