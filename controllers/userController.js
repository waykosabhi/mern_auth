const { json, request } = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { password, email } = req.body;
    const found = await User.findOne({ email });
    if (found) {
      return res.status(400).json({
        message: "Email allready exits",
      });
    }
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
    res.status(400).json({ message: "Someting went wrong" + error });
  }
};
exports.fetchUsers = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.json({ message: " Plz Provide Token" });
    }
    jwt.verify(token, process.env.JWT_KEY);

    const result = await User.find();
    res.json({
      message: "User Fetch success ",
      result,
    });
  } catch (error) {
    res.json({ message: "Someting went wrong" + error });
  }
};

exports.login = async (req, res) => {
  try {
    //email exits
    const { email, password } = req.body;
    // const result = await User.findOne({ email }).lean();
    const result = await User.findOne({ email });
    if (!result) {
      return res
        .status(401)
        .json({ message: "Email is not regitered eith us" });
    }

    const match = await bcrypt.compare(password, result.password);
    if (!match) {
      return res.status(401).json({ message: "Password do not match" });
    }
    const token = jwt.sign({ name: "john" }, process.env.JWT_KEY);
    return res.json({
      message: "Login Success",
      result: {
        _id: result._id,
        name: result.name,
        email: result.email,
        token,
      },
    });
  } catch (error) {
    res.status(400).json({ message: "Someting went wrong" + error });
  }
};

exports.destroy = async (req, res) => {
  try {
    await User.deleteMany();
    res.json({ message: "User Destroy success " });
  } catch (error) {
    res.json({ message: "Someting went wrong", error });
  }
};
