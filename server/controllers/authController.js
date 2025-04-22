require("dotenv").config(); // <-- Make sure this is the FIRST line
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Otp = require("../models/Otp");
const otpGenerator = require("otp-generator");

// Now safely access env variables
const { JWT_SECRET } = process.env;
console.log('JWT_SECRET from .env:', JWT_SECRET);

// Register a new user
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Please verify your email address",
      text: `Click the link to verify: http://localhost:5000/api/auth/verify/${token}`,
    };

    transporter.sendMail(mailOptions);

    res.status(201).json({
      message: "User registered successfully! Please check your email for verification.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login user (Step 1 of MFA)
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const otpCode = otpGenerator.generate(6, { digits: true });
    await Otp.create({ email, otp: otpCode });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your SafeBuy OTP Code",
      text: `Your OTP code is ${otpCode}`,
    };

    transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "OTP sent to email. Please verify to complete login.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Verify Email
exports.verifyEmail = async (req, res) => {
  const token = req.params.token;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).json({ message: "Invalid token or user not found." });
    }

    if (user.isVerified) {
      return res.status(200).json({ message: "Email is already verified." });
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: "Email verified successfully. You can now log in." });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Invalid or expired token." });
  }
};

// Verify OTP (Step 2 of MFA)
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const validOtp = await Otp.findOne({ email, otp });
    if (!validOtp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Optional: mark user as verified (if this is registration flow)
    user.isVerified = true;
    await user.save();

    // Generate JWT
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    // Clean up used OTPs
    await Otp.deleteMany({ email });

    return res.status(200).json({
      message: "OTP verified successfully. Login successful.",
      token,
    });

  } catch (err) {
    console.error("OTP verification error:", err);
    res.status(500).json({ message: "Server error" });
  }
};