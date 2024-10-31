import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import FileUpload from "./components/FileUpload";
import ImageDisplay from "./components/ImageDisplay";
import About from "./pages/About";
import { 
  initializeGoogleAnalytics, 
  logPageView, 
  logEvent,
  handleDownloadSampleBook,
  handleFileChange,
  loadChapter,
} from "./coreFunctions/service";
import { getNextChapter } from "./coreFunctions/bookLogic";
import "./styles/App.scss";

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
  const [coverBase64, setCoverBase64] = useState(null);

  useEffect(() => {
    initializeGoogleAnalytics();
    logPageView();
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
      setCoverBase64  // Changed from setCoverUrl
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
    setError(null);
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
            setError,
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
      <div className="animate-gradient min-h-screen">
        <div className="min-h-screen backdrop-blur-[100px] bg-white/30">
          <Navbar handleDownloadSampleBook={handleDownloadSampleBook} />
          
          <main className="container mx-auto py-8">
            <Routes>
              <Route path="/about" element={<About />} />
              <Route
                path="/"
                element={
                  <div className="space-y-8">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Visuai
                      </h1>
                      <p className="text-lg text-gray-600 mb-8">
                        Turn your books into visual stories
                      </p>
                    </div>

                    <FileUpload
                      handleFileChange={handleFileChangeWrapper}
                      fileError={fileError}
                      handleParseAndGenerateImage={handleParseAndGenerateImage}
                      epubFile={epubFile}
                      coverBase64={coverBase64}  // Pass down as prop if needed
                    />

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

                    <div className="mt-8 text-center">
                      <a
                        href="https://buymeacoffee.com/gregmac"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 py-2 px-4 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-300 hover:bg-gray-50"
                      >
                        ☕ Buy me a coffee
                      </a>
                    </div>

                    {/* Important: This div is needed for EPUB.js rendering */}
                    <div 
                      id="hiddenDiv" 
                      className="hidden"
                      style={{ position: 'absolute', visibility: 'hidden', overflow: 'hidden', height: 0 }}
                    ></div>
                  </div>
                }
              />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;