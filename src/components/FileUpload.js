import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";

const FileUpload = ({
  handleFileChange,
  fileError,
  handleParseAndGenerateImage,
  handlePayNow,
  epubFile,
}) => {
  return (
    <div className="control-container">
      <div className="input-container">
        <input type="file" accept=".epub" onChange={handleFileChange} />
        {fileError && <p className="error-message">{fileError}</p>}
      </div>
      {epubFile && (
        <div className="button-container">
          <button
            id="parse"
            className="go-button"
            onClick={handleParseAndGenerateImage}
          >
            <FontAwesomeIcon icon={faWandMagicSparkles} />
            Visualize
          </button>
          {/* <button id="paynow" onClick={handlePayNow} className="go-button">
            <FontAwesomeIcon icon={faWandMagicSparkles} />
            Full Book (Pay Now)
          </button> */}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
