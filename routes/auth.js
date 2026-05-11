const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Request OTP
// @route   POST /api/auth/send-otp
// @access  Public
router.post('/send-otp', async (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  // Simulate OTP send
  console.log(`Sending OTP to ${phoneNumber}: 865880 (Mocked)`);
  res.status(200).json({ message: 'OTP sent successfully' });
});

// @desc    Verify OTP and login
// @route   POST /api/auth/verify-otp
// @access  Public
router.post('/verify-otp', async (req, res) => {
  const { phoneNumber, otp } = req.body;

  // For this MVP, we use a mocked valid OTP or specific one provided by user
  if (otp === '865880' || otp === '123456') {
    let user = await User.findOne({ phoneNumber });

    if (!user) {
      // Create new user if they don't exist
      user = await User.create({ phoneNumber });
    }

    res.json({
      _id: user._id,
      phoneNumber: user.phoneNumber,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid OTP' });
  }
});

module.exports = router;
