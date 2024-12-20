import { chatAPI, imageAPI, segmentAPI } from '../utils/apiConfig';
import { getChapterPrompt } from './bookLogic';

export const findChapterPrompt = async (prompt, bookName) => {
  try {
    const response = await fetch(segmentAPI, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        prompt: prompt,
        bookName: bookName, 
    }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // const data = await response.text();
    const data = await response.json();
    console.log("Segment of text: " + data.response);
    return data.response;
  } catch (error) {
    console.error("Error with Segment API:", error);
    throw new Error("Failed to process chapter text. Please try again.");
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
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("DALL-E Prompt: " + data.response);
    return data.response;
  } catch (error) {
    console.error("Error with ChatGPT API:", error);
    throw new Error("Failed to generate image prompt. Please try again.");
  }
};

export const generateImageFromPrompt = async (prompt, bookTitle) => {
  try {
    console.log("generating image.. this can take up to 15s");
    const response = await fetch(imageAPI, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: prompt
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (!data.result) {
      throw new Error("Image URL not received from API");
    }
    // console.log(data)
    console.log(data.result);
    return data.result;
  } catch (error) {
    console.error("Error calling the Image API:", error);
    throw new Error("Failed to generate image. Please try again.");
  }
};

const changeBorderWidth = (side) => {
  const chapterDisplay = document.querySelector('.chapterContainer');
  if (chapterDisplay) {
    if (side === "all") {
      chapterDisplay.style[`border-width`] = '0px';
    } else {
    chapterDisplay.style[`border-${side}-width`] = '3px';
    }
  }
};

export const processChapter = async (chapter, epubReader, bookName) => {
  try {
    if (!chapter || !epubReader || !bookName) {
      throw new Error("Invalid input parameters for chapter processing");
    }

    const chapterPrompt = await getChapterPrompt(chapter, epubReader);
    if (!chapterPrompt) {
      throw new Error("Failed to get chapter prompt");
    } else {
      changeBorderWidth("bottom");
    }

    const chapterSegment = await findChapterPrompt(chapterPrompt, bookName);
    if (!chapterSegment) {
      throw new Error("Failed to find chapter segment");
    } else {
      changeBorderWidth("left");
    }

    if (chapterSegment !== "False") {
      //users the entire text from the chapter instead of the summary
      const processedPrompt = await generatePromptFromText(chapterPrompt, bookName);
      if (!processedPrompt) {
        throw new Error("Failed to generate prompt from text");
      } else {
        changeBorderWidth("top");
      }

      const generatedImageUrl = await generateImageFromPrompt(processedPrompt, bookName);
      if (!generatedImageUrl) {
        throw new Error("Failed to generate image URL");
      } 
    
      changeBorderWidth("right");
      changeBorderWidth("all");
      return { displayPrompt: chapterSegment, imageUrl: generatedImageUrl };
    } else {
      return {
        displayPrompt: "This chapter is not part of the plot, please click next chapter.",
        imageUrl: "https://cdn2.iconfinder.com/data/icons/picons-basic-2/57/basic2-085_warning_attention-512.png"
      };
    }
  } catch (error) {
    console.error("Error processing chapter:", error);
    throw new Error(`Error processing chapter: ${error.message}. Please try again or move to the next chapter.`);
  }
};