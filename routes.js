const express = require("express");
const { getResponse } = require("./controller");
const geminiRouter = express.Router();

geminiRouter.post("/getGemResult", getResponse);

module.exports = geminiRouter;
