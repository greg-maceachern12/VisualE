import React, { useState } from "react";
import epub from "epubjs";
import axios from "axios";

function App() {
  const [epubFile, setEpubFile] = useState(null);
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterNumber, setChapterNumber] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0); // Track the current chapter index

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setEpubFile(file);
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
      const epubReader = epub(epubBlob);

      try {
        const nav = await epubReader.loaded.navigation;
        const toc = nav.toc;
        if (chapterIndex >= toc.length) {
          console.error("Reached the end of the book.");
          return;
        }

        const currentChapter = toc[chapterIndex];
        setChapterTitle(currentChapter.label);
        setChapterNumber(chapterIndex + 1);

        // Assuming we use rendition to display and access the text
        const displayedChapter = await epubReader
          .renderTo("hiddenDiv")
          .display(currentChapter.href);

        // Extract the first 900 characters of the chapter's text
        const chapterPrompt = displayedChapter.contents.innerText.slice(0, 900);
        console.log(chapterPrompt);
        // Fetch call with the prompt
        fetch("http://localhost:3001/generateImage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: chapterPrompt,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            setImageUrl(data.imageUrl); // Assuming the API returns an object with an imageUrl property
          })
          .catch((error) => console.error("Error calling the API:", error));
      } catch (error) {
        console.error("Error while parsing EPUB:", error);
      }
    };
    reader.readAsArrayBuffer(epubFile);
  };

  const handleParseAndGenerateImage = () => {
    setCurrentIndex(0); // Start from the first chapter
    loadChapter(0);
  };

  const handleNextChapter = () => {
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    loadChapter(nextIndex);
  };

  return (
    <div>
      <h1>EPUB to Image</h1>
      <input type="file" accept=".epub" onChange={handleFileChange} />
      <button onClick={handleParseAndGenerateImage}>
        Parse and Generate Image
      </button>
      <button onClick={handleNextChapter}>Next Chapter</button>
      {chapterTitle && (
        <div>
          <h2>
            Chapter {chapterNumber}: {chapterTitle}
          </h2>
          {imageUrl && <img src={imageUrl} alt="Generated from chapter" />}
        </div>
      )}
      {/* Hidden div for off-screen content rendering */}
      <div id="hiddenDiv" style={{ display: "none", height: 0 }}></div>
    </div>
  );
}

export default App;
