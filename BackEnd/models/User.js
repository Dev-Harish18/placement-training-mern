const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    validate: {
      validator: function (name) {
        return /^[a-zA-Z .]+$/.test(name);
      },
      message: "Name should contain only alphabets",
    },
    required: [true, "Please provide your name"],
  },
  roll: {
    type: String,
    trim: true,
    required: [true, "Please provide your roll number"],
    unique: true,
    validate: {
      validator: function (roll) {
        return /^1818[L1][0-9]{2}$/.test(roll);
      },
      message: "Please enter valid Roll No",
    },
  },
  role: {
    type: String,
    trim: true,
    default: "student",
  },
  email: {
    type: String,
    trim: true,
    required: [true, "Please provide email"],
    unique: true,
    validate: [validator.isEmail, "Please enter valid Email"],
  },
  events: [
    {
      eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
      score: Number,
      time: String,
    },
  ],
  password: {
    type: String,
    required: [true, "Please provide a password"],
    validate: [
      (pass) => pass.length >= 8 && pass.length <= 30,
      "Password must be minimum 8 characters and maximum 30 characters long",
    ],
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  passwordResetToken: {
    type: String,
    select: false,
  },
  passwordResetExpires: {
    type: Date,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  console.log(this);
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  this.confirmPassword = undefined;

  next();
});

userSchema.methods.createPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 30 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
