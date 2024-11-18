const express = require("express");
const rateLimit = require("express-rate-limit");
const geminiRouter = require("./routes");

const app = express();
app.use(express.json());

//limit per minute
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  message: "Too many requests, please try again after some time.",
});

//limit per day
const dailyLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 1500,
  message: "Daily request limit exceeded, please try again tomorrow.",
});

// Apply filters
app.use(limiter);
app.use(dailyLimiter);

app.use("/", geminiRouter);

app.listen(process.env.port, () => {
  console.log(`Server is running on port ${process.env.port}`);
});
