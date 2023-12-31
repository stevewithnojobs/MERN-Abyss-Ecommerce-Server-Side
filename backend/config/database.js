const mongoose = require("mongoose");

const connectDatabase = function () {
  mongoose
    .connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(function (x) {
      console.log("connected with db...");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connectDatabase;
