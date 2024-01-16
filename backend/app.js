const express = require("express");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/userRoutes");
const tweetRouter = require("./routes/tweetRoutes");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/users", userRouter);
app.use("/api/tweets", tweetRouter);

module.exports = app;
