import React, { useState } from "react";
import epub from "epubjs";
import { RingLoader } from "react-spinners";
import { disableButton } from "./utils";
import "./App.css";

function App() {
  const [epubFile, setEpubFile] = useState(null);
  const [chapterTitle, setChapterTitle] = useState("");
  const [displayPrompt, setDisplayPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentSubitemIndex, setCurrentSubitemIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isTextLoading, setIsTextLoading] = useState(false);
  const [epubReader, setEpubReader] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setEpubFile(file);
  };

  const handleParseAndGenerateImage = () => {
    setCurrentChapterIndex(0);
    setCurrentSubitemIndex(0);
    loadChapter(0);
  };

  const handleNextChapter = async () => {
    if (epubReader) {
      await loadChapter(currentChapterIndex, currentSubitemIndex + 1);
    }
  };
  
  const isNonStoryChapter = (chapterLabel) => {
    const nonStoryLabels = ["Title Page", "Cover", "Dedication", "Contents", "Copyright"];
    return nonStoryLabels.some((label) => chapterLabel.toLowerCase().includes(label.toLowerCase()));
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
        } else if (currentChapter.subitems && currentChapter.subitems.length > 0) {
          if (subitemIndex < currentChapter.subitems.length) {
            const currentSubitem = currentChapter.subitems[subitemIndex];
            await processChapter(currentSubitem, reader);
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

  const generateTextFromPrompt = async (prompt) => {
    const processedPrompt = await fetch("/api/chatgpt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: prompt }),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsTextLoading(false);
        return data.response;
      })
      .catch((error) => {
        console.error("Error with ChatGPT API:", error);
        setIsTextLoading(false);
      });

    if (processedPrompt === "False") {
      setDisplayPrompt("Chapter text invalid - try next chapter");
      setIsTextLoading(false);
      setIsImageLoading(false);
      return;
    }
    
    setDisplayPrompt(processedPrompt);
    return processedPrompt;
  };

  const generateImageFromPrompt = async (prompt) => {
    fetch("/generateImage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: prompt }),
    })
      .then((response) => response.json())
      .then((data) => {
        setImageUrl(data.imageUrl);
        setIsImageLoading(false);
        return data.imageUrl;
      })
      .catch((error) => {
        console.error("Error calling the API:", error);
        setIsImageLoading(false);
      });
  };

  const processChapter = async (chapter, epubReader) => {
        setIsImageLoading(true);
        setIsTextLoading(true);
        console.log(chapter)
    setChapterTitle(`${chapter.label}`);
  
    const chapterPrompt = await getChapterPrompt(chapter, epubReader);
  
    setIsImageLoading(true);
    setIsTextLoading(true);
  
    const processedPrompt = await generateTextFromPrompt(chapterPrompt);
    const imageUrl = await generateImageFromPrompt(processedPrompt);
  
    // setDisplayPrompt(processedPrompt);
    setImageUrl(imageUrl);
  };

  const getChapterPrompt = async (chapter, epubReader) => {
    const displayedChapter = await epubReader.renderTo("hiddenDiv").display(chapter.href);
    return displayedChapter.contents.innerText.slice(0, 16000);
  };

  return (
    <div className="App">
      <h1>Visuale - ePub to Image</h1>
      <input type="file" accept=".epub" onChange={handleFileChange} />
      <button id="parse" onClick={handleParseAndGenerateImage}>
        Parse and Generate Image
      </button>
      <button onClick={handleNextChapter}>Next Chapter</button>
      {chapterTitle && (
        <div className="chapterContainer">
          <h2>
            {chapterTitle}
          </h2>
          <div className="container">
            {!isTextLoading && !isImageLoading ? (
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
                <RingLoader size={150} color={"#123abc"} loading={true} />
              </div>
            )}
          </div>
        </div>
      )}
      <div id="hiddenDiv"></div>
    </div>
  );
}

export default App;