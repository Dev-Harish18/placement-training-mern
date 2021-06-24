const AppError = require("./AppError");

const handleDuplicateError = (key) => {
  let keyName = key;
  switch (key) {
    case "roll":
      keyName = "Roll No";
      break;
    case "name":
      keyName = "Name";
      break;
    case "email":
      keyName = "Email";
      break;
  }
  return new AppError(400, `This ${keyName} has been already taken`);
};

const handleJwtError = () => {
  return new AppError(401, "Unauthenticated ! Please Log In");
};
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  return new AppError(400, `Invalid Input : ${errors.join(",")}`);
};

const globalErrorHandler = (err, req, res, next) => {
  let error = { ...err };
  if (err.name == "MongoError" && err.code == 11000)
    error = handleDuplicateError(Object.keys(err.keyValue)[0]);
  if (err.name == "ValidationError") error = handleValidationError(err);
  if (err.name == "JsonWebTokenError") error = handleJwtError();
  console.log(error);
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
  error.message = error.message || "Something went wrong";

  return res.status(200).json({
    status: error.status,
    statusCode: error.statusCode,
    message: error.message,
  });
};

module.exports = globalErrorHandler;
