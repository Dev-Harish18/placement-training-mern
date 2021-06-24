const app = require("../app");
const mongoose = require("mongoose");

const connectDB = () => {
  mongoose.connect(
    process.env.MONGO_CONNECTION_STRING,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    },
    () => console.log("DB Connection successful")
  );
};

module.exports = connectDB;
