// // Working Gen Image
// const axios = require("axios");
// const OpenAIApi = require("openai");

// const openai = new OpenAIApi.OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// module.exports = async function (context, req) {
// try {
//     /*Code to generate image */
//     const image = await openai.images.generate({
//       model: "dall-e-3",
//       prompt: req.body.prompt,
//       style: "vivid",
//       response_format: "b64_json",
//       quality: "standard",
//       size: req.body.size,
//     });
//     const imageUrl = image.data[0].url;
//     context.log(image.data[0]);
//     context.log(imageUrl);
//     context.res = {
//       status: 200,
//       body: { imageUrl: imageUrl },
//     };
//   } catch (error) {
//     context.log.error("Error generating image:");
//     context.log.error(error);
    
//     let errorMessage = "An error occurred while generating the image.";
    
//     if (error.response) {
//       // The request was made and the server responded with a status code
//       // that falls out of the range of 2xx
//       errorMessage = `OpenAI API returned an error: ${error.response.data.error.message}`;
//     } else if (error.request) {
//       // The request was made but no response was received
//       errorMessage = "No response received from OpenAI API. Please try again later.";
//     } else {
//       // Something happened in setting up the request that triggered an Error
//       errorMessage = `Error setting up the request: ${error.message}`;
//     }
    
//     context.res = {
//       status: 500,
//       body: {
//         error: errorMessage,
//       },
//       headers: {
//         "Content-Type": "application/json",
//       },
//     };
//   }
// };
