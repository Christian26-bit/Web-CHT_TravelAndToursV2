const { Employee } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Email and password are required." });
    }

    const user = await Employee.findOne({ where: { Email: email } });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid email or password." });
    }

    if (!user.IsActive) {
      return res
        .status(401)
        .json({ success: false, error: "Account is inactive." });
    }

    let isMatch = false;

    try {
      isMatch = await bcrypt.compare(password, user.Password);
    } catch (e) {
      isMatch = false;
    }

    if (!isMatch) {
      const sha1Hash = crypto.createHash("sha1").update(password).digest("hex");
      if (sha1Hash === user.Password) {
        isMatch = true;
      }
    }

    if (!isMatch && password === user.Password) {
      isMatch = true;
    }

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid email or password." });
    }

    const token = jwt.sign(
      {
        id: user.employeeId,
        email: user.Email,
        role: user.IsManager ? "admin" : "user",
      },
      process.env.JWT_SECRET || "cht_secret_key",
      { expiresIn: "24h" },
    );

    res.json({
      success: true,
      token,
      role: user.IsManager ? "admin" : "user",
      name: user.Name,
      email: user.Email,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, error: "Internal server error." });
  }
};
