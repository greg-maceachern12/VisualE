import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";
import "../styles/FileUpload.scss";

const FileUpload = ({ handleFileChange, fileError, handleParseAndGenerateImage, epubFile }) => {
  const [fileName, setFileName] = useState("No file chosen");

  const onFileChange = (event) => {
    const file = event.target.files[0];
    setFileName(file ? file.name : "No file chosen");
    handleFileChange(event);
  };

  return (
    <div className="control-container">
      <div className="input-container">
        <div className="file-input-wrapper">
          <label htmlFor="file-upload" className="file-input-label">
            Choose File
          </label>
          <input id="file-upload" type="file" accept=".epub" onChange={onFileChange} />
          <span className="file-name">{fileName}</span>
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