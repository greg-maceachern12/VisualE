import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/App.scss";
import "./gradBG/gradBG.scss";
import AccessCode from "./components/AccessCode.js";
import About from "./components/About.js";
import AuthPage from "./components/AuthPage.js";
import Account from "./components/Account.js";
import Navbar from "./components/Navbar.js";
import FileUpload from "./components/FileUpload.js";
import Loading from "./components/Loading.js";
import PaymentSuccess from "./components/PaymentSuccess";
import { initGradientBackground } from "./gradBG/gradBG.js";
import { supabase } from "./utils/supabaseClient.js";
import {
  initializeGoogleAnalytics,
  logPageView,
  handleDownloadSampleBook,
  handleFileChange,
  handleParseAndGenerateImage,
  handlePayNow,
} from "./coreFunctions/service";

function App() {
  const [epubFile, setEpubFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [isAccessGranted, setIsAccessGranted] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingInfo, setLoadingInfo] = useState("");
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPremiumUser, setIsPremiumUser] = useState(false);

  useEffect(() => {
    checkUser();
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user;
        setUser(currentUser ?? null);
        if (currentUser) checkUserStatus(currentUser);
      }
    );
    initializeGoogleAnalytics();
    logPageView();
    const cleanupGradientBackground = initGradientBackground();

    return () => {
      if (authListener?.subscription) authListener.subscription.unsubscribe();
      cleanupGradientBackground();
    };
  }, []);

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
    if (user) checkUserStatus(user);
  };

  const checkUserStatus = (user) => {
    setIsPremiumUser(user.user_metadata.is_premium || false);
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsDropdownOpen(false);
  };

  const handleAccessGranted = () => setIsAccessGranted(true);

  const handleFileChangeWrapper = (event) => {
    handleFileChange(event.target.files[0], setEpubFile, setFileError);
  };

  const handleParseAndGenerateImageWrapper = () => {
    handleParseAndGenerateImage(epubFile, setIsLoading, setLoadingInfo);
  };

  const handlePayNowWrapper = () => {
    if (user) {
      handlePayNow(user.id);
    } else {
      console.error("User not logged in");

    }
  };

  return (
    <Router>
      <div className="App">
        <Navbar
          user={user}
          isDropdownOpen={isDropdownOpen}
          toggleDropdown={toggleDropdown}
          handleSignOut={handleSignOut}
          handleDownloadSampleBook={handleDownloadSampleBook}
        />
        <div className="gradient-bg">
          <svg xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="goo">
                <feGaussianBlur
                  in="SourceGraphic"
                  stdDeviation="10"
                  result="blur"
                />
                <feColorMatrix
                  in="blur"
                  mode="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
                  result="goo"
                />
                <feBlend in="SourceGraphic" in2="goo" />
              </filter>
            </defs>
          </svg>
          <div className="gradients-container">
            <div className="g1"></div>
            <div className="g2"></div>
            <div className="g3"></div>
            <div className="g4"></div>
            <div className="g5"></div>
            <div className="interactive"></div>
          </div>
        </div>
        <div className="content-container">
          <Routes>
            <Route path="/about" element={<About />} />
            <Route
              path="/"
              element={
                <>
                  <div className="home-content"></div>
                  <div className="header-container">
                    <h1>Turn Words in Worlds</h1>
                    <h4>
                      Add illustations to your full ePub - Free for a limited
                      time
                    </h4>
                    {isAccessGranted ? (
                      <div id="headings">
                        {isPremiumUser && (
                          <i>
                            You have access to one book generation. This access
                            will be used up after you generate and download a
                            book.
                          </i>
                        )}
                        <FileUpload
                          handleFileChange={handleFileChangeWrapper}
                          fileError={fileError}
                          handleParseAndGenerateImage={
                            handleParseAndGenerateImageWrapper
                          }
                          handlePayNow={handlePayNowWrapper}
                          isPremiumUser={isPremiumUser}
                          epubFile={epubFile}
                        />
                      </div>
                    ) : (
                      <AccessCode onAccessGranted={handleAccessGranted} />
                    )}
                    <Loading isLoading={isLoading} loadingInfo={loadingInfo} />
                  </div>
                  <div id="hiddenDiv"></div>
                </>
              }
            />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/account" element={<Account />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
