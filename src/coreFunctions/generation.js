import {
  OpenAiSegmentAPI,
  OpenAiChatAPI,
  SDimageAPI,
} from "../utils/apiConfig";
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
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("OSegment: " + data.response);
      return data.response;
    } catch (error) {
      console.error("Error with segment API:", error);
      ReactGA.event({
        category: "API",
        action: "Error",
        label: "Segment API failed",
      });
      return "Error: Unable to process chapter segment";
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
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Stable-Diffusion Prompt: " + data.response);
      return data.response;
    } catch (error) {
      console.error("Error with ChatGPT API:", error);
      ReactGA.event({
        category: "API",
        action: "Error",
        label: "ChatGPT API failed",
      });
      return "Error: Unable to generate prompt";
    }
  }
};

export const generateImageFromPrompt = async (prompt, bookTitle) => {
  if (test === true) {
    return "https://cdn.iconscout.com/icon/free/png-256/free-error-2653315-2202987.png";
  } else {
    try {
      console.log("generating image.. this can take up to 15s");
      const response = await fetch(SDimageAPI, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt,
          aspect_ratio: "16:9",
          style_preset: "fantasy-art",
          title: bookTitle,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.imageUrl) {
        throw new Error("No image URL returned from the API");
      }
      
      ReactGA.event({
        category: "User",
        action: "Action Complete",
        label: "Image successfully generated",
      });
      return data.imageUrl;
    } catch (error) {
      console.error("Error generating image:", error);
      ReactGA.event({
        category: "User",
        action: "Error",
        label: "Image generation failed",
      });
      return "https://cdn.iconscout.com/icon/free/png-256/free-error-2653315-2202987.png";
    }
  }
};