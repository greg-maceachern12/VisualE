import { chatAPI, imageAPI, segmentAPI } from '../utils/apiConfig';
import { getChapterPrompt } from './bookLogic';

export const findChapterPrompt = async (prompt) => {
  try {
    const response = await fetch(segmentAPI, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await response.text();
    console.log("Segment of text: " + data);
    return data;
  } catch (error) {
    console.error("Error with ChatGPT API:", error);
    return "Chapter text invalid - try next chapter";
  }
};

export const generatePromptFromText = async (prompt, bookTitle) => {
  try {
    const response = await fetch(chatAPI, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        bookTitle,
      }),
    });
    const data = await response.json();
    console.log("DALL-E Prompt: " + data.response);
    return data.response;

    // const data = await response.text();
    // console.log("DALL-E Prompt: " + data);
    // return data;
  } catch (error) {
    console.error("Error with ChatGPT API:", error);
    return "Chapter text invalid - try next chapter";
  }
};

export const generateImageFromPrompt = async (prompt, bookTitle) => {
  try {
    console.log("generating image.. this can take up to 15s");
    const response = await fetch(imageAPI, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: prompt,
        aspect_ratio: "16:9",
        title: bookTitle,
      }),
    });
    const data = await response.json();
    console.log(data.imageUrl);
    return data.imageUrl;
  } catch (error) {
    console.error("Error calling the API:", error);
    return "Cannot generate image";
  }
};

export const processChapter = async (chapter, epubReader, bookName) => {
    try {
      const chapterPrompt = await getChapterPrompt(chapter, epubReader);
      const chapterSegment = await findChapterPrompt(chapterPrompt);
  
      if (chapterSegment !== "False") {
        const processedPrompt = await generatePromptFromText(chapterSegment, bookName);
        const generatedImageUrl = await generateImageFromPrompt(processedPrompt, bookName);
        return { displayPrompt: chapterSegment, imageUrl: generatedImageUrl };
      } else {
        return {
          displayPrompt: "This chapter is not part of the plot, please click next chapter.",
          imageUrl: "https://cdn2.iconfinder.com/data/icons/picons-basic-2/57/basic2-085_warning_attention-512.png"
        };
      }
    } catch (error) {
      console.error("Error processing chapter:", error);
      return {
        displayPrompt: `Error processing chapter: ${error.message}. Please try again or move to the next chapter.`,
        imageUrl: "https://cdn2.iconfinder.com/data/icons/picons-basic-2/57/basic2-085_warning_attention-512.png"
      };
    }
  };