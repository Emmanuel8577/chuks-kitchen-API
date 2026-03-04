import User from "../model/user.model.js";
import jwt from "jsonwebtoken";
import { sendOTPByEmail } from "../utils/email.js";

// Helper function to handle JWT and Cookies
const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true, // prevent XSS attacks
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict", // prevent CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};

// @desc    Signup a new user & send OTP
export const signup = async (req, res) => {
  const { email, password, name, referralCode } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.create({
      name,
      email,
      password,
      otp,
      otpExpires,
      referralCode,
    });

    // --- NEW: Send the actual email ---
    await sendOTPByEmail(user.email, otp, user.name);

    res.status(201).json({
      message: "Registration successful. Please check your email for the OTP.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify OTP and log user in
export const verifyEmail = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Edge Case: Check if OTP matches and hasn't expired
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Update user verification status
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Log the user in immediately after verification
    const token = generateToken(user._id, res);

    res.status(200).json({
      message: "Email verified successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login existing user
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    // Use the comparePassword method defined in your user.model.js
    if (user && (await user.comparePassword(password))) {
      // Check if user has verified their email
      if (!user.isVerified) {
        return res
          .status(401)
          .json({ message: "Please verify your email before logging in." });
      }

      const token = generateToken(user._id, res);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    // Edge Case: User doesn't exist
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Edge Case: User is already verified
    if (user.isVerified) {
      return res
        .status(400)
        .json({ message: "This account is already verified" });
    }

    // Generate New 6-digit OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const newOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    // Update User Record
    user.otp = newOtp;
    user.otpExpires = newOtpExpires;
    await user.save();

    // Send the new email
    await sendOTPByEmail(user.email, newOtp, user.name);

    res.status(200).json({ message: "A new OTP has been sent to your email." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Logout user / clear cookie
export const logout = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json({ message: "Logged out successfully" });
};
