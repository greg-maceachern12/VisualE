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
      setCoverBase64
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
      <div className="min-h-screen relative overflow-hidden">
        {/* Background gradient circles */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white to-gray-50">
          <div 
            className="absolute top-[-10%] left-[-20%] w-3/4 h-3/4 rounded-full bg-gradient-to-r from-blue-100/60 to-cyan-100/60 blur-3xl animate-pulse" 
            style={{ animationDuration: '8s' }}
          />
          <div 
            className="absolute bottom-[-20%] right-[-10%] w-3/4 h-3/4 rounded-full bg-gradient-to-l from-indigo-100/60 to-sky-100/60 blur-3xl animate-pulse" 
            style={{ animationDuration: '10s' }}
          />
          <div 
            className="absolute top-[30%] right-[-20%] w-2/3 h-2/3 rounded-full bg-gradient-to-l from-cyan-100/50 to-blue-100/50 blur-3xl animate-pulse" 
            style={{ animationDuration: '12s' }}
          />
        </div>
        
        {/* Content container with glass effect */}
        <div className="min-h-screen relative backdrop-blur-xl bg-white/30">
          <Navbar handleDownloadSampleBook={handleDownloadSampleBook} />
          
          <main className="container mx-auto py-8 px-4">
            <Routes>
              <Route path="/about" element={<About />} />
              <Route
                path="/"
                element={
                  <div className="space-y-8">
                    <div className="text-center">
                      <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
                        Visuai
                      </h1>
                      <p className="text-xl text-gray-600 mb-8">
                        Turn your books into visual stories
                      </p>
                      <p>Try the <a 
                        href='https://pro.visuai.io' 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 font-bold hover:text-blue-700 transition-colors"
                      >
                        Pro Version
                      </a> to add illustrations to the entire book!</p>
                    </div>

                    <FileUpload
                      handleFileChange={handleFileChangeWrapper}
                      fileError={fileError}
                      handleParseAndGenerateImage={handleParseAndGenerateImage}
                      epubFile={epubFile}
                      coverBase64={coverBase64}
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
                        className="inline-flex items-center px-6 py-3 text-sm font-medium text-gray-600 bg-white/80 rounded-lg border border-gray-200 hover:bg-white hover:border-blue-200 transition-all duration-200 shadow-sm space-x-2 backdrop-blur-sm"
                      >
                        <span>☕</span>
                        <span>Buy me a coffee</span>
                      </a>
                    </div>

                    {/* Hidden div for EPUB.js rendering */}
                    <div 
                      id="hiddenDiv" 
                      className="hidden"
                      style={{ position: 'absolute', visibility: 'hidden', overflow: 'hidden', height: 0 }}
                    />
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