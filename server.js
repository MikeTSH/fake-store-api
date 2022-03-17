//initializes
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const path = require("path");
const logger = require('morgan');

//app
const app = express();

//port
const PORT = 6400;

//routes
const productRoute = require("./routes/product");
const homeRoute = require("./routes/home");
const cartRoute = require("./routes/cart");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");

//middleware
app.use(cors());
app.use(logger('dev'));

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//view engine
app.set("view engine", "ejs");
app.set("views", "views");

app.disable("view cache");

app.use("/", homeRoute);
app.use("/products", productRoute);
app.use("/carts", cartRoute);
app.use("/users", userRoute);
app.use("/auth", authRoute);

const port = process.env.PORT || PORT;

//mongoose
mongoose.set("useFindAndModify", false);
mongoose.set("useUnifiedTopology", true);
mongoose
  .connect(process.env.DB_CONNECT, { useNewUrlParser: true })
  .then(() => {
    app.listen(port, () => {
      console.log('Connected and running on port ' + port);
    });
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = app;
