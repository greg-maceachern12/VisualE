import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/App.scss";
import "./gradBG/gradBG.scss";
import { initGradientBackground } from "./gradBG/gradBG.js";
import Navbar from "./components/Navbar";
import FileUpload from "./components/FileUpload";
import ImageDisplay from "./components/ImageDisplay";
import { getNextChapter } from "./coreFunctions/bookLogic";
import {
  initializeGoogleAnalytics,
  logPageView,
  logEvent,
  handleDownloadSampleBook,
  handleFileChange,
  loadChapter,
} from "./coreFunctions/service";
import About from "./pages/About";

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
  const [toc, setToc] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    initializeGoogleAnalytics();
    logPageView();
    const cleanupGradientBackground = initGradientBackground();
    return () => cleanupGradientBackground();
  }, []);

  const handleFileChangeWrapper = (event) => {
    const file = event.target.files[0];
    handleFileChange(file, {
      setEpubFile,
      setFileError,
      setToc,
      setBookName,
      setEpubReader,
      setError,
    });
  };

  const handleParseAndGenerateImage = async () => {
    logEvent("User", "Button Click", "Start Generation");
    setError(null);

    const chapterDropdown = document.getElementById("chapterDropdown");
    const selectedValue = chapterDropdown.value;
    const indices = selectedValue.split(".").map(Number);
    const chapterIndex = indices[0];
    const subitemIndex = indices[1] || 0;

    setCurrentChapterIndex(chapterIndex);
    setCurrentSubitemIndex(subitemIndex);
    try {
      await loadChapter(chapterIndex, subitemIndex, toc, epubReader, bookName, {
        setChapterTitle,
        setDisplayPrompt,
        setImageUrl,
        setIsLoading,
        setError,
      });
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleNextChapter = async () => {
    setError(null); // Clear any previous errors
    const nextChapter = getNextChapter(
      toc,
      currentChapterIndex,
      currentSubitemIndex
    );
    if (nextChapter) {
      setCurrentChapterIndex(nextChapter.nextChapterIndex);
      setCurrentSubitemIndex(nextChapter.nextSubitemIndex);
      try {
        await loadChapter(
          nextChapter.nextChapterIndex,
          nextChapter.nextSubitemIndex,
          toc,
          epubReader,
          bookName,
          {
            setChapterTitle,
            setDisplayPrompt,
            setImageUrl,
            setIsLoading,
            setError, // Add this to pass the error setter
          }
        );
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    } else {
      setDisplayPrompt("You've reached the end of the book.");
    }
  };

  return (
    <Router>
      <div className="App">
        <Navbar handleDownloadSampleBook={handleDownloadSampleBook} />
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
                <div className="home-content">
                  <div className="header-container">
                    <h1>Turn Words Into Worlds</h1>
                    <h3>
                      Illustrate each chapter of your book - Upload your ePub
                      file to get started
                    </h3>
                    <FileUpload
                      handleFileChange={handleFileChangeWrapper}
                      fileError={fileError}
                      handleParseAndGenerateImage={handleParseAndGenerateImage}
                      epubFile={epubFile}
                    />
                  </div>
                  {chapterTitle && (
                    <ImageDisplay
                      chapterTitle={chapterTitle}
                      isLoading={isLoading}
                      imageUrl={imageUrl}
                      displayPrompt={displayPrompt}
                      handleNextChapter={handleNextChapter}
                      error={error}
                    />
                  )}
                  <div class="button-container">
                    <a
                      href="https://buymeacoffee.com/gregmac"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="coffee-button"
                    >
                      ☕ Buy me a coffee
                    </a>
                  </div>
                  <div id="hiddenDiv"></div>
                </div>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
