const express = require("express");
const dotEnv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

const userRouter = require("./routes/userRoutes");
const eventRouter = require("./routes/eventRoutes");
const sheetRouter = require("./routes/sheetRoutes");
const connectDB = require("./utils/connectDB");
const AppError = require("./utils/AppError");
const globalErrorHandler = require("./utils/globalErrorHandler");
dotEnv.config();
//Connecting mongodb
connectDB();
//cors
const corsOptions = {
  //To allow requests from client
  origin: ["http://localhost:3001"],
  credentials: true,
};
app.use(cors(corsOptions));
//bodyparser
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
//Mounting routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/events", eventRouter);
app.use("/api/v1/details", sheetRouter);
//Invaid routes
app.all("*", (req, res, next) => {
  return next(new AppError(404, "Page not found"));
});
//Global error Handling
app.use(globalErrorHandler);
//Listening
app.listen(process.env.PORT || 3000, () =>
  console.log(`App started on port ${process.env.PORT}`)
);
module.exports = app;
