import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AccessCode from "./components/AccessCode.js";
import About from "./components/About.js";
import AuthPage from "./components/AuthPage.js";
import Account from "./components/Account.js";
import Navbar from "./components/Navbar.js";
import PaymentStep from "./components/PaymentStep.js";
import FileUpload from "./components/FileUpload.js";
import Loading from "./components/Loading.js";
import PaymentSuccess from "./components/PaymentSuccess";
import { supabase } from "./utils/supabaseClient.js";
import {
  initializeGoogleAnalytics,
  logPageView,
  handleDownloadSampleBook,
  handleFileChange,
  handleParseAndGenerateImage,
  handlePayNow,
  handleDownloadBook,
} from "./coreFunctions/service";

function App() {
  const [epubFile, setEpubFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [isAccessGranted, setIsAccessGranted] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingInfo, setLoadingInfo] = useState("");
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPremiumUser, setIsPremiumUser] = useState(true);
  const [generatedBook, setGeneratedBook] = useState(null);

  const checkUserStatus = useCallback((user) => {
    setIsPremiumUser(user.user_metadata.is_premium || false);
  }, []);

  const checkUser = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
    if (user) checkUserStatus(user);
  }, [checkUserStatus]);

  useEffect(() => {
    checkUser();
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user;
        console.log(currentUser);
        setUser(currentUser ?? null);
        if (currentUser) checkUserStatus(currentUser);
      }
    );
    initializeGoogleAnalytics();
    logPageView();

    return () => {
      if (authListener?.subscription) authListener.subscription.unsubscribe();
    };
  }, [checkUser, checkUserStatus]);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsDropdownOpen(false);
  };

  const handleAccessGranted = () => setIsAccessGranted(true);

  const handleFileChangeWrapper = (event) => {
    handleFileChange(event.target.files[0], setEpubFile, setFileError);
  };

  const handleParseAndGenerateImageWrapper = async () => {
    setIsLoading(true);
    const result = await handleParseAndGenerateImage(
      epubFile,
      setIsLoading,
      setLoadingInfo
    );
    if (result) {
      setGeneratedBook(result);
    }
    setIsLoading(false);
  };

  const handlePayNowWrapper = () => {
    if (user) {
      handlePayNow(user.id);
    } else {
      console.error("User not logged in");
      setFileError("Please log in to proceed.");
    }
  };

  const handleDownloadNow = async () => {
    if (generatedBook) {
      setIsLoading(true);
      await handleDownloadBook(generatedBook, setLoadingInfo);
      setIsLoading(false);
      setGeneratedBook(null);
    }
  };

  return (
    <Router>
      <div className="min-h-screen relative overflow-hidden bg-[#0A0C14]">
        {/* Animated background gradients */}
        <div className="absolute inset-0">
          <div 
            className="absolute top-[-10%] left-[-20%] w-3/4 h-3/4 rounded-full bg-gradient-to-r from-blue-900/20 to-indigo-900/20 blur-3xl animate-pulse" 
            style={{ animationDuration: '8s' }}
          />
          <div 
            className="absolute bottom-[-20%] right-[-10%] w-3/4 h-3/4 rounded-full bg-gradient-to-l from-teal-900/20 to-cyan-900/20 blur-3xl animate-pulse" 
            style={{ animationDuration: '10s' }}
          />
          <div 
            className="absolute top-[30%] right-[-20%] w-2/3 h-2/3 rounded-full bg-gradient-to-l from-slate-900/20 to-zinc-900/20 blur-3xl animate-pulse" 
            style={{ animationDuration: '12s' }}
          />
        </div>

        {/* Content container with glass effect */}
        <div className="relative min-h-screen backdrop-blur-xl bg-[#0A0C14]/50">
          <Navbar
            user={user}
            isDropdownOpen={isDropdownOpen}
            toggleDropdown={toggleDropdown}
            handleSignOut={handleSignOut}
            handleDownloadSampleBook={handleDownloadSampleBook}
          />

          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/about" element={<About />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/account" element={<Account />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route
                path="/"
                element={
                  <div className="max-w-4xl mx-auto space-y-8">
                    <div className="text-center space-y-6">
                      <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                        Turn Words Into Worlds
                      </h1>
                      <p className="text-xl text-slate-300">
                        Add illustrations directly to your ebook - free for a limited time.
                      </p>
                    </div>

                    {isAccessGranted ? (
                      <div className="space-y-8">
                        {!isPremiumUser ? (
                          <PaymentStep
                            handlePayNow={handlePayNowWrapper}
                            fileError={fileError}
                            isPremiumUser={isPremiumUser}
                          />
                        ) : (
                          <FileUpload
                            handleFileChange={handleFileChangeWrapper}
                            fileError={fileError}
                            handleParseAndGenerateImage={handleParseAndGenerateImageWrapper}
                            isPremiumUser={isPremiumUser}
                            epubFile={epubFile}
                            isLoading={isLoading}
                          />
                        )}
                      </div>
                    ) : (
                      <AccessCode onAccessGranted={handleAccessGranted} />
                    )}

                    {generatedBook && !isLoading && (
                      <button
                        onClick={handleDownloadNow}
                        className="w-full py-3 px-6 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg"
                      >
                        Download Now
                      </button>
                    )}

                    <Loading isLoading={isLoading} loadingInfo={loadingInfo} />

                    <div className="text-center pt-8">
                      <a
                        href="https://buymeacoffee.com/gregmac"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-6 py-3 text-sm font-medium text-slate-300 bg-slate-800/50 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors shadow-lg space-x-2 backdrop-blur-sm"
                      >
                        <span>☕</span>
                        <span>Buy me a coffee</span>
                      </a>
                    </div>
                  </div>
                }
              />
            </Routes>
          </main>

          {/* Hidden div for EPUB.js */}
          <div
            id="hiddenDiv"
            style={{
              position: "absolute",
              visibility: "hidden",
              overflow: "hidden",
              height: 0,
            }}
          />
        </div>
      </div>
    </Router>
  );
}

export default App;