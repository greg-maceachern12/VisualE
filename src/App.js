import React, { useState, useEffect } from "react";
import epub from "epubjs";
import { GridLoader } from "react-spinners";
import "./App.scss";
import "./gradBG/gradBG.scss";
import { initGradientBackground } from "./gradBG/gradBG.js";

function App() {
  const [epubFile, setEpubFile] = useState(null);
  const [chapterTitle, setChapterTitle] = useState("");
  const [displayPrompt, setDisplayPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentSubitemIndex, setCurrentSubitemIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [epubReader, setEpubReader] = useState(null);

  useEffect(() => {
    const cleanupGradientBackground = initGradientBackground();
    return () => cleanupGradientBackground();
  }, []);

  const handleFileChange = (event) => {
    setEpubFile(event.target.files[0]);
  };

  const handleParseAndGenerateImage = () => {
    setCurrentChapterIndex(0);
    setCurrentSubitemIndex(0);
    loadChapter(0);
  };

  const handleNextChapter = async () => {
    if (!epubReader) return;

    const nav = await epubReader.loaded.navigation;
    const toc = nav.toc;

    let nextChapterIndex = currentChapterIndex;
    let nextSubitemIndex = currentSubitemIndex + 1;

    const currentChapter = toc[currentChapterIndex];
    if (currentChapter.subitems && currentChapter.subitems.length > 0) {
      if (nextSubitemIndex >= currentChapter.subitems.length) {
        nextChapterIndex++;
        nextSubitemIndex = 0;
      }
    } else {
      nextChapterIndex++;
      nextSubitemIndex = 0;
    }

    if (nextChapterIndex >= toc.length) {
      console.error("Reached the end of the book.");
      return;
    }

    await loadChapter(nextChapterIndex, nextSubitemIndex);
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

  const loadChapter = async (chapterIndex, subitemIndex = 0) => {
    if (!epubFile) {
      console.error("No EPUB file selected.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const epubBlob = new Blob([event.target.result], {
        type: "application/epub+zip",
      });
      const reader = epub(epubBlob);
      setEpubReader(reader);

      try {
        const nav = await reader.loaded.navigation;
        const toc = nav.toc;

        if (chapterIndex >= toc.length) {
          console.error("Reached the end of the book.");
          return;
        }

        const currentChapter = toc[chapterIndex];
        if (isNonStoryChapter(currentChapter.label)) {
          await loadChapter(chapterIndex + 1);
        } else if (
          currentChapter.subitems &&
          currentChapter.subitems.length > 0
        ) {
          if (subitemIndex < currentChapter.subitems.length) {
            await processChapter(currentChapter.subitems[subitemIndex], reader);
            setCurrentChapterIndex(chapterIndex);
            setCurrentSubitemIndex(subitemIndex);
          } else {
            await loadChapter(chapterIndex + 1);
          }
        } else {
          await processChapter(currentChapter, reader);
          setCurrentChapterIndex(chapterIndex);
          setCurrentSubitemIndex(0);
        }
      } catch (error) {
        console.error("Error while parsing EPUB:", error);
      }
    };
    reader.readAsArrayBuffer(epubFile);
  };

  const processChapter = async (chapter, epubReader) => {
    setIsLoading(true);
    setChapterTitle(chapter.label);

    const chapterPrompt = await getChapterPrompt(chapter, epubReader);
    const processedPrompt = await generateTextFromPrompt(chapterPrompt);
    const imageUrl = await generateImageFromPrompt(processedPrompt);

    setDisplayPrompt(processedPrompt);
    setImageUrl(imageUrl);
    setIsLoading(false);
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
        <button id="parse" onClick={handleParseAndGenerateImage}>
          Parse and Generate Image
        </button>
        <button onClick={handleNextChapter}>Next Chapter</button>
        {chapterTitle && (
          <div className="chapterContainer">
            <h2>{chapterTitle}</h2>
            <div className="container">
              {!isLoading ? (
                <>
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt="Generated from chapter"
                      className="generatedImage"
                    />
                  )}
                  <div className="chapterPrompt">
                    <b>
                      <i>Optimized</i> Image Prompt:
                    </b>{" "}
                    {displayPrompt}
                  </div>
                </>
              ) : (
                <div className="loadingContainer">
                  <GridLoader size={25} color={"#adbcf3"} loading={true} />
                </div>
              )}
            </div>
          </div>
        )}
        <div id="hiddenDiv"></div>
      </div>
    </div>
  );
}

export default App;