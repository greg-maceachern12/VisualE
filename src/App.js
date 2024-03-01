import React, { useState, useEffect } from 'react';
import epub from 'epubjs';
import axios from 'axios';

function App() {
  const [epubFile, setEpubFile] = useState(null);
  const [chapterTexts, setChapterTexts] = useState({});
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);

  useEffect(() => {
    // Load the initial chapter when the component mounts
    loadChapter(currentChapterIndex);
  }, [currentChapterIndex]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setEpubFile(file);
    // Reset the chapter index when a new file is selected
    setCurrentChapterIndex(0);
  };

  const loadChapter = async (index) => {
    if (!epubFile) {
      console.error('No EPUB file selected.');
      return;
    }

    const reader = new FileReader();

    reader.onload = async (event) => {
      const epubBlob = new Blob([event.target.result], { type: 'application/epub+zip' });
      const epubReader = epub(epubBlob);

      try {
        // Attempt to retrieve navigation information
        const nav = await epubReader.loaded.navigation;
        const toc = nav.toc;

        // Check if the index is within bounds
        if (index >= 0 && index < toc.length) {
          const chapter = toc[index];

          // Display the chapter using rendition.display
          const rendition = epubReader.renderTo(document.body, {
            manager: 'continuous',
            flow: 'scrolled',
            width: '60%',
          });

          const displayedChapter = await rendition.display(chapter.href);

          // Log the text of the current chapter
          console.log(`Text for ${chapter.label}:`, displayedChapter.contents.innerText);

          // Update the chapter texts in the state
          setChapterTexts((prevChapterTexts) => ({
            ...prevChapterTexts,
            [chapter.label]: displayedChapter.contents.innerText,
          }));
        }
      } catch (error) {
        console.error('Error while parsing EPUB:', error);
      }
    };

    reader.readAsArrayBuffer(epubFile);
  };

  const handleParseAndGenerateImage = async () => {
    // Increment the current chapter index
    setCurrentChapterIndex((prevIndex) => prevIndex + 1);
  };

  return (
    <div>
      <h1>EPUB to Image</h1>
      <input type="file" accept=".epub" onChange={handleFileChange} />
      <button onClick={handleParseAndGenerateImage}>Parse and Generate Image</button>

      {/* Display chapter texts */}
      <div>
        <h2>Chapter Texts:</h2>
        <pre>{JSON.stringify(chapterTexts, null, 2)}</pre>
      </div>
    </div>
  );
}

export default App;