import { segmentAPI, chatAPI, imageAPI } from '../utils/apiConfig';
import ReactGA from "react-ga";

export const findChapterSegment = async (prompt) => {
  try {
    const response = await fetch(segmentAPI, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await response.text();
    console.log("Segment: " + data);
    return data;
  } catch (error) {
    console.error("Error with ChatGPT API:", error);
    return "Chapter text invalid - try next chapter";
  }
};

export const generatePromptFromSegment = async (prompt, bookTitle) => {
  try {
    const response = await fetch(chatAPI, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, bookTitle }),
    });
    const data = await response.json();
    console.log("Stable-Diffusion Prompt: " + data.response);
    return data.response;
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
        style_preset: "digital-art",
        title: bookTitle,
      }),
    });
    const data = await response.json();
    if (data.error) {
      console.error("Error generating image:", data.error);
      ReactGA.event({
        category: "User",
        action: "Error",
        label: "Image generation failed",
      });
      return `Error: ${data.error}`;
    }
    ReactGA.event({
      category: "User",
      action: "Action Complete",
      label: "Image successfully generated",
    });
    return data.imageUrl;
  } catch (error) {
    console.error("Error calling the API:", error);
    ReactGA.event({
      category: "User",
      action: "Error",
      label: "Image generation failed",
    });
    return `Error: ${error.message}`;
  }
};