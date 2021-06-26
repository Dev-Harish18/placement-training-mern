const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const { promisify } = require("util");

function createAndSendToken(user, statusCode, req, res) {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    sameSite: "none",
    secure: true,
  });

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
}
//restrict middleWares
exports.mustBeLoggedIn = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  )
    token = req.headers.authorization.split(" ")[1];
  else if (req.cookies.jwt) token = req.cookies.jwt;

  console.log(token);

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  if (!user) return next(new AppError(401, "Unauthenticated!Please sign in"));
  //Pass user to next middleware
  req.user = user;
  next();
});

exports.restrict = (req, res, next) => {
  if (req.user.role != "admin")
    return next(
      new AppError(403, "Unauthorized!You are not allowed to do this task")
    );
  next();
};

//auth middlewares
exports.signUp = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    roll: req.body.roll,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });
  createAndSendToken(user, 201, req, res);
});
exports.signIn = catchAsync(async (req, res, next) => {
  const { roll, password } = req.body;
  //If Email/Password missing
  if (!roll || !password)
    return next(new AppError(400, "Please provide Roll No and Password"));
  const user = await User.findOne({ roll }).select("+password");
  //If Email/Password Incorrect
  if (!user || !(await bcrypt.compare(password, user.password)))
    return next(new AppError(400, "Invalid Roll No or Password"));
  //If all Ok , Send Token
  createAndSendToken(user, 200, req, res);
});
exports.forgotPassword = catchAsync(async (req, res, next) => {
  //Get Email from body
  const { email } = req.body;
  if (!email) return next(new AppError(400, "Please provide the Email"));
  const user = await User.findOne({ email });
  if (!user) return next(new AppError(400, "No Accounts for this email"));
  //Create password reset token
  const resetToken = user.createPasswordToken();
  const resetUrl = `${req.protocol}://${process.env.FRONTEND_DOMAIN}/users/resetpassword/${resetToken}`;

  await user.save({ validateBeforeSave: false });
  //Send reset token to email
  try {
    await sendEmail({
      url: resetUrl,
      email: user.email,
    });
  } catch (err) {
    console.log(err);
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    user.save({ validateBeforeSave: false });
    return res.status(500).json({
      status: "fail",
      message: "Error in sending Email,Please try again later",
    });
  }
  res.status(200).json({
    status: "success",
    message: "Reset token has been sent successfully to your email",
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //Get Token from url
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  //Check If it is invalid
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: {
      $gt: Date.now(),
    },
  });
  console.log("hashed:", hashedToken);
  console.log("time", new Date(Date.now()));
  if (!user) return next(new AppError(401, "Token in invalid or has expired"));
  //If valid , reset password
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  await user.save();

  createAndSendToken(user, 201, req, res);
});

exports.signOut = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  console.log("Signouted");
  res.status(200).json({ status: "success" });
};

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ roll: req.params.roll });
  if (!user) return next(new AppError(404, "No such users found"));
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.updateProfile = catchAsync(async (req, res, next) => {
  let filteredObj = {};
  Object.keys(req.body).forEach(function (el) {
    if (el == "name" || el == "email" || el == "roll") {
      filteredObj[el] = req.body[el];
    }
  });

  if (req.params.roll != req.user.roll)
    return next(new AppError(400, "You are not allowed to do this task"));
  const user = await User.findOneAndUpdate(
    { roll: req.params.roll },
    filteredObj,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await Event.findByIdAndDelete(req.user._id);
  res.status(204).json({});
});
