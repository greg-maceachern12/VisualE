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

// Endpoint to handle OpenAI API requests
app.post('/generateImage', async(req, res) => {
    try {
        
    /*Code to generate image */
        const image = await openai.images.generate({ model: "dall-e-3", prompt: req.body.prompt });
        const imageUrl = image.data[0].url;

    /* Safe way to test without using DALEE Credits */
        // const imageUrl = "https://images.penguinrandomhouse.com/cover/9780593704462";
        console.log(imageUrl)
        res.json({ imageUrl });
    } catch (error) {
        console.error('Error generating image:', error);
        res.status(500).json({ error: 'An error occurred while generating the image.' });
    }
});


// app.post('/api/openai', async (req, res) => {
//     const { prompt } = req.body;
//     try {
//         const response = await axios.post(
//             "https://api.openai.com/v2/images/generations",
//             {
//               prompt: prompt,
//               n: 1, // Number of images to generate
//               size: "1024x1024", // Image size
//             },
//             {
//               headers: {
//                 Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Accessing the API key from .env
//               },
//             }
//           );
//         res.json(response.data);
//     } catch (error) {
//         res.status(500).send(error.toString());
//     }
// });


// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
