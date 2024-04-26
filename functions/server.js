// Import express and other necessary libraries
const express = require("express");
const axios = require("axios"); // For making HTTP requests
const cors = require("cors"); // To enable CORS for your server, if needed
require('dotenv').config({ path: '../.env' })
const OpenAIApi = require("openai");
const serverless = require('serverless-http');

const openai = new OpenAIApi.OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
console.log(openai);
console.log('rendering functions!')

const app = express();
app.use(express.json());
app.use(cors()); // Use this if your React app is served from a different port or domain

// Endpoint to handle OpenAI ChatGPT API requests
app.post("/api/chatgpt", async (req, res) => {
  console.log(openai);
  console.log(req.body);
  try {
    const { prompt, style, colorScheme, composition, size } = req.body;

    const chatResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Analyze the provided chapter text to capture a significant visual scene from the text. Formulate a prompt for DALL-E 3 that requests the generation of an image with the following characteristics:

1. Image Style: ${style}
   - Incorporate the techniques, brushstrokes, and visual qualities associated with ${style} to create a visually stunning and immersive image.

2. Color Scheme: ${colorScheme}
   - Use a ${colorScheme} color palette to evoke the desired mood and atmosphere, ensuring that the colors harmonize and enhance the overall visual impact of the image.

3. Composition: ${composition}
   - Employ a ${composition} composition to guide the viewer's eye, create visual interest, and emphasize the key elements of the scene.
4. Size: ${size}
  - Use a ${size} aspect ratio.
The language of the prompt should be rich and descriptive, highlighting the visual tone, physical setting, environmental details, and emotional undertones found within the chapter. Direct the AI to produce an artwork that resonates with the depth, movement, and artistic style characteristic of ${style}, while capturing the essence and significance of the selected scene.

Consider the interplay of light, shadow, texture, and perspective to create a visually compelling and immersive image that transports the viewer into the world of the story.`,
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
app.post("/generateImage", async (req, res) => {
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
// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
module.exports.handler = serverless(app);