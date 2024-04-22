const epub = require('epub-gen-memory');
const path = require('path');
const fs = require('fs').promises;

async function generateEpub(epubData, images, metadata) {
  try {
    const chapters = metadata.chapters;

    const content = await Promise.all(chapters.map(async (chapter, index) => {
      const chapterText = await getChapterText(chapter.id, metadata.epub);
      return {
        title: chapter.title,
        content: `<img src="${images[index].data}" alt="${chapter.title}"><br>${chapterText}`,
      };
    }));

    const options = {
      title: metadata.title,
      author: metadata.creator,
      content: content,
    };

    const outputDir = path.join(__dirname, 'output');
    await fs.mkdir(outputDir, { recursive: true });

    const outputPath = path.join(outputDir, 'generated-ebook.epub');

    const epubContent = await epub(options);

    await fs.writeFile(outputPath, epubContent);

    console.log('ePub file generated successfully');
  } catch (error) {
    throw error;
  }
}

process.on('message', async (message) => {
  try {
    const { epubData, images, metadata } = message;
    await generateEpub(epubData, images, metadata);
    process.send('success');
  } catch (error) {
    console.error('Error generating ePub:', error);
    process.send(error.message);
  }
});

async function getChapterText(chapterId, epub) {
  return new Promise((resolve, reject) => {
    epub.getChapter(chapterId, (error, text) => {
      if (error) {
        reject(error);
      } else {
        resolve(text);
      }
    });
  });
}