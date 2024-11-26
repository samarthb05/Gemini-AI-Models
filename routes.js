const express = require("express");
const { getResponse,documentProcessing,visionProcessing,audioProcessing } = require("./controller");
const geminiRouter = express.Router();

geminiRouter.post("/textResult", getResponse);
geminiRouter.post("/document",documentProcessing);
geminiRouter.post("/vision",visionProcessing);
geminiRouter.post("/audio",audioProcessing);

module.exports = geminiRouter;
