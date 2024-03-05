// Import express and other necessary libraries
const express = require('express');
const axios = require('axios'); // For making HTTP requests
const cors = require('cors'); // To enable CORS for your server, if needed
require('dotenv').config();
const OpenAIApi = require('openai');

const openai = new OpenAIApi.OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});



const app = express();
app.use(express.json());
app.use(cors()); // Use this if your React app is served from a different port or domain

// Endpoint to handle OpenAI ChatGPT API requests
app.post('/api/chatgpt', async (req, res) => {
    try {
        const chatResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {"role": "system", "content": "Analyze the inputted book chapter for themes, characters, settings, events, and emotional tone. Generate a prompt highlighting these elements for DALL-E 3 image generation. Use visually descriptive elements as much as possible. Output just the prompt that can immediately be used by DALL-E 3"},
              {"role": "user", "content": req.body.prompt}
            ]
        });
        console.log(chatResponse.choices[0].message.content)
        res.json({ response: chatResponse.choices[0].message.content });
    } catch (error) {
        console.error('Error with ChatGPT API:', error);
        res.status(500).json({ error: 'An error occurred with the ChatGPT API.' });
    }
});



// Endpoint to handle OpenAI DALL-E 3 API requests
app.post('/generateImage', async(req, res) => {
    try {
        
    /*Code to generate image */
        // const image = await openai.images.generate({ model: "dall-e-3", prompt: req.body.prompt });
        // const imageUrl = image.data[0].url;

    /* Safe way to test without using DALEE Credits */
        const imageUrl = "https://images.penguinrandomhouse.com/cover/9780593704462";
        console.log(imageUrl)
        res.json({ imageUrl });
    } catch (error) {
        console.error('Error generating image:', error);
        res.status(500).json({ error: 'An error occurred while generating the image.' });
    }
});


// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
