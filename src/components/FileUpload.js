import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";

const FileUpload = ({ handleFileChange, fileError, handleParseAndGenerateImage, epubFile }) => {
  return (
    <div className="control-container">
      <div className="input-container">
        <div className="file-input-wrapper">
          <input type="file" accept=".epub" onChange={handleFileChange} />
        </div>
        {fileError && <p className="error-message">{fileError}</p>}
      </div>
      {epubFile && (
        <div className="button-container">
          <select id="chapterDropdown"></select>
          <button id="parse" onClick={handleParseAndGenerateImage}>
            <FontAwesomeIcon icon={faWandMagicSparkles} />
            Visualize
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;