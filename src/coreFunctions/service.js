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
  const { setEpubFile, setFileError, setToc, setBookName, setEpubReader } = callbacks;
  
  if (file) {
    if (file.type === "application/epub+zip") {
      setEpubFile(file);
      setFileError("");
      try {
        const { toc, metadata, epubReader } = await parseEpubFile(file);
        setToc(toc);
        setBookName(metadata.title);
        setEpubReader(epubReader);
        populateChapterDropdown(toc);
      } catch (error) {
        console.error("Error parsing EPUB file, could not retrieve TOC.");
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

export const loadChapter = async (chapterIndex, subitemIndex, toc, epubReader, bookName, callbacks) => {
  const { setChapterTitle, setDisplayPrompt, setImageUrl, setIsLoading } = callbacks;

  if (!epubReader) {
    console.error("No EPUB reader available.");
    return;
  }

  setIsLoading(true);
  try {
    const currentChapter = toc[chapterIndex];
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

    setChapterTitle(chapterToLoad.label);

    const { displayPrompt, imageUrl } = await processChapter(chapterToLoad, epubReader, bookName);
    setDisplayPrompt(displayPrompt);
    setImageUrl(imageUrl);
  } catch (error) {
    console.error("Error loading chapter:", error);
    setDisplayPrompt("Error loading chapter. Please try again.");
  } finally {
    setIsLoading(false);
  }
};