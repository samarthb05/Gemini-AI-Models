const { GoogleGenerativeAI } = require("@google/generative-ai");
const {
  GoogleAIFileManager,
  FileState,
} = require("@google/generative-ai/server");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const fileManager = new GoogleAIFileManager(process.env.API_KEY);

//text Result
module.exports.getResponse = async (req, res) => {
  try {
    const userPrompt = req.body.userPrompt;
    const result = await model.generateContent(userPrompt);
    const response = result.response;
    const text = response.text();

    return res.status(200).json({ message: "Result generated!", data: text });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while processing your request." });
  }
};

//document processing
module.exports.documentProcessing = async (req, res) => {
  const { userText } = req.body;
  try {
    const uploadResponse = await fileManager.uploadFile(
      "C:/Users/Desktop/dummy.pdf",
      {
        mimeType: "application/pdf",
        displayName: "Gemini 1.5 PDF",
      }
    );
    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResponse.file.mimeType,
          fileUri: uploadResponse.file.uri,
        },
      },
      { text: userText },
    ]);
    const documetResponse = result.response.text();
    res.status(200).json({ message: "Your result", data: documetResponse });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//image processing
module.exports.visionProcessing = async (req, res) => {
  const { prompt } = req.body;
  try {
    const uploadResult = await fileManager.uploadFile(
      "C:/Users/Pictures/Capture.PNG",
      {
        mimeType: "image/png",
        displayName: "Capture",
      }
    );
    const result = await model.generateContent([
      prompt,
      {
        fileData: {
          fileUri: uploadResult.file.uri,
          mimeType: uploadResult.file.mimeType,
        },
      },
    ]);
    const finalResult = result.response.text();
    res.status(200).json({ message: "Vision Result", data: finalResult });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//audio processing
module.exports.audioProcessing = async (req, res) => {
  const { audioPrompt } = req.body;
  try {
    const uploadResult = await fileManager.uploadFile(
      "C:/Users/Downloads/muzic.mp3",
      {
        mimeType: "audio/mp3",
        displayName: "muzic",
      }
    );
    let file = await fileManager.getFile(uploadResult.file.name);
    while (file.state === FileState.PROCESSING) {
      process.stdout.write(".");
      await new Promise((resolve) => setTimeout(resolve, 10_000));
      file = await fileManager.getFile(uploadResult.file.name);
    }
    if (file.state === FileState.FAILED) {
      throw new Error("Audio processing failed.");
    }
    const result = await model.generateContent([
      audioPrompt,
      {
        fileData: {
          fileUri: uploadResult.file.uri,
          mimeType: uploadResult.file.mimeType,
        },
      },
    ]);
    const audioResult = result.response.text();
    return res.status(200).json({ message: "Result", data: audioResult });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
