import ReactGA from "react-ga";
import { checkAPI, downloadAPI, payAPI } from "../utils/apiConfig";
import {
  parseEpubFile,
  processAllChapters,
  // isNonStoryChapter,
} from "./bookLogic";
import { loadStripe } from "@stripe/stripe-js";
import { supabase } from "../utils/supabaseClient.js";
import { fetchBlobAndConvertToBase64 } from "../utils/epubUtils.js";

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

    const url = await response.text();
    const link = document.createElement("a");

    link.href = url;
    link.download = `Visuai_${generatedBook.title}.epub`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    const { data, error } = await supabase.from("generated_books").insert({
      book_title: generatedBook.title,
      download_url: url,
    });

    if (error) {
      console.error("Error saving book to database:", error);
    } else {
      console.log("Book saved to database:", data);
    }

    // Reset user's premium status
    const { error: updateError } = await supabase.auth.updateUser({
      data: { is_premium: false, premium_since: null },
    });

    if (updateError) {
      console.error("Error resetting premium status:", updateError);
    } else {
      console.log("Premium status reset successfully");
    }

    setLoadingInfo("Book downloaded and saved successfully!");
  } catch (error) {
    console.error("Error downloading the book:", error);
    setLoadingInfo("Error downloading the book.");
  }
};

export const handlePayNow = async (userId) => {
  const stripe = await loadStripe(
    "pk_live_51PMDZsHMeAmZ2ytpfyzeNN9ExgQBqQml8ROGTFF7pyztT4pue5iEyZW5brLeinKWeEg7ToU0XPrY4so6TPTs92vE0027R3L6B0"
  );
  // const stripe = await loadStripe(
  //   "pk_test_51PMDZsHMeAmZ2ytpSpivpSert86xt8kqmM6bWFbdOxem4vZVE74Lr2t4Frkbl5sfleouQjDvlsKdF4jEH37ii0in00xnLCRaB3"
  // );

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
      console.log(data);
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

export const handlePaymentSuccess = async (userId) => {
  try {
    const { error } = await supabase
      .from("user_meta")
      .upsert({ user_id: userId, is_premium: true }, { onConflict: "user_id" });

    if (error) throw error;
    console.log("User premium status updated successfully");
    return true;
  } catch (error) {
    console.error("Error updating user premium status:", error);
    return false;
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

      // Reset user's premium status
      const { error: updateError } = await supabase.auth.updateUser({
        data: { is_premium: false, premium_since: null },
      });

      if (updateError) {
        console.error("Error resetting premium status:", updateError);
      } else {
        console.log("Premium status reset successfully");
      }

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

export const handleParseAndGenerateImage = async (
  epubFile,
  setIsLoading,
  setLoadingInfo
) => {
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

    let coverBase64 = null;
    await epubReader
      .coverUrl()
      .then((coverBlob) => {
        if (coverBlob) {
          return fetchBlobAndConvertToBase64(coverBlob);
        }
        return null;
      })
      .then((base64) => {
        if (base64) {
          coverBase64 = `data:image/png;base64,${base64}`;
        }
      })
      .catch((error) => {
        console.error("Error processing cover image:", error);
      });

    const generatedBook = {
      title: metadata.title,
      cover: coverBase64 || "https://i.imgur.com/c4VGri2.jpeg",
      author: metadata.creator,
      publisher: "Your Publisher",
      content: [],
    };

    console.log(`Book title: ${generatedBook.title}`);

    const bookExists = await checkAndDownloadBook(
      generatedBook.title,
      setLoadingInfo
    );

    if (bookExists) {
      setIsLoading(false);
      return;
    }

    const chaptersToProcess = [];
    for (let i = 0; i < toc.length; i++) {
      const chapter = toc[i];
      // if (isNonStoryChapter(chapter.label)) continue;
      if (chapter.subitems && chapter.subitems.length > 0) {
        for (const subitem of chapter.subitems) {
          chaptersToProcess.push(subitem);
        }
      } else {
        chaptersToProcess.push(chapter);
      }
    }
    console.log(chaptersToProcess)
    console.log("Starting chapter processing...");
    console.log(chaptersToProcess);
    const processedBook = await processAllChapters(
      chaptersToProcess,
      epubReader,
      generatedBook.title,
      generatedBook.cover,
      setLoadingInfo
    );
    
    console.log("Done processing book... ready for download");
    return processedBook;


  } catch (error) {
    console.error("Error while parsing EPUB:", error);
    setLoadingInfo("Error while parsing EPUB.");
  } finally {
    setIsLoading(false);
    console.log("Done processing book... queuing download");
  }
};

export const fetchUserBooks = async () => {
  try {
    const { data, error } = await supabase
      .from("generated_books")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching user books:", error);
    return [];
  }
};
