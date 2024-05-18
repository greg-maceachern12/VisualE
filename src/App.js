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
  const [displayPrompt, setDisplayPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fileError, setFileError] = useState("");
  const [isAccessGranted, setIsAccessGranted] = useState(false);

  const chatAPI =
    "https://visuaicalls.azurewebsites.net/api/chatgpt?code=QDubsyOhk_c8jC1RAGPBHNydCCNgpgfcSscjsSqVRdw_AzFuxUgufQ%3D%3D";
  const imageAPI =
    "https://visuaicalls.azurewebsites.net/api/generateImage?code=sbKw5c6I6xFV6f9AWYKAbR5IGBIj-td2aUly5oNP4QZMAzFuSvLDYw%3D%3D";
  const segmentAPI =
    "https://visuaicalls.azurewebsites.net/api/segmentFinder?code=pNDxb_DAPifFYYNOr59_RjNuryY-49m3n9iscpdA3MewAzFu0bfNxg%3D%3D";

  const downloadAPI =
    "https://visuaicalls.azurewebsites.net/api/downloadBook?code=stF_cd3PaNQ2JPydwM60_XBkpcmFNkLXswNf971-AnBoAzFu34Rf-w%3D%3D";
  // const downloadAPI =
  // "http://localhost:3001/download-book";

  const testMode = false;

  const handleAccessGranted = () => {
    setIsAccessGranted(true);
  };

  const generatedBook = {
    title: "Generated Book_2",
    author: "Visuai",
    publisher: "Your Publisher",
    cover: "http://demo.com/url-to-cover-image.jpg",
    content: [],
  };

  useEffect(() => {
    ReactGA.initialize("G-74BZMF8F67");
    ReactGA.pageview(window.location.pathname + window.location.search);
    const cleanupGradientBackground = initGradientBackground();
    return () => cleanupGradientBackground();
  }, []);

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

  //calls API to download the book.
  const handleDownloadBook = async () => {
    try {
      console.log("Downloading book...");
      // const response = await fetch("http://localhost:3001/download-book");
      const response = await fetch(downloadAPI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(generatedBook),
      });
      console.log("Response status:", response.status);

      if (!response.ok) {
        console.error("Error downloading book:", response.statusText);
        return;
      }

      const blob = await response.blob();
      console.log("Blob size:", blob.size, "bytes");

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Visuai_${generatedBook.title}.epub`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading the book:", error);
    }
  };

  //When user clicks "Parse and Generate".. aka starts the flow and iterates through all chapters
  const handleParseAndGenerateImage = async () => {
    ReactGA.event({
      category: "User",
      action: "Button Click",
      label: "Start Generation",
    });

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
        const metadata = await epubReader.loaded.metadata;
        generatedBook.title = metadata.title;
      } catch (error) {
        console.error("Error accessing metadata:", error);
      }
      try {
        const nav = await epubReader.loaded.navigation;
        const toc = nav.toc;

        /*Prod Code */
        // // Loop through each chapter in the toc

        // for (let i = 0; i < toc.length; i++) {
        //   console.log("Working on Chapter: " + i);
        //   const chapter = toc[i];

        //   // Skip non-story chapters
        //   if (isNonStoryChapter(chapter.label)) continue;

        //   // Process the chapter and generate an image
        //   await processChapter(chapter, epubReader);
        // }

        // Testing code
        const bounds = 3; // Only process 3 chapters per book for testing purposes
        let processedCount = 0; // Counter for processed chapters

        // Loop through each chapter in the toc
        for (let i = 0; processedCount < bounds && i < toc.length; i++) {
          const chapter = toc[i];
          console.log("Working on Chapter: " + i + " " + chapter.label);

          // Skip non-story chapters
          if (isNonStoryChapter(chapter.label)) {
            continue;
          }

          // Process the chapter and generate an image
          await processChapter(chapter, epubReader);

          // Increment the counter for processed chapters
          processedCount++;
        }

        handleDownloadBook();
      } catch (error) {
        console.error("Error while parsing EPUB:", error);
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsArrayBuffer(epubFile);
  };

  // checks if the chapter is non-plot
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

  // reconstructs epub
  const addChapter = (chapterTitle, chapterText, imageUrl) => {
    generatedBook.content.push({
      title: chapterTitle,
      data:
        `<body id='master-body'> \n` +
        `<img src='${imageUrl}' /> \n` +
        `<p>${chapterText}</p> \n` +
        `</body>`,
    });
  };

  //main function: calls all of the generation pieces and constructs the books
  const processChapter = async (chapter, epubReader) => {
    setIsLoading(true);
    setChapterTitle(chapter.label);

    const chapterPrompt = await getChapterText(chapter, epubReader);
    const chapterSegment = await findChapterSegment(chapterPrompt.text);

    if (chapterSegment !== "False") {
      const processedPrompt = await generatePromptFromSegment(chapterSegment);

      const imageUrl = await generateImageFromPrompt(processedPrompt);
      setDisplayPrompt(chapterSegment);
      setImageUrl(imageUrl);

      addChapter(chapter.label, chapterPrompt.html, imageUrl);

      setIsLoading(false);
    } else {
      const imageUrl =
        "https://cdn2.iconfinder.com/data/icons/picons-basic-2/57/basic2-085_warning_attention-512.png";
      setDisplayPrompt(
        "This chapter is not part of the plot, please click next chapter."
      );
      setImageUrl(imageUrl);
    }
  };

  // Step1: Gets the text from the chapter
  const getChapterText = async (chapter, epubReader) => {
    const displayedChapter = await epubReader
      .renderTo("hiddenDiv")
      .display(chapter.href);
    const chapterPrompt = {
      html: displayedChapter.document.body.innerHTML,
      text: displayedChapter.contents.innerText.slice(0, 16000),
    };

    // console.log(chapterPrompt.html);
    return chapterPrompt;
  };

  // Step2: Takes the entire chapter as input and finds the best segment of text.
  const findChapterSegment = async (prompt) => {
    try {
      if (testMode === false) {
        const response = await fetch(segmentAPI, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        });
        const data = await response.json();
        console.log("Segment of text: " + data.response);
        return data.response;
      } else {
        const resp = "ttttt";
        return resp;
      }
    } catch (error) {
      console.error("Error with ChatGPT API:", error);
      return "Chapter text invalid - try next chapter";
    }
  };

  // Step3: takes the segment of text and generates a DALL-E optimized prompt
  const generatePromptFromSegment = async (prompt) => {
    try {
      if (testMode === false) {
        const response = await fetch(chatAPI, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt,
          }),
        });
        const data = await response.json();
        console.log("DALL-E Prompt: " + data.response);
        return data.response;
      } else {
        const resp = "ttttt";
        return resp;
      }
    } catch (error) {
      console.error("Error with ChatGPT API:", error);
      return "Chapter text invalid - try next chapter";
    }
  };

  // Step4: takes the prompt from OAI and calls DALL-E
  const generateImageFromPrompt = async (prompt) => {
    try {
      if (testMode === false) {
        console.log("generating image.. this can take up to 15s");
        const response = await fetch(imageAPI, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            prompt,
            size: "1792x1024", 
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
      } else {
        const url =
          "https://www.outdoorpainter.com/wp-content/uploads/2015/04/f8b84457f79954b52239c255e44b3bb1.jpg";
        return url;
      }
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
                      <h1>Visuai - ePub to Image (alpha v2)</h1>
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
                              <p>
                                <i>{displayPrompt}</i>
                              </p>
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
