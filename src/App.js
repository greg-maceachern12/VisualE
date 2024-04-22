import React, { useState, useEffect } from "react";
import { GridLoader } from "react-spinners";
import "./App.scss";
import "./gradBG/gradBG.scss";
import { initGradientBackground } from "./gradBG/gradBG.js";

function App() {
  const [epubFile, setEpubFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");

  useEffect(() => {
    const cleanupGradientBackground = initGradientBackground();
    return () => cleanupGradientBackground();
  }, []);

  const handleFileChange = (event) => {
    setEpubFile(event.target.files[0]);
    console.log("ePub file selected:", event.target.files[0]);
  };

  const handleStartProcessing = async () => {
    setIsProcessing(true);
    setDownloadUrl("");

    // Send the ePub file to the server for processing
    const formData = new FormData();
    formData.append("epubFile", epubFile);

    try {
      const response = await fetch("/processEbook", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setDownloadUrl("/downloadEbook");
      } else {
        console.error("Error processing ebook");
      }
    } catch (error) {
      console.error("Error processing ebook:", error);
    }

    setIsProcessing(false);
  };

  const handleCancelProcessing = () => {
    setIsProcessing(false);
    console.log("Processing cancelled");
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
        <h1>Visuale - Illustrate your books</h1>
        <input type="file" accept=".epub" onChange={handleFileChange} />
        <button
          onClick={handleStartProcessing}
          disabled={isProcessing || !epubFile}
        >
          {isProcessing ? "Processing..." : "Start"}
        </button>
        {isProcessing && (
          <>
            <div className="loadingContainer">
              <GridLoader size={25} color={"#adbcf3"} loading={true} />
            </div>
            <button onClick={handleCancelProcessing}>Cancel</button>
          </>
        )}
        {downloadUrl && (
          <div className="downloadContainer">
            <a href={downloadUrl} download="generated-ebook.epub">
              Download Generated Ebook
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
