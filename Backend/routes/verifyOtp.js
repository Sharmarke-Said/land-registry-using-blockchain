const express = require("express");
const router = express.Router();
const UserDetails = require("../models/userDetails");

// Skip real SMS
// const sendMessage = require("../utils/sendMessage");

router.post("/sendOtp", async (req, res) => {
  const { aadharNo } = req.body;

  if (!aadharNo) {
    return res
      .status(400)
      .send({ message: "Please enter the required fields" });
  }

  try {
    const otp = 123456;
    const otpValidTill = Date.now() + 15 * 60 * 1000;

    let user = await UserDetails.findOne({ aadharNo });

    if (user) {
      // Update existing user OTP
      user.otp = otp;
      user.otpValidTill = otpValidTill;
      await user.save();
      return res
        .status(200)
        .send({ message: "OTP sent successfully (123456)" });
    }

    // Create new user with autofilled fields
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newUser = new UserDetails({
      aadharNo,
      otp,
      otpValidTill,
      name: `User ${randomSuffix}`,
      email: `user${randomSuffix}@landchain.com`,
      phoneNo: `100000${randomSuffix}`,
    });

    await newUser.save();

    return res
      .status(200)
      .send({ message: "New user created and OTP sent (123456)" });
  } catch (error) {
    return res
      .status(400)
      .send({ message: "Error: " + error.message });
  }
});

router.post("/verifyOtp", async (req, res) => {
  if (!req.body.aadharNo || !req.body.otp) {
    res.status(400).send({
      message: "Please enter the required fields",
    });
    return;
  }
  try {
    const aadharNo = req.body.aadharNo;
    const otp = req.body.otp;
    var user_details = await UserDetails.findOne({
      aadharNo: aadharNo,
    });

    if (!user_details) {
      res.status(400).send({
        message: "User not found",
      });
      return;
    }

    if (!user_details.otp || !user_details.otpValidTill) {
      res.status(400).send({
        message: "OTP not sent",
      });
      return;
    }

    if (user_details.otp != otp) {
      res.status(400).send({
        message: "OTP does not match",
      });
      return;
    }

    if (user_details.otpValidTill < Date.now()) {
      res.status(400).send({
        message: "OTP expired",
      });
      return;
    }

    user_details.otp = null;
    user_details.otpValidTill = null;
    await user_details.save();

    res.status(200).send({
      message: "OTP verified successfully",
    });
  } catch (error) {
    res.status(400).send({
      message: "Error " + error.message,
    });
  }
});

module.exports = router;
