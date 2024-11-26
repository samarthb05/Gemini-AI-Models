const express = require("express");
const geminiRouter = require("./routes");

const app = express();
app.use(express.json());

app.use("/", geminiRouter);

app.listen(process.env.port, () => {
  console.log(`Server is running on port ${process.env.port}`);
});
