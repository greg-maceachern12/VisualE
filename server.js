const express = require('express');
const multer = require('multer');
const EPub = require('epub');
const cors = require('cors');
require('dotenv').config();
const OpenAIApi = require('openai');
const path = require('path');
const fs = require('fs');
const { fork } = require('child_process');

const openai = new OpenAIApi.OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.post('/processEbook', upload.single('epubFile'), async (req, res) => {
  try {
    const epubData = req.file.buffer;
    console.log('Received ePub file');

    await processEpub(epubData);

    res.status(200).send('ePub generation completed');
  } catch (error) {
    console.error('Error processing ebook:', error);
    if (error.message === 'Invalid ePub file') {
      res.status(400).send('Invalid ePub file');
    } else {
      res.status(500).send('Error processing ebook');
    }
  }
});

app.get('/downloadEbook', (req, res) => {
  const outputPath = path.join(__dirname, 'output', 'generated-ebook.epub');
  res.download(outputPath, 'generated-ebook.epub', (err) => {
    if (err) {
      console.error('Error downloading ebook:', err);
      res.status(500).send('Error downloading ebook');
    }
  });
});

async function processEpub(epubData) {
  const epubGenerator = fork('./src/epubGenerator.js');

  const epub = new EPub(epubData);
  await new Promise((resolve, reject) => {
    epub.on('end', resolve);
    epub.on('error', reject);
    epub.parse();
  });

  const chapters = epub.flow.map((chapter) => ({
    id: chapter.id,
    href: chapter.href,
    title: chapter.title,
  }));

  const imagePromises = chapters.map(async (chapter, index) => {
    console.log(`Processing chapter ${index + 1}`);
    const chapterText = await getChapterText(chapter.id, epub);
    const prompt = await generateTextFromPrompt(chapterText);
    const imageUrl = await generateImageFromPrompt(prompt);

    return {
      title: chapter.title,
      data: imageUrl,
      extension: 'jpg',
    };
  });

  const images = await Promise.all(imagePromises);

  const metadata = {
    title: epub.metadata.title,
    creator: epub.metadata.creator,
    chapters: chapters,
    epub: epub,
  };

  epubGenerator.send({ epubData, images, metadata });

  return new Promise((resolve, reject) => {
    epubGenerator.on('message', (message) => {
      if (message === 'success') {
        resolve();
      } else {
        reject(new Error(message));
      }
    });

    epubGenerator.on('error', reject);
  });
}

async function getChapterText(chapterId, epub) {
  return new Promise((resolve, reject) => {
    epub.getChapter(chapterId, (error, text) => {
      if (error) {
        reject(error);
      } else {

        resolve(text.slice(0, 16000));
      }
    });
  });
}

async function generateTextFromPrompt(prompt) {
  try {
    // const chatResponse = await openai.chat.completions.create({
    //   model: "gpt-3.5-turbo",
    //   messages: [
    //     {
    //       role: "system",
    //       content:
    //         "Analyze the provided chapter text to capture a significant visual scene from the text. Formulate a prompt for DALL-E 3 that requests the generation of an image with an oil painting quality. The language of the prompt should be rich and descriptive, highlighting the visual tone and physical and environmental setting found within the chapter while directing the AI to produce an artwork that resonates with the depth and movement characteristic of traditional oil painting.",
    //     },
    //     { role: "user", content: "Here is the chapter text: " + prompt },
    //   ],
    // });
    // const chatReply = chatResponse.choices[0].message.content;

    const chatReply =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

    // console.log(chatReply);
    return chatReply;
  } catch (error) {
    console.error("Error with ChatGPT API:", error);
    throw new Error("An error occurred with the ChatGPT API.");
  }
}

async function generateImageFromPrompt(prompt) {
  try {
    // const image = await openai.images.generate({
    //   model: "dall-e-3",
    //   prompt: prompt,
    // });
    // const imageUrl = image.data[0].url;

    const imageUrl =
      "https://images.penguinrandomhouse.com/cover/9780593704462";
    // console.log(imageUrl);
    return imageUrl;
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("An error occurred while generating the image.");
  }
}

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});