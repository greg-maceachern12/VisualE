import ReactGA from "react-ga";
import { parseEpubFile, populateChapterDropdown, isNonStoryChapter, getNextChapter } from './bookLogic';
import { processChapter } from './generation';

export const initializeGoogleAnalytics = () => {
  ReactGA.initialize("G-74BZMF8F67");
};

export const logPageView = () => {
  ReactGA.pageview(window.location.pathname + window.location.search);
};

export const logEvent = (category, action, label) => {
  ReactGA.event({
    category,
    action,
    label,
  });
};

export const handleDownloadSampleBook = () => {
  logEvent("User", "Button Click", "Download Sample Book");

  const sampleBookUrl = `${process.env.PUBLIC_URL}/The_Crystal_Throne.epub`;
  const link = document.createElement("a");
  link.href = sampleBookUrl;
  link.download = "The_Crystal_Throne.epub";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const handleFileChange = async (file, callbacks) => {
  const { 
    setEpubFile, 
    setFileError, 
    setToc, 
    setBookName, 
    setEpubReader, 
    setCoverBase64  // Changed from having both setCoverUrl and setCoverBase64
  } = callbacks;
  
  if (file) {
    if (file.type === "application/epub+zip") {
      setEpubFile(file);
      setFileError("");
      try {
        const { toc, metadata, epubReader, coverBase64 } = await parseEpubFile(file);
        setToc(toc);
        setBookName(metadata.title);
        setEpubReader(epubReader);
        setCoverBase64(coverBase64);  // Single callback
        populateChapterDropdown(toc);
      } catch (error) {
        console.error("Error parsing EPUB file:", error);
        setFileError("Error parsing EPUB file. Please try again.");
      }
    } else {
      setEpubFile(null);
      setFileError("Please select a valid EPUB file.");
    }
  } else {
    setEpubFile(null);
    setFileError("No file selected.");
  }
};


export const loadChapter = async (
  chapterIndex,
  subitemIndex,
  toc,
  epubReader,
  bookName,
  callbacks
) => {
  const { setChapterTitle, setDisplayPrompt, setImageUrl, setIsLoading, setAudioUrl } = callbacks;

  if (!epubReader) {
    console.error("No EPUB reader available.");
    setDisplayPrompt("Error: EPUB reader not initialized. Please reload the page and try again.");
    return;
  }

  setIsLoading(true);
  try {
    const currentChapter = toc[chapterIndex];
    if (!currentChapter) {
      throw new Error("Invalid chapter index");
    }

    if (isNonStoryChapter(currentChapter.label)) {
      const nextChapter = getNextChapter(toc, chapterIndex, subitemIndex);
      if (nextChapter) {
        await loadChapter(nextChapter.nextChapterIndex, nextChapter.nextSubitemIndex, toc, epubReader, bookName, callbacks);
      } else {
        setDisplayPrompt("You've reached the end of the book.");
      }
      return;
    }

    const chapterToLoad = currentChapter.subitems && currentChapter.subitems.length > 0
      ? currentChapter.subitems[subitemIndex]
      : currentChapter;

    if (!chapterToLoad) {
      throw new Error("Invalid subitem index");
    }

    setChapterTitle(chapterToLoad.label);

    // Call processChapter with an onAudioReady callback that updates the UI.
    const { displayPrompt, imageUrl, audioStream } = await processChapter(
      chapterToLoad,
      epubReader,
      bookName,
      (audioResponse) => {
        // This callback runs when the audio is ready.
        setAudioUrl(audioResponse);
      }
    );
    // Update the UI with the non‑audio results immediately.
    setDisplayPrompt(displayPrompt);
    setImageUrl(imageUrl);
    setAudioUrl(audioStream); // Likely null; will be updated when audio is ready.
  } catch (error) {
    console.error("Error loading chapter:", error);
    setDisplayPrompt(`Error loading chapter: ${error.message}. Please try again or select a different chapter.`);
    setImageUrl("https://cdn2.iconfinder.com/data/icons/picons-basic-2/57/basic2-085_warning_attention-512.png");
    setAudioUrl(null);
  } finally {
    setIsLoading(false);
  }
};
