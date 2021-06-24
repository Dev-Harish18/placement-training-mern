const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Event must have a name"],
    unique: true,
  },
  type: {
    type: String,
    default: "quiz",
  },
  total: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  questions: [
    {
      name: {
        type: String,
        required: [true, "Question name is required"],
      },
      id: String,
      options: [String],
      correctOption: Number,
      explanation: {
        type: String,
        default: "No Explanation Provided",
      },
      hint: String,
    },
  ],
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Event = mongoose.model("event", eventSchema);
module.exports = Event;
