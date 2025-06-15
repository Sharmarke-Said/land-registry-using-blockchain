const mongoose = require("mongoose");

const landInspectorSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const LandInspector = mongoose.model(
  "LandInspector",
  landInspectorSchema
);

module.exports = LandInspector;
