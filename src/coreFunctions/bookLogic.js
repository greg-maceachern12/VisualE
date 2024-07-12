import epub from "epubjs";
import {
  findChapterSegment,
  generatePromptFromSegment,
  generateImageFromPrompt,
} from "./generation";

export const parseEpubFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const epubReader = epub(event.target.result);
        const metadata = await epubReader.loaded.metadata;
        const nav = await epubReader.loaded.navigation;
        const toc = nav.toc;
        resolve({ epubReader, metadata, toc });
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

export const isNonStoryChapter = (chapterLabel) => {
  const nonStoryLabels = [
    "Title",
    "Cover",
    "Dedication",
    "Contents",
    "Copyright",
    "Endorsements",
    "Introduction",
    "Author",
    "About",
    "Map",
    "Recommendations"
  ];
  return nonStoryLabels.some((label) =>
    chapterLabel.toLowerCase().includes(label.toLowerCase())
  );
};

export const getChapterText = async (chapter, epubReader) => {
  const displayedChapter = await epubReader
    .renderTo("hiddenDiv")
    .display(chapter.href);
  return {
    html: displayedChapter.document.body.innerHTML,
    text: displayedChapter.contents.innerText.slice(0, 12000),
  };
};

export const removeImages = (chapterText) => {
  const regex = /<img[^>]+>/g;
  return chapterText.replace(regex, "");
};

export const processAllChapters = async (
  chapters,
  epubReader,
  bookTitle,
  coverImg,
  setLoadingInfo
) => {
  console.log(`Total chapters to process: ${chapters.length}`);

  let completedChapters = 0;
  const generatedBook = { title: bookTitle, cover: coverImg, content: [] };

  const updateProgress = () => {
    completedChapters++;
    const percentComplete = Math.round(
      (completedChapters / chapters.length) * 100
    );
    setLoadingInfo(`Processed ${percentComplete}% of chapters.`);
  };

  const results = await Promise.all(
    chapters.map((chapter, index) =>
      processChapter(chapter, index, epubReader, generatedBook).then(
        (result) => {
          updateProgress();
          return result;
        }
      )
    )
  );

  const successfulGenerations = results.filter(
    (result) => result === true
  ).length;

  console.log(
    `All chapters processed. Successful generations: ${successfulGenerations}`
  );
  setLoadingInfo(
    `Processed 100% of chapters. ${successfulGenerations} images generated successfully.`
  );

  return generatedBook;
};

const processChapter = async (
  chapter,
  chapterIndex,
  epubReader,
  generatedBook
) => {
  try {
    const chapterPrompt = await getChapterText(chapter, epubReader);
    const chapterSegment = await findChapterSegment(chapterPrompt.text);

    if (chapterSegment !== "False" && !isNonStoryChapter(chapter.label) && !chapterSegment.startsWith("Error:")) {
      const processedPrompt = await generatePromptFromSegment(
        chapterSegment,
        generatedBook.title
      );
      
      let imageUrl;
      if (processedPrompt.startsWith("Error:")) {
        console.error(processedPrompt);
        imageUrl = "https://cdn.iconscout.com/icon/free/png-256/free-error-2653315-2202987.png";
      } else {
        imageUrl = await generateImageFromPrompt(
          processedPrompt,
          generatedBook.title
        );
      }

      const cleanedBook = removeImages(chapterPrompt.html);
      addChapter(
        generatedBook,
        chapter.label,
        cleanedBook,
        imageUrl,
        chapterIndex
      );
      return true;
    } else {
      console.log("Non-story or error: " + chapter.label);
      const cleanedBook = removeImages(chapterPrompt.html);
      const nonImageUrl = null;
      addChapter(
        generatedBook,
        chapter.label,
        cleanedBook,
        nonImageUrl,
        chapterIndex
      );
      return false;
    }
  } catch (error) {
    console.error("Error processing chapter:", error);
    return false;
  }
};

const addChapter = (
  generatedBook,
  chapterTitle,
  chapterText,
  imageUrl,
  chapterIndex
) => {
  const imageTag = imageUrl ? `<img src='${imageUrl}' />\n` : '';
  
  generatedBook.content[chapterIndex] = {
    title: chapterTitle,
    data: `<body id='master-body'>\n${imageTag}<p>${chapterText}</p>\n</body>`,
  };
};
