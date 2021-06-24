const Event = require("../models/Event");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

exports.allEvents = catchAsync(async (req, res, next) => {
  let events = await Event.find().sort("-createdAt");
  events = events.map((event) => {
    return {
      ...event.toObject(),
      attended: event.users.includes(req.user._id),
      users: undefined,
    };
  });
  res.status(200).json({
    status: "success",
    total: events.length,
    data: {
      events,
    },
  });
});

exports.validateId = (req, res, next) => {
  if (req.params.id.length !== 24)
    return next(new AppError("404", "Invalid event id"));
  next();
};

exports.getEvent = catchAsync(async (req, res, next) => {
  let event = await Event.findById(req.params.id);
  if (!event) return next(new AppError("404", "No such events found"));
  event = {
    ...event.toObject(),
    attended: event.users.includes(req.user._id),
    users: undefined,
  };
  res.status(200).json({
    status: "success",
    data: {
      event,
    },
  });
});

exports.handleSubmit = catchAsync(async (req, res, next) => {
  const event = await Event.findByIdAndUpdate(
    req.params.id,
    {
      $push: { users: req.user._id },
    },
    { new: true, upsert: true }
  );

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $push: {
        events: {
          eventId: req.params.id,
          time: req.body.time,
          score: req.body.score,
        },
      },
    },
    { new: true, upsert: true }
  );

  if (!event) return next(new AppError(404, "No such Events found"));
  res.status(201).json({
    status: "success",
    data: {
      event,
      user,
    },
  });
});

exports.addEvent = catchAsync(async (req, res, next) => {
  const event = await Event.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      event,
    },
  });
});
exports.editEvent = catchAsync(async (req, res, next) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!event) return next(new AppError("404", "No such events found"));
  res.status(201).json({
    status: "success",
    data: {
      event,
    },
  });
});
exports.deleteEvent = catchAsync(async (req, res, next) => {
  await Event.findByIdAndDelete(req.params.id);
  const user = await User.findById(req.user._id);

  user.events = user.events.filter((evt) => evt.eventId != req.params.id);
  console.log(user.events);
  await user.save({ validateBeforeSave: false });

  res
    .status(200)
    .json({ status: "success", message: "Quiz deleted successfully" });
});
exports.getStats = catchAsync(async (req, res, next) => {
  let event = await Event.findById(req.params.id).populate("users");
  if (!event) return next(new AppError(404, "No such Events found"));
  //Filter only current events stuff
  event.users.forEach((user) => {
    user.events = user.events.filter((evt) => evt.eventId == req.params.id);
  });

  // Sort based on score
  event.users.sort((a, b) => b.events[0]["score"] - a.events[0]["score"]);

  res.status(200).json({
    status: "success",
    data: {
      event,
    },
  });
});
