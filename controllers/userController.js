const { json, request } = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  try {
    const { password } = req.body;
    const hasPass = await bcrypt.hash(password, 10);
    const result = await User.create({
      ...req.body,
      password: hasPass,
    });
    res.json({
      message: "User rigster success ",
      result,
    });
  } catch (error) {
    res.json({ message: "Someting went wrong", error });
  }
};
exports.fetchUsers = async (req, res) => {
  try {
    const result = await User.find();
    res.json({
      message: "User Fetch success ",
      result,
    });
  } catch (error) {
    res.json({ message: "Someting went wrong", error });
  }
};
