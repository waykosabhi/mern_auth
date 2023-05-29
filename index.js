const express = require("express");
const { default: mongoose } = require("mongoose");
require("dotenv").config({ path: "./.env" });
const mogoose = require("mongoose");
const { connect } = require("./routes/userRoutes");
mogoose.connect(process.env.MONGO_URL);
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use("/api/user", require("./routes/userRoutes"));

const PORT = process.env.PORT || 5000;

mongoose.connection.once("open", () => {
  console.log("DB connected");
  app.listen(PORT, console.log(`http://localhost:${PORT}`));
});
