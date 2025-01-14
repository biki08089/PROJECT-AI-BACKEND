const OTP = require("../model/otpSchema");
const userSchema = require("../model/userSchema");
const bcrypt = require("bcrypt");
const saltrounds = 10;
const verifyOtp = async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;

    const checkOTP = await OTP.findOne({ otp });
    if (!checkOTP) {
      console.log("Otp invalid");
      return res.status(200).json({
        success: false,
        massage: "Invalid OTP",
      });
    }

    //Check if the user has already signed up
    if (await userSchema.findOne({ email })) {
      console.log("This email ID is already registered With us.");
      return res.status(200).json({
        success: false,
        massage: "This email ID is already registered With us.",
      });
    }

    // Hashing the password..
    let hashPassword;
    try {
      hashPassword = await bcrypt.hash(password, saltrounds);
      console.log(hashPassword);
    } catch (error) {
      console.log(error);
    }
    // create and save user inside DB
    const createUser = await userSchema.create({
      name,
      email,
      password: hashPassword,
    });
    console.log("User created successfully");
    return res.status(200).json({
      success: true,
      massage: "Acount created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      massage: error.massage,
    });
  }
};

module.exports = verifyOtp;
