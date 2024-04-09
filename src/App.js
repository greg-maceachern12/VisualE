import React, { useState } from "react";
import epub from "epubjs";
import { RingLoader } from "react-spinners";
import { disableButton } from "./utils";
import "./App.css";

function App() {
  const [epubFile, setEpubFile] = useState(null);
  const [chapterTitle, setChapterTitle] = useState("");
  const [displayPrompt, setDisplayPrompt] = useState("");
  const [chapterNumber, setChapterNumber] = useState(0);
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
      const nav = await epubReader.loaded.navigation;
      const toc = nav.toc;
  
      const currentChapter = toc[currentChapterIndex];
      if (currentChapter.subitems && currentChapter.subitems.length > 0) {
        const nextSubitemIndex = currentSubitemIndex + 1;
        if (nextSubitemIndex < currentChapter.subitems.length) {
          const nextSubitem = currentChapter.subitems[nextSubitemIndex];
          await processChapter(nextSubitem, `${currentChapterIndex + 1}.${nextSubitemIndex + 1}`, epubReader);
          setCurrentSubitemIndex(nextSubitemIndex);
        } else {
          const nextChapterIndex = currentChapterIndex + 1;
          if (nextChapterIndex < toc.length) {
            const nextChapter = toc[nextChapterIndex];
            await processChapter(nextChapter, String(nextChapterIndex + 1), epubReader);
            setCurrentChapterIndex(nextChapterIndex);
            setCurrentSubitemIndex(0);
          } else {
            console.error("Reached the end of the book.");
          }
        }
      } else {
        const nextChapterIndex = currentChapterIndex + 1;
        if (nextChapterIndex < toc.length) {
          const nextChapter = toc[nextChapterIndex];
          await processChapter(nextChapter, String(nextChapterIndex + 1), epubReader);
          setCurrentChapterIndex(nextChapterIndex);
          setCurrentSubitemIndex(0);
        } else {
          console.error("Reached the end of the book.");
        }
      }
    }
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
      const reader = epub(epubBlob);
      setEpubReader(reader);

      try {
        const nav = await reader.loaded.navigation;
        const toc = nav.toc;

        if (chapterIndex >= toc.length) {
          console.error("Reached the end of the book.");
          return;
        }

        await processChapter(toc[chapterIndex], String(chapterIndex + 1), reader);
        const currentChapter = toc[chapterIndex];
        setChapterTitle(currentChapter.label);
        setChapterNumber(chapterIndex + 1);

        // const chapterPrompt = await getChapterPrompt(currentChapter, reader);
        // console.log(chapterPrompt);

        // setIsImageLoading(true);
        // setIsTextLoading(true);

        // const processedPrompt = generateTextFromPrompt(chapterPrompt);
        // generateImageFromPrompt(processedPrompt);
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

  const processChapter = async (chapter, currentLevel, epubReader) => {
        setIsImageLoading(true);
        setIsTextLoading(true);
    setChapterTitle(`${currentLevel}: ${chapter.label}`);
  
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
            Chapter {chapterNumber}: {chapterTitle}
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