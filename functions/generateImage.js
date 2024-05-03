// // generateImage.js
// const express = require("express");
// const OpenAIApi = require("openai");
// const serverless = require('serverless-http');

// const app = express();
// app.use(express.json());

// const openai = new OpenAIApi.OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// app.post("/.netlify/functions/generateImage/generateImage", async (req, res) => {
//   try {
//     const image = await openai.images.generate({
//       model: "dall-e-3",
//       prompt: req.body.prompt,
//     });
//     const imageUrl = image.data[0].url;
//     console.log(imageUrl);
//     res.json({ imageUrl });
//   } catch (error) {
//     console.error("Error generating image:", error);
//     res.status(500).json({ error: "An error occurred while generating the image." });
//   }
// });

// module.exports.handler = serverless(app);