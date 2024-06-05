/* --------------Working Gen Image
const axios = require("axios");
const OpenAIApi = require("openai");

const openai = new OpenAIApi.OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async function (context, req) {
try {
    const image = await openai.images.generate({
      model: "dall-e-3",
      prompt: req.body.prompt,
      style: "vivid",
      response_format: "b64_json",
      quality: "standard",
      size: req.body.size,
    });
    const imageUrl = image.data[0].url;
    context.log(image.data[0]);
    context.log(imageUrl);
    context.res = {
      status: 200,
      body: { imageUrl: imageUrl },
    };
  } catch (error) {
    context.log.error("Error generating image:");
    context.log.error(error);
    
    let errorMessage = "An error occurred while generating the image.";
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      errorMessage = `OpenAI API returned an error: ${error.response.data.error.message}`;
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = "No response received from OpenAI API. Please try again later.";
    } else {
      // Something happened in setting up the request that triggered an Error
      errorMessage = `Error setting up the request: ${error.message}`;
    }
    
    context.res = {
      status: 500,
      body: {
        error: errorMessage,
      },
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
};



---------- Download book------------
const Epub = require("epub-gen");
const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);
const unlink = util.promisify(fs.unlink);
const path = require('path');

module.exports = async function (context, req) {
    context.log('Received request to generate EPUB.');

    // Ensure temp directory is used for Azure environment
    const tempDir = path.join(process.env.TEMP, 'epubs');
    await fs.promises.mkdir(tempDir, { recursive: true });
    const generatedBook = req.body;
    context.log(generatedBook.title);
    const filePath = path.join(tempDir, `Visuai_${generatedBook.title}.epub`);
    try {
        // Generate EPUB file
        await new Epub(generatedBook, filePath).promise;
        context.log('EPUB file created successfully.');

        // Ensure the file is completely written
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Check file integrity
        const fileStats = await fs.promises.stat(filePath);
        if (!fileStats || fileStats.size === 0) {
            throw new Error("File was not created or is empty.");
        }

        // Read the file content
        const fileContent = await readFile(filePath, null);
        context.log('File read successfully for sending.');

        // Prepare the response
        context.res = {
            status: 200,
            body: fileContent,
            isRaw: true,
            headers: {
                'Content-Type': 'application/epub+zip',
                'Content-Disposition': `attachment; filename="${generatedBook.title}.epub"`
            }
        };

        // Clean up the file after sending
        await unlink(filePath);
        context.log('EPUB file cleaned up after sending.');
    } catch (err) {
        context.log.error('Failed to generate or send EPUB:', err);
        context.res = {
            status: 500,
            body: 'Error generating or sending EPUB'
        };
    }
};

