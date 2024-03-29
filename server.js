// Import express and other necessary libraries
const express = require("express");
const axios = require("axios"); // For making HTTP requests
const cors = require("cors"); // To enable CORS for your server, if needed
require("dotenv").config();
const OpenAIApi = require("openai");

const openai = new OpenAIApi.OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(express.json());
app.use(cors()); // Use this if your React app is served from a different port or domain

// Endpoint to handle OpenAI ChatGPT API requests
app.post("/api/chatgpt", async (req, res) => {
  try {
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Analyze the provided chapter text to capture the overarching mood and significant visual elements. Formulate a prompt for DALL-E 3 that requests the generation of an image with a painterly quality, emulating the textured brushwork, vibrant color palette, and dynamic lighting seen in classic adventure fantasy art. The language of the prompt should be rich and descriptive, highlighting the emotional tone and setting found within the chapter while directing the AI to produce an artwork that resonates with the depth and movement characteristic of traditional oil painting. If the chapter text does not lend itself to creating such an image, due to lack of descriptive content or because it is non-narrative in nature (like a table of contents or acknowledgments), return 'False'. This instruction is intended to yield a prompt that will result in an image capturing the spirit and aesthetic of a fantasy saga through a painterly lens.",
        },
        // {
        //   role: "user",
        //   content:
        //     "create a DALL-E 3 image generation prompt from the inputted chapter text",
        // },
        // {
        //   role: "assistant",
        //   content:
        //     "A young fantasy warrior with an intricate blue tunic and brown leather pants is riding on the back of a magnificent blue dragon soaring through a cloudy sky. The dragon has large, powerful wings and glittering scales that catch the light of the sun. The warrior holds a medieval spear in hand and has a look of determination, with long brown hair flowing in the wind. Both are high above a sprawling fantasy landscape below, dotted with mountains and forests. The image is painted in a vibrant, realistic style that emphasizes the dynamic movement of the dragon and the bold colors of the scene",
        // },
        { role: "user", content: "Here is the chapter text: " + req.body.prompt },
      ],
    });
    const chatReply = chatResponse.choices[0].message.content;

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
    const image = await openai.images.generate({
      model: "dall-e-3",
      prompt: req.body.prompt,
    });
    const imageUrl = image.data[0].url;

    /* Safe way to test without using DALEE Credits */
    // const imageUrl = "https://images.penguinrandomhouse.com/cover/9780593704462";
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
