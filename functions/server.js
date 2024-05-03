// Import express and other necessary libraries
const express = require("express");
const axios = require("axios"); // For making HTTP requests
const cors = require("cors"); // To enable CORS for your server, if needed
require("dotenv").config({ path: "../.env" });
const OpenAIApi = require("openai");
const serverless = require("serverless-http");

const openai = new OpenAIApi.OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
// console.log(openai);
console.log("rendering functions!");

const app = express();
app.use(express.json());
app.use(cors()); // Use this if your React app is served from a different port or domain

// Endpoint to handle OpenAI ChatGPT API requests
app.post("/.netlify/functions/server/api/chatgpt", async (req, res) => {
  console.log(req.body);

  try {
    const { prompt, style, colorScheme, composition } = req.body;

    const chatResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Identify a visually descriptive segment from the provided chapter text that is suitable for image generation and does not contain explicit violence, gore, or overtly sexual content.
Create a prompt for DALL-E 3 that includes the following:

Image Style: ${style} - Incorporate the style's techniques and visual qualities while avoiding depictions of graphic violence or sexually explicit content.
Color Scheme: ${colorScheme} - Use the color scheme to evoke the desired mood without relying on excessively dark or disturbing tones.
Composition: ${composition} - Employ the composition to guide the viewer's eye and emphasize key elements, avoiding inappropriate or explicit focus.

Use descriptive language to highlight the visual tone, setting, and emotional undertones, ensuring the prompt does not promote violence, hate speech, or explicit content.
Direct the AI to create a visually compelling artwork that captures the essence of the scene, adhering to OpenAI's content guidelines. Consider the interplay of light, shadow, texture, and perspective to create a striking image suitable for a broad audience, without relying on shock value or inappropriate content.`,
        },
        {
          role: "user",
          content: "Here is the chapter text: " + prompt,
        },
      ],
    });
    const chatReply = chatResponse.choices[0].message.content.trim();

    // const chatReply =
    //   "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
    console.log(chatReply);
    res.json({ response: chatReply });
  } catch (error) {
    console.error("Error with ChatGPT API:", error);
    res.status(500).json({ error: "An error occurred with the ChatGPT API." });
  }
});

// Endpoint to handle OpenAI DALL-E 3 API requests
app.post("/.netlify/functions/server/generateImage", async (req, res) => {
  try {
    /*Code to generate image */
    // console.log(req.body)
    const image = await openai.images.generate({
      model: "dall-e-3",
      prompt: req.body.prompt,
    });
    const imageUrl = image.data[0].url;

    /* Safe way to test without using DALL-E Credits */
    // const imageUrl =
    //   "https://images.penguinrandomhouse.com/cover/9780593704462";
    console.log(imageUrl);
    res.json({ imageUrl });
  } catch (error) {
    console.error("Error generating image:", error);
    res
      .status(500)
      .json({ error: "An error occurred while generating the image." });
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
module.exports.handler = serverless(app);
