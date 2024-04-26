// chatgpt.js
const express = require("express");
const OpenAIApi = require("openai");
const serverless = require('serverless-http');

const app = express();
app.use(express.json());

const openai = new OpenAIApi.OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/.netlify/functions/chatgpt/api/chatgpt", async (req, res) => {
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
    res.json({ response: chatReply });
  } catch (error) {
    console.error("Error with ChatGPT API:", error);
    res.status(500).json({ error: "An error occurred with the ChatGPT API." });
  }
});

module.exports.handler = serverless(app);