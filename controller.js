const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

let tokenUsage = 0;

module.exports.getResponse = async (req, res) => {
  try {
    const userPrompt = req.body.userPrompt;

    const estimatedTokens = userPrompt.length / 6;
    if (tokenUsage + estimatedTokens > 1_000_000) {
      return res
        .status(429)
        .json({
          message: "Token usage limit exceeded, please try again later.",
        });
    }

    const result = await model.generateContent(userPrompt);
    const response = result.response;
    const text = response.text();

    tokenUsage += estimatedTokens + text.length / 6;

    res.send(text);
  } catch (error) {
    if (error.response && error.response.status === 429) {
      return res
        .status(429)
        .json({ message: "Rate limit exceeded, please try again later." });
    } else {
      console.error("Error generating content:", error);
      res
        .status(500)
        .json({ message: "An error occurred while processing your request." });
    }
  }
};
