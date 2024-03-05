import React, { useState } from "react";
import epub from "epubjs";
// import { Zenitho } from "uvcanvas";
// import axios from "axios";

import "./App.css";


function App() {
  const [epubFile, setEpubFile] = useState(null);
  const [chapterTitle, setChapterTitle] = useState("");
  const [displayPrompt, setDisplayPrompt] = useState("");
  const [chapterNumber, setChapterNumber] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0); // Track the current chapter index
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isTextLoading, setIsTextLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setEpubFile(file);
  };

  const loadChapter = async (chapterIndex) => {
    if (!epubFile) {
      console.error("No EPUB file selected.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const epubBlob = new Blob([event.target.result], {
        type: "application/epub+zip",
      });
      const epubReader = epub(epubBlob);

      try {
        const nav = await epubReader.loaded.navigation;
        const toc = nav.toc;
        if (chapterIndex >= toc.length) {
          console.error("Reached the end of the book.");
          return;
        }

        const currentChapter = toc[chapterIndex];
        setChapterTitle(currentChapter.label);
        setChapterNumber(chapterIndex + 1);

        // Assuming we use rendition to display and access the text
        const displayedChapter = await epubReader
          .renderTo("hiddenDiv")
          .display(currentChapter.href);

        // Extract the first 900 characters of the chapter's text
        const chapterPrompt = displayedChapter.contents.innerText.slice(0,16000);
        // Before the fetch call, indicate loading has started
        setIsImageLoading(true);
        setIsTextLoading(true)

        console.log("Chapter Prompt: "+ chapterPrompt);


        // Assume this is part of your function where you want to use the ChatGPT API before image generation
        const processedPrompt = await fetch("/api/chatgpt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: chapterPrompt }),
        })
          .then((response) => response.json())
          .then((data) => {
            setIsTextLoading(false); // Turn off loading indicator on successful data retrieval
            return data.response;
          })
          .catch((error) => console.error("Error with ChatGPT API:", error));
        console.log("Processed Prompt: "+ processedPrompt);


        setDisplayPrompt(processedPrompt);
        
        // Use `processedPrompt` for your image generation API call
        fetch("/generateImage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: processedPrompt }),
        })
          // Follow with the existing logic to handle the image generation response

          .then((response) => response.json())
          .then((data) => {
            setImageUrl(data.imageUrl); // Update with the new image URL
            setIsImageLoading(false); // Loading complete
          })
          .catch((error) => {
            console.error("Error calling the API:", error);
            setIsImageLoading(false); // Ensure loading is stopped on error
          });
      } catch (error) {
        console.error("Error while parsing EPUB:", error);
      }
    };
    reader.readAsArrayBuffer(epubFile);
  };

  const handleParseAndGenerateImage = () => {
    setCurrentIndex(0); // Start from the first chapter
    loadChapter(0);
  };

  const handleNextChapter = () => {
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    loadChapter(nextIndex);
  };

  return (
    <div className="App">
      <h1>Visuale - Epub to Image</h1>
      <input type="file" accept=".epub" onChange={handleFileChange} />
      <button onClick={handleParseAndGenerateImage}>
        Parse and Generate Image
      </button>
      <button onClick={handleNextChapter}>Next Chapter</button>
      {chapterTitle && (
        <div className="chapterContainer">
          <h2>
            Chapter {chapterNumber}: {chapterTitle}
          </h2>
          <div className="chapterPrompt">Image Prompt: {isTextLoading ? "Loading..." : displayPrompt}</div>
          {isImageLoading ? (
            <div className="loadingContainer">
              <span>Loading AI Generated Image... </span>
              <div className="spinner"></div>
            </div>
          ) : (
            imageUrl && (
              <img
                src={imageUrl}
                alt="Generated from chapter"
                className="generatedImage"
              />
            )
          )}
        </div>
      )}
      <div id="hiddenDiv"></div>
    </div>
  );
}

export default App;
