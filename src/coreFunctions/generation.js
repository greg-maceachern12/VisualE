import { OpenAiSegmentAPI, OpenAiChatAPI, SDimageAPI } from "../utils/apiConfig";
import ReactGA from "react-ga";

const test = false;

export const findChapterSegment = async (prompt) => {
  if (test === true) {
    return "sample text in text mode";
  } else {
    try {
      const response = await fetch(OpenAiSegmentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      // const data = await response.text();
      // console.log("CSegment: " + data);
      // return data;
      const data = await response.json();
      console.log("OSegment: " + data.response);
      return data.response;
    } catch (error) {
      console.error("Error with segment API:", error);
      return "Chapter text invalid - try next chapter";
    }
  }
};

export const generatePromptFromSegment = async (prompt, bookTitle) => {
  if (test === true) {
    return "sample prompt in test mode";
  } else {
    try {
      const response = await fetch(OpenAiChatAPI, {
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
  }
};

export const generateImageFromPrompt = async (prompt, bookTitle) => {
  if (test === true) {
    return "https://cdn.iconscout.com/icon/free/png-256/free-error-2653315-2202987.png"
  } else {
    try {
      console.log("generating image.. this can take up to 15s");
      const response = await fetch(SDimageAPI, {
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
  }
};
