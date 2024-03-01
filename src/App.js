import React, { useState } from "react";
import epub from "epubjs";
import axios from "axios";

function App() {
  const [epubFile, setEpubFile] = useState(null);
  const [cha, setCha] = useState("");
  const [chapterTexts, setChapterTexts] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleButtonClick = () => {
    // Increment the current index or reset to 0 if it reaches the end
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setEpubFile(file);
  };

  const handleParseAndGenerateImage = async () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);

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
        // Attempt to retrieve navigation information
        const nav = await epubReader.loaded.navigation;
        const toc = nav.toc;
        const labelsArray = toc.map((chapter) => chapter.label);
        // Output the array
        console.log("Labels Array:", labelsArray);
        console.log("nav", toc);
        console.log("Type of nav:", nav);

        const hiddenDiv = document.createElement("div");
        hiddenDiv.style.display = "none";

        const rendition = epubReader.renderTo(document.body);
        // Displayed is a Promise, so we can use async/await
        const displayed = await rendition.display();
        console.log("Displayed1:", displayed);
        console.log("Displayed:2", displayed.contents.innerText);

        const chapterTexts = {};

        console.log("TOC LENGTH", toc.length);

        // Loop through each item in the TOC
        // for (let i = 0; i < toc.length; i++) {
        const chapter = toc[currentIndex];
        console.log("Chapter:", chapter);

        // Check if the chapter has a valid href property
        // Display the chapter using rendition.display
        const displayedChapter = await rendition.display(chapter.href);
        console.log("Displayyyyyyy:", displayedChapter.contents.innerText);

        // Log the text of the current chapter
        console.log(
          `Text for ${chapter.label}:`,
          displayedChapter.contents.innerText
        );

        // Store the chapter text in the dictionary
        chapterTexts[chapter.label] = displayedChapter.contents.innerText;
        setCha(chapterTexts[chapter.label]);

        console.log("Chapter texts: ", chapterTexts);

        // Now you can make a call to the DALL-E API with the extracted texts

        // Example DALL-E API call
        const response = await axios.post(
          "https://api.openai.com/v2/images/generations",
          {
            prompt: Object.values(chapterTexts).join(". "), // Concatenate all chapter texts into a single string
            n: 1, // Number of images to generate
            size: "1024x1024", // Image size
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Accessing the API key from .env
            },
          }
        );

        // Access the generated image URL from the DALL-E API response
        const imageUrl = response.data.data[0].url; // Assuming the response structure has the URL at this path
        console.log("Generated Image URL:", imageUrl);
        console.log("Generated Image URL:", chapterTexts);
      } catch (error) {
        console.error("Error while parsing EPUB:", error);
      }
    };

    reader.readAsArrayBuffer(epubFile);
  };

  return (
    <div>
      <h1>EPUB to Image</h1>
      <input type="file" accept=".epub" onChange={handleFileChange} />
      <button onClick={handleParseAndGenerateImage}>
        Parse and Generate Image
      </button>

      {/* Display chapter texts */}
      <div>
        <h2>Chapter Texts:</h2>
        <p>{cha}</p>
      </div>
    </div>
  );
}

export default App;
