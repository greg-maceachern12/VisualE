import React, { useState } from "react";
import { UploadCloud, Wand2 } from "lucide-react";

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

  const containerClasses = `relative p-8 rounded-xl ${
    isPremiumUser 
      ? 'bg-slate-800/30 backdrop-blur-sm border border-slate-700/50' 
      : 'bg-slate-800/20 backdrop-blur-sm border border-slate-700/50 opacity-50'
  }`;

  return (
    <div className={containerClasses}>
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="relative group">
            <label
              htmlFor="file-upload"
              className="block w-full p-6 rounded-lg border-2 border-dashed border-slate-600 hover:border-cyan-500/50 transition-colors cursor-pointer"
            >
              <div className="flex flex-col items-center space-y-3">
                <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                <span className="text-sm text-slate-300">
                  {fileName === "No file chosen" 
                    ? "Choose EPUB file or drag and drop" 
                    : fileName}
                </span>
              </div>
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".epub"
              onChange={onFileChange}
              disabled={!isPremiumUser}
              className="hidden"
            />
          </div>
          {fileError && (
            <p className="text-red-400 text-sm">{fileError}</p>
          )}
        </div>

        <button
          onClick={handleParseAndGenerateImage}
          disabled={isLoading || !epubFile || !isPremiumUser}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-900/20"
        >
          <Wand2 className="w-5 h-5" />
          <span>{isLoading ? "Processing..." : "Visualize"}</span>
        </button>
      </div>

      {!isPremiumUser && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm rounded-xl">
          <p className="text-slate-300 font-medium">Complete Step 1 to unlock</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;