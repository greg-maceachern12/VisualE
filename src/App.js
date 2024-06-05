import React, { useState, useEffect } from "react";
import epub from "epubjs";
import ReactGA from "react-ga";
import "./App.scss";
import "./gradBG/gradBG.scss";
import AccessCode from "./AccessCode.js";
import About from "./About";
import { initGradientBackground } from "./gradBG/gradBG.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { mirage } from "ldrs";

mirage.register();

function App() {
  const [epubFile, setEpubFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [isAccessGranted, setIsAccessGranted] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  // const [estimatedWaitTime, setEstimatedWaitTime] = useState("");
  const [loadingInfo, setLoadingInfo] = useState("");

  const chatAPI =
    "https://visuaicalls.azurewebsites.net/api/chatgpt?code=QDubsyOhk_c8jC1RAGPBHNydCCNgpgfcSscjsSqVRdw_AzFuxUgufQ%3D%3D";
  const imageAPI =
    "https://visuaicalls.azurewebsites.net/api/generateImage?code=sbKw5c6I6xFV6f9AWYKAbR5IGBIj-td2aUly5oNP4QZMAzFuSvLDYw%3D%3D";
  const segmentAPI =
    "https://visuaicalls.azurewebsites.net/api/segmentFinder?code=pNDxb_DAPifFYYNOr59_RjNuryY-49m3n9iscpdA3MewAzFu0bfNxg%3D%3D";

  const downloadAPI =
    "https://visuaicalls.azurewebsites.net/api/downloadBook?code=stF_cd3PaNQ2JPydwM60_XBkpcmFNkLXswNf971-AnBoAzFu34Rf-w%3D%3D";

  const testMode = false;
  const max_iterate = 0; // Set the desired maximum number of iterations

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
      setLoadingInfo("Downloading book...");
      console.log(generatedBook);
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
    } finally {
      setIsLoading(false);
    }
  };

  //Main/root function - When user clicks "Parse and Generate".. aka starts the flow and iterates through all chapters
  const handleParseAndGenerateImage = async () => {
    ReactGA.event({
      category: "User",
      action: "Button Click",
      label: "Start Generation",
    });
    setIsLoading(true);
    setLoadingInfo("Processing EPUB file...");
    if (!epubFile) {
      console.error("No EPUB file selected.");
      setLoadingInfo("No EPUB file selected. Please select a file.");
      return;
    }

    console.log("Starting EPUB processing...");

    const reader = new FileReader();
    reader.onload = async (event) => {
      const epubBlob = new Blob([event.target.result], {
        type: "application/epub+zip",
      });
      const epubReader = epub(epubBlob);
      try {
        const metadata = await epubReader.loaded.metadata;
        generatedBook.title = metadata.title;
        console.log(`Book title: ${generatedBook.title}`);
      } catch (error) {
        console.error("Error accessing metadata:", error);
        setLoadingInfo("Error accessing metadata.");
        setIsLoading(false);
      }
      try {
        const nav = await epubReader.loaded.navigation;
        const toc = nav.toc;

        const chapterBatch = [];

        /*-------Prod Code (no testing max) ---------*/
        // Loop through each chapter in the TOC

        if (max_iterate === 0) {
          let chapterCount = 0;
          for (let i = 0; i < toc.length; i++) {
            const chapter = toc[i];
            // console.log(chapter)
            if (isNonStoryChapter(chapter.label)) continue;
            // Check if chapter has subitems
            if (chapter.subitems && chapter.subitems.length > 0) {
              // Iterate through each subitem in the chapter
              for (const subitem of chapter.subitems) {
                console.log(`Processing Chapter: ${chapterCount}`);
                chapterBatch.push(subitem);
                chapterCount++;
              }
            } else {
              console.log(`Processing Chapter: ${chapterCount}`);
              chapterBatch.push(chapter);
              chapterCount++;
            }
          }
        } else {
          /* -------- Testing Code -------- */
          // ... (existing code for testing)
        }

        console.log("Starting chapter batch processing...");
        await processChapterBatch(chapterBatch, epubReader);

        handleDownloadBook();
      } catch (error) {
        console.error("Error while parsing EPUB:", error);
        setLoadingInfo("Error while parsing EPUB.");
        setIsLoading(false);
      } finally {
        console.log("Done processing book... queuing download");
      }
    };
    reader.readAsArrayBuffer(epubFile);
  };

  const processChapterBatch = async (chapterBatch, epubReader) => {
    const batchSize = 5; // Maximum number of concurrent API calls
    const delayMs = testMode ? 5000 : 62000; // 1 minute delay between batches (in milliseconds) or 200 if testing
    const chapterProcessingTime = 15000; // Assume each chapter takes 15 seconds to process

    const msToHumanReadableTime = (ms) => {
      const hours = Math.floor(ms / 3600000);
      const minutes = Math.floor((ms % 3600000) / 60000);
      const seconds = Math.floor(((ms % 3600000) % 60000) / 1000);

      const hoursString = hours > 0 ? `${hours} hour(s)` : "";
      const minutesString = minutes > 0 ? `${minutes} minute(s)` : "";
      const secondsString = seconds > 0 ? `${seconds} second(s)` : "";

      return `${hoursString} ${minutesString} ${secondsString}`.trim();
    };

    console.log(`Total chapters to process: ${chapterBatch.length}`);

    const totalChapterProcessingTime = chapterBatch.length * chapterProcessingTime;
    const batchCount = Math.ceil(chapterBatch.length / batchSize);
    const totalTime = totalChapterProcessingTime + (batchCount - 1) * delayMs;
    const estimatedTimeRemaining = msToHumanReadableTime(totalTime);
    // setEstimatedWaitTime(estimatedTimeRemaining);

    console.log(`This will take approximately ${estimatedTimeRemaining}`);

    let chaptersProcessed = 0;

    for (let i = 0; i < chapterBatch.length; i += batchSize) {
      const batch = chapterBatch.slice(i, i + batchSize);
      console.log(`Processing batch ${i / batchSize + 1} of ${batchCount}`);

      const promises = batch.map((chapter, index) =>
        processChapter(chapter, index + i, epubReader)
      );

      await Promise.all(promises);
      console.log(`Batch ${i / batchSize + 1} processed successfully`);
      chaptersProcessed += batch.length;
      setLoadingInfo(
        `Processed ${chaptersProcessed} out of ${chapterBatch.length} chapters`
      );

      if (i + batchSize < chapterBatch.length) {
        console.log("Waiting for 1 minute before the next batch...");
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
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
  const addChapter = (chapterTitle, chapterText, imageUrl, chapterIndex) => {
    generatedBook.content[chapterIndex] = {
      title: chapterTitle,
      data:
        `<body id='master-body'> \n` +
        `<img src='${imageUrl}' /> \n` +
        `<p>${chapterText}</p> \n` +
        `</body>`,
    };
    // console.log('index: ' + chapterIndex);
  };

  //secondardy function: calls all of the generation pieces and constructs the books
  const processChapter = async (chapter, chapterIndex, epubReader) => {
    return new Promise(async (resolve, reject) => {
      try {
        // setIsLoading(true);
        const chapterPrompt = await getChapterText(chapter, epubReader);
        const chapterSegment = await findChapterSegment(chapterPrompt.text);

        if (chapterSegment !== "False" && !isNonStoryChapter(chapter.label)) {
          const processedPrompt = await generatePromptFromSegment(
            chapterSegment
          );

          const imageUrl = await generateImageFromPrompt(processedPrompt);
          addChapter(chapter.label, chapterPrompt.html, imageUrl, chapterIndex);
        } else {
          console.log("Not processing " + chapter.label);
          // addChapter(chapter.label, chapterPrompt.html, "", chapterIndex);
        }

        // setIsLoading(false);
        resolve(); // Resolve the promise when chapter processing is complete
      } catch (error) {
        reject(error); // Reject the promise if an error occurs
      }
    });
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
        console.log("Segment: " + data.response);
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
            bookTitle: generatedBook.title,
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
            title: generatedBook.title,
          }),
        });
        const data = await response.json();
        // console.log(data);
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
                      <h1>Visuai</h1>
                      <h2>Turn your epub into a picture book</h2>
                      <h4>Free users limited to 2 chapters</h4>
                    </div>
                    {isAccessGranted ? (
                      <div id="headings">
                        <h3>
                          Visuai skips the intro chapters of the book (TOC,
                          Dedications etc.)
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
                    {isLoading ? (
                      <div>
                        <br></br>
                        <l-mirage
                          size="111"
                          speed="2.9"
                          color="#CDB8FF"
                        ></l-mirage>
                        <div>
                          <p>{loadingInfo}</p>
                          {/* {estimatedWaitTime && (
                            <p>Estimated wait time: {estimatedWaitTime}</p>
                          )} */}
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <div id="hiddenDiv"></div>
                  <Link to="/about" className="about-button">
                    About
                  </Link>
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
