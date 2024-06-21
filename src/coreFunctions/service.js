import ReactGA from "react-ga";
import { checkAPI, downloadAPI, payAPI } from '../utils/apiConfig';
import { parseEpubFile, processAllChapters, isNonStoryChapter } from './bookLogic';
import { loadStripe } from "@stripe/stripe-js";

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

export const handleFileChange = (file, setEpubFile, setFileError) => {
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

export const handleDownloadBook = async (generatedBook, setLoadingInfo) => {
  try {
    console.log("Downloading book...");
    setLoadingInfo("Downloading book...");
    const response = await fetch(downloadAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(generatedBook),
    });

    if (!response.ok) {
      throw new Error(`Error downloading book: ${response.statusText}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Visuai_${generatedBook.title}.epub`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setLoadingInfo("Book downloaded successfully!");
  } catch (error) {
    console.error("Error downloading the book:", error);
    setLoadingInfo("Error downloading the book.");
  }
};

export const handlePayNow = async (userId) => {
  const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
  try {
    const response = await fetch(payAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (response.ok) {
      const data = await response.json();
      const result = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (result.error) {
        console.error(result.error.message);
      }
    } else {
      console.error("Error creating Stripe checkout session:", response.status);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

export const checkAndDownloadBook = async (bookTitle, setLoadingInfo) => {
  try {
    const response = await fetch(checkAPI, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookTitle }),
    });
    if (response.status === 200) {
      const blobUrl = await response.text();
      console.log(`Book with title "${bookTitle}" found.`);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `Visuai_${bookTitle}.epub`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log(`Book with title "${bookTitle}" downloaded successfully.`);
      setLoadingInfo(`"${bookTitle}" downloaded successfully.`);
      return true;
    } else {
      console.log(`Book with title "${bookTitle}" not found.`);
      return false;
    }
  } catch (error) {
    console.error("Error checking/downloading book:", error);
    return false;
  }
};

export const handleParseAndGenerateImage = async (epubFile, setIsLoading, setLoadingInfo) => {
    ReactGA.event({
      category: "User",
      action: "Button Click",
      label: "Start Generation",
    });
    setIsLoading(true);
    setLoadingInfo("Processing EPUB file...");
  
    if (!epubFile) {
      setLoadingInfo("No EPUB file selected. Please select a file.");
      setIsLoading(false);
      return;
    }
  
    try {
      console.log("Starting EPUB processing...");
  
      const { epubReader, metadata, toc } = await parseEpubFile(epubFile);
  
      const generatedBook = {
        title: metadata.title,
        author: metadata.creator,
        publisher: "Your Publisher",
        cover: "http://demo.com/url-to-cover-image.jpg",
        content: [],
      };
  
      console.log(`Book title: ${generatedBook.title}`);
  
      const bookExists = await checkAndDownloadBook(generatedBook.title, setLoadingInfo);
  
      if (bookExists) {
        setIsLoading(false);
        return;
      }
  
      const chaptersToProcess = [];
      for (let i = 0; i < toc.length; i++) {
        const chapter = toc[i];
        if (isNonStoryChapter(chapter.label)) continue;
        if (chapter.subitems && chapter.subitems.length > 0) {
          for (const subitem of chapter.subitems) {
            chaptersToProcess.push(subitem);
          }
        } else {
          chaptersToProcess.push(chapter);
        }
      }
  
      console.log("Starting chapter processing...");
      console.log(chaptersToProcess);
      const processedBook = await processAllChapters(chaptersToProcess, epubReader, generatedBook.title, setLoadingInfo);
  
      await handleDownloadBook(processedBook, setLoadingInfo);
    } catch (error) {
      console.error("Error while parsing EPUB:", error);
      setLoadingInfo("Error while parsing EPUB.");
    } finally {
      setIsLoading(false);
      console.log("Done processing book... queuing download");
    }
  };