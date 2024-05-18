import React, { useState, useEffect } from "react";
import epub from "epubjs";
import ReactGA from "react-ga";
import "./App.scss";
import "./gradBG/gradBG.scss";
import AccessCode from "./AccessCode.js";
import About from "./About";
import { initGradientBackground } from "./gradBG/gradBG.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Skeleton } from "@mui/material";

function App() {
  const [epubFile, setEpubFile] = useState(null);
  const [chapterTitle, setChapterTitle] = useState("");
  const [bookName, setBookName] = useState("");
  const [displayPrompt, setDisplayPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentSubitemIndex, setCurrentSubitemIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [epubReader, setEpubReader] = useState(null);
  
  const [fileError, setFileError] = useState("");
  const [isAccessGranted, setIsAccessGranted] = useState(false);
  const [leftBorderColor, setLeftBorderColor] = useState("");
  const [topBorderColor, setTopBorderColor] = useState("");
  const [rightBorderColor, setRightBorderColor] = useState("");
  const [bottomBorderColor, setBottomBorderColor] = useState("");

  

  const chatAPI =
    "https://visuaicalls.azurewebsites.net/api/chatgpt?code=QDubsyOhk_c8jC1RAGPBHNydCCNgpgfcSscjsSqVRdw_AzFuxUgufQ%3D%3D";
  const imageAPI =
    "https://visuaicalls.azurewebsites.net/api/generateImage?code=sbKw5c6I6xFV6f9AWYKAbR5IGBIj-td2aUly5oNP4QZMAzFuSvLDYw%3D%3D";
  const segmentAPI =
    "https://visuaicalls.azurewebsites.net/api/segmentFinder?code=pNDxb_DAPifFYYNOr59_RjNuryY-49m3n9iscpdA3MewAzFu0bfNxg%3D%3D";

  const handleAccessGranted = () => {
    setIsAccessGranted(true);
  };

  useEffect(() => {
    ReactGA.initialize("G-74BZMF8F67");
    ReactGA.pageview(window.location.pathname + window.location.search);
    const cleanupGradientBackground = initGradientBackground();
    return () => cleanupGradientBackground();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setLeftBorderColor("");
      setTopBorderColor("");
      setRightBorderColor("");
      setBottomBorderColor("");
    }
  }, [isLoading]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === "application/epub+zip") {
        setEpubFile(file);
        setFileError("");
      } else {
        setEpubFile(null);
        setFileError("Please select a valid EPUB file.");
      }
    } else {
      setEpubFile(null);
      setFileError("No file selected.");
    }
  };

  const handleDownloadSampleBook = () => {
    ReactGA.event({
      category: "User",
      action: "Button Click",
      label: "Download Sample Book",
    });

    const sampleBookUrl = `${process.env.PUBLIC_URL}/The_Crystal_Throne.epub`;
    const link = document.createElement("a");
    link.href = sampleBookUrl;
    link.download = "The_Crystal_Throne.epub";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleParseAndGenerateImage = () => {
    ReactGA.event({
      category: "User",
      action: "Button Click",
      label: "Start Generation",
    });

    setCurrentChapterIndex(0);
    setCurrentSubitemIndex(0);
    loadChapter(0);
  };

  const handleNextChapter = async () => {
    if (!epubReader) return;

    const nav = await epubReader.loaded.navigation;
    const metadata = await epubReader.loaded.metadata;
    setBookName(metadata.title)

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
      "Introduction",
      "Author",
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
    setLeftBorderColor("lightblue"); // When getChapterPrompt is completed
    const chapterSegment = await findChapterPrompt(chapterPrompt);
    setTopBorderColor("lightblue"); // When findChapterPrompt is completed
    if (chapterSegment !== "False") {
      const processedPrompt = await generatePromptFromText(chapterSegment)
      setRightBorderColor("lightblue"); // When generatePromptFromText is completed
      const imageUrl = await generateImageFromPrompt(processedPrompt);
      setBottomBorderColor("lightblue"); // When generateImageFromPrompt is completed
      setDisplayPrompt(chapterSegment);
      setImageUrl(imageUrl);
      setIsLoading(false);
    } else {
      const imageUrl =
        "https://cdn2.iconfinder.com/data/icons/picons-basic-2/57/basic2-085_warning_attention-512.png";
      setDisplayPrompt(
        "This chapter is not part of the plot, please click next chapter."
      );
      setImageUrl(imageUrl);
      setIsLoading(false);
    }
  };

  const getChapterPrompt = async (chapter, epubReader) => {
    const displayedChapter = await epubReader
      .renderTo("hiddenDiv")
      .display(chapter.href);
    return displayedChapter.contents.innerText.slice(0, 16000);
  };

  const findChapterPrompt = async (prompt) => {
    try {
      const response = await fetch(segmentAPI, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      console.log("Segment of text: " + data.response);
      return data.response;
    } catch (error) {
      console.error("Error with ChatGPT API:", error);
      return "Chapter text invalid - try next chapter";
    }
  };

  const generatePromptFromText = async (prompt) => {
    try {
      const response = await fetch(chatAPI, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          bookTitle: bookName,
        }),
      });
      const data = await response.json();
      console.log("DALL-E Prompt: " + data.response);
      return data.response;
    } catch (error) {
      console.error("Error with ChatGPT API:", error);
      return "Chapter text invalid - try next chapter";
    }
  };

  const generateImageFromPrompt = async (prompt) => {
    try {
      console.log("generating image.. this can take up to 15s");
      const response = await fetch(imageAPI, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt,
          size: "1024x1024",
          title: bookName,
         }),
      });
      const data = await response.json();
      console.log(data.imageUrl);
      ReactGA.event({
        category: "User",
        action: "Action Complete",
        label: "Image successfully generated",
      });
      return data.imageUrl;
    } catch (error) {
      console.error("Error calling the API:", error);
      return "Cannot generate image";
    }
  };

  return (
    <Router>
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
          <Routes>
            <Route path="/about" element={<About />} />
            <Route
              path="/"
              element={
                <>
                  <div className="header-container">
                    <div className="title-container">
                      <h1>Visuai - ePub to Image (alpha)</h1>
                    </div>
                    {isAccessGranted ? (
                      <div id="headings">
                        <h3>
                          Visuai automatically skips the intro chapters of the
                          book (TOC, Dedications etc.)
                        </h3>
                        <h4>
                          <FontAwesomeIcon icon={faBook} /> No ePub? Click{" "}
                          <button
                            onClick={handleDownloadSampleBook}
                            className="download-link"
                          >
                            here
                          </button>{" "}
                          to download an AI generated one.
                        </h4>
                        <div className="control-container">
                          <div className="input-container">
                            <div className="file-input-wrapper">
                              <input
                                type="file"
                                accept=".epub"
                                onChange={handleFileChange}
                              />
                            </div>
                            {fileError && (
                              <p className="error-message">{fileError}</p>
                            )}
                          </div>
                          {epubFile && (
                            <div className="button-container">
                              <button
                                id="parse"
                                onClick={handleParseAndGenerateImage}
                              >
                                <FontAwesomeIcon icon={faWandMagicSparkles} />
                                Parse and Generate Image
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <AccessCode onAccessGranted={handleAccessGranted} />
                    )}
                    <Link to="/about" className="about-button">
                      About
                    </Link>
                  </div>
                  {chapterTitle && (
                    <div
                      className="chapterContainer"
                      style={{
                        "--left-border-color": leftBorderColor,
                        "--top-border-color": topBorderColor,
                        "--right-border-color": rightBorderColor,
                        "--bottom-border-color": bottomBorderColor,
                      }}
                    >
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
                              <p>
                                <i>{displayPrompt}</i>
                              </p>
                              <button id="nextbtn" onClick={handleNextChapter}>
                                Next Chapter
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="loadingContainer">
                            <div className="skeletonWrapper">
                              <Skeleton
                                variant="rounded"
                                width={400}
                                height={300}
                                animation="wave"
                              />
                              <div className="textSkeletons">
                                <Skeleton
                                  variant="text"
                                  sx={{ fontSize: "1rem" }}
                                />
                                <Skeleton
                                  variant="text"
                                  sx={{ fontSize: "1rem" }}
                                  animation="wave"
                                />
                                <Skeleton
                                  variant="text"
                                  sx={{ fontSize: "1rem" }}
                                  animation="wave"
                                />
                                <Skeleton
                                  variant="text"
                                  sx={{ fontSize: "1rem" }}
                                  animation="wave"
                                />
                                <Skeleton
                                  variant="text"
                                  sx={{ fontSize: "1rem" }}
                                  animation={false}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <div id="hiddenDiv"></div>
                </>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
