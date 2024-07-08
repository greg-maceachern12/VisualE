import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";
import "../styles/FileUpload.scss";

const FileUpload = ({
  handleFileChange,
  fileError,
  handleParseAndGenerateImage,
  epubFile,
  isPremiumUser,
  isLoading,
}) => {
  const [fileName, setFileName] = useState("No file chosen");

  const onFileChange = (event) => {
    if (isPremiumUser) {
      const file = event.target.files[0];
      setFileName(file ? file.name : "No file chosen");
      handleFileChange(event);
    }
  };

  return (
    <div className={`control-container ${!isPremiumUser ? 'disabled' : ''}`}>
      <div className="input-container">
        <div className="file-input-wrapper">
          <label htmlFor="file-upload" className="file-input-label">
            Choose File
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".epub"
            onChange={onFileChange}
            disabled={!isPremiumUser}
          />
          <span className="file-name">{fileName}</span>
        </div>
        {fileError && <p className="error-message">{fileError}</p>}
      </div>
      <div className="button-container">
        <button
          id="parse"
          onClick={handleParseAndGenerateImage}
          disabled={isLoading || !epubFile || !isPremiumUser}
        >
          <FontAwesomeIcon icon={faWandMagicSparkles} />
          {isLoading ? "Processing..." : "Visualize"}
        </button>
      </div>
      {!isPremiumUser && (
        <div className="disabled-overlay">Complete Step 1 to unlock</div>
      )}
    </div>
  );
};

export default FileUpload;