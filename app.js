require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bankRoutes = require("./routes/bankRoutes");
const accountRoutes = require("./routes/accounts");
const cartRoutes = require("./routes/carts");
const auth = require("./routes/auth");
const port = process.env.PORT || 3000;
const helmet = require("helmet");
const path = require("path");
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.sx5qn.mongodb.net/simple_bank`
  )
  .then(() => console.log("Connected to database successfully"))
  .catch((err) => console.log(err.message));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static(path.join(__dirname, "public")));

app.use("/", bankRoutes);
app.use("/", auth);
app.use("/accounts", accountRoutes);
app.use("/cart", cartRoutes);

app.listen(port, () => console.log(`Listening on port:${port}`));
