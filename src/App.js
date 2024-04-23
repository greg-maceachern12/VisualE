import React, { useState, useEffect } from "react";
import epub from "epubjs";
import { GridLoader } from "react-spinners";
import "./App.scss";
import "./gradBG/gradBG.scss";
import { initGradientBackground } from "./gradBG/gradBG.js";

function App() {
  const [epubFile, setEpubFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadLink, setDownloadLink] = useState("");

  useEffect(() => {
    const cleanupGradientBackground = initGradientBackground();
    return () => cleanupGradientBackground();
  }, []);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setEpubFile(selectedFile);
    console.log("EPUB file selected:", selectedFile);
  };

  const processChapter = async (chapter, epubReader, generatedImages) => {
    console.log("Processing chapter:", chapter);

    if (!isNonStoryChapter(chapter.label)) {
      const chapterPrompt = await getChapterPrompt(chapter, epubReader);
      const processedPrompt = await generateTextFromPrompt(chapterPrompt);
      const imageUrl = await generateImageFromPrompt(processedPrompt);

      generatedImages.push({ chapter, imageUrl });
    } else {
      console.log("Skipping non-story chapter:", chapter.label);
    }

    if (chapter.subitems && chapter.subitems.length > 0) {
      for (const subchapter of chapter.subitems) {
        await processChapter(subchapter, epubReader, generatedImages);
      }
    }
  };

  const handleStartProcessing = async () => {
    if (!epubFile) {
      console.error("No EPUB file selected.");
      return;
    }

    setIsLoading(true);
    console.log("Start processing EPUB file:", epubFile);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const epubBlob = new Blob([event.target.result], {
        type: "application/epub+zip",
      });
      const epubReader = epub(epubBlob);
      console.log("EPUB reader created:", epubReader);

      try {
        const nav = await epubReader.loaded.navigation;
        const toc = nav.toc;
        const generatedImages = [];

        console.log("Table of Contents:", toc);

        for (const chapter of toc) {
          await processChapter(chapter, epubReader, generatedImages);
        }

        console.log("Generated images:", generatedImages);

        console.log("Reconstructing book...");
        const updatedBook = await reconstructBook(epubReader, generatedImages);
        console.log("Updated book:", updatedBook);

        console.log("Creating download link...");
        const downloadLink = await createDownloadLink(updatedBook);
        console.log("Download link:", downloadLink);

        setDownloadLink(downloadLink);
      } catch (error) {
        console.error("Error while processing EPUB:", error);
      }

      setIsLoading(false);
    };
    reader.readAsArrayBuffer(epubFile);
  };

  const isNonStoryChapter = (chapterLabel) => {
    const nonStoryLabels = [
      "Title Page",
      "Cover",
      "Dedication",
      "Contents",
      "Copyright",
      "Endorsements",
      "About",
      "Map",
    ];
    return nonStoryLabels.some((label) =>
      chapterLabel.toLowerCase().includes(label.toLowerCase())
    );
  };

  const getChapterPrompt = async (chapter, epubReader) => {
    const displayedChapter = await epubReader
      .renderTo("hiddenDiv")
      .display(chapter.href);
    return displayedChapter.contents.innerText.slice(0, 16000);
  };

  const generateTextFromPrompt = async (prompt) => {
    try {
      const response = await fetch("/api/chatgpt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error("Error with ChatGPT API:", error);
      return "Chapter text invalid - try next chapter";
    }
  };

  const generateImageFromPrompt = async (prompt) => {
    try {
      const response = await fetch("/generateImage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      return data.imageUrl;
    } catch (error) {
      console.error("Error calling the API:", error);
      return "";
    }
  };

  const reconstructBook = async (epubReader, generatedImages) => {
    // Implement the logic to insert the generated images above the first paragraph of each chapter
    // You can use the epubReader to modify the EPUB content
    // Return the updated EPUB file
  };

  const createDownloadLink = async (updatedBook) => {
    // Create a Blob from the updated EPUB file
    const blob = new Blob([updatedBook], { type: "application/epub+zip" });
    // Create a download link
    const url = URL.createObjectURL(blob);
    return url;
  };

  return (
    <div className="App">
      <div className="gradient-bg">
        <svg xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="goo">
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="10"
                result="blur"
              />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
                result="goo"
              />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
          </defs>
        </svg>
        <div className="gradients-container">
          <div className="g1"></div>
          <div className="g2"></div>
          <div className="g3"></div>
          <div className="g4"></div>
          <div className="g5"></div>
          <div className="interactive"></div>
        </div>
      </div>
      <div className="content-container">
        <h1>Visuale - ePub to Image</h1>
        <h3>
          We automatically skip the intro chapters of the book (TOC, Dedications
          etc.)
        </h3>
        <input type="file" accept=".epub" onChange={handleFileChange} />
        <button id="start" onClick={handleStartProcessing}>
          Start
        </button>
        {isLoading ? (
          <div className="loadingContainer">
            <GridLoader size={25} color={"#adbcf3"} loading={true} />
          </div>
        ) : (
          downloadLink && (
            <a href={downloadLink} download="updated_book.epub">
              Download Updated Book
            </a>
          )
        )}
        <div id="hiddenDiv"></div>
      </div>
    </div>
  );
}

export default App;
