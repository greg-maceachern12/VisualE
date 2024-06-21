import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/App.scss";
import "./gradBG/gradBG.scss";
import { initGradientBackground } from "./gradBG/gradBG.js";
import Navbar from "./components/Navbar";
import FileUpload from "./components/FileUpload";
import ImageDisplay from "./components/ImageDisplay";
import { getNextChapter } from "./coreFunctions/bookLogic";
import { initializeGoogleAnalytics, logPageView, logEvent, handleDownloadSampleBook, handleFileChange, loadChapter } from "./coreFunctions/service";
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
      setEpubReader
    });
  };

  const handleParseAndGenerateImage = async () => {
    logEvent("User", "Button Click", "Start Generation");

    const chapterDropdown = document.getElementById("chapterDropdown");
    const selectedValue = chapterDropdown.value;
    const indices = selectedValue.split(".").map(Number);
    const chapterIndex = indices[0];
    const subitemIndex = indices[1] || 0;

    setCurrentChapterIndex(chapterIndex);
    setCurrentSubitemIndex(subitemIndex);
    await loadChapter(chapterIndex, subitemIndex, toc, epubReader, bookName, {
      setChapterTitle,
      setDisplayPrompt,
      setImageUrl,
      setIsLoading
    });
  };

  const handleNextChapter = async () => {
    const nextChapter = getNextChapter(toc, currentChapterIndex, currentSubitemIndex);
    if (nextChapter) {
      setCurrentChapterIndex(nextChapter.nextChapterIndex);
      setCurrentSubitemIndex(nextChapter.nextSubitemIndex);
      await loadChapter(nextChapter.nextChapterIndex, nextChapter.nextSubitemIndex, toc, epubReader, bookName, {
        setChapterTitle,
        setDisplayPrompt,
        setImageUrl,
        setIsLoading
      });
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
                <>
                  <div className="header-container">
                    <div className="title-container">
                      <h1>Turn Words Into Worlds</h1>
                    </div>
                    <div id="headings">
                      <h3>Illustrate each chapter of your book - Upload your ePub file to get started</h3>
                      <FileUpload 
                        handleFileChange={handleFileChangeWrapper}
                        fileError={fileError}
                        handleParseAndGenerateImage={handleParseAndGenerateImage}
                        epubFile={epubFile}
                      />
                    </div>
                  </div>
                  {chapterTitle && (
                    <ImageDisplay 
                      chapterTitle={chapterTitle}
                      isLoading={isLoading}
                      imageUrl={imageUrl}
                      displayPrompt={displayPrompt}
                      handleNextChapter={handleNextChapter}
                    />
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