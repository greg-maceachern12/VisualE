import React, { useState } from "react";
import { UploadCloud, Book, Wand2 } from "lucide-react";

const FileUpload = ({
  handleFileChange,
  fileError,
  epubFile,
  coverBase64: parentCoverBase64,
  handleParseAndGenerateImage
}) => {
  const [fileName, setFileName] = useState("No file chosen");

  const onFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    }
    handleFileChange(event);
  };

  if (!epubFile) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4">
        <div className="mt-8 p-8 border-2 border-dashed border-gray-300 rounded-xl bg-white/50 backdrop-blur-sm hover:border-indigo-500 transition-colors">
          <div className="flex flex-col items-center justify-center space-y-4">
            <UploadCloud className="w-12 h-12 text-gray-400" />
            <p className="text-lg text-gray-600">
              Upload an EPUB file to get started
            </p>

            <div className="w-full max-w-sm">
              <label
                htmlFor="file-upload"
                className="w-full flex justify-center py-2.5 px-4 text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer transition-colors"
              >
                Select EPUB
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".epub"
                onChange={onFileChange}
                className="hidden"
              />
            </div>

            {fileError && <p className="text-sm text-red-600">{fileError}</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Book Preview Section - Clickable to change file */}
        <label
          htmlFor="file-upload-change"
          className="block p-6 cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              <div className="w-20 h-28 bg-gray-100 rounded-lg shadow overflow-hidden">
                {parentCoverBase64 ? (
                  <img
                    src={parentCoverBase64}
                    alt="Book cover"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <Book className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {fileName.replace(".epub", "")}
              </h3>
              <p className="mt-1 text-sm text-gray-500">Click to change book</p>
            </div>
          </div>
        </label>
        <input
          id="file-upload-change"
          type="file"
          accept=".epub"
          onChange={onFileChange}
          className="hidden"
        />

        {/* Chapter Selection and Generate Button */}
        <div className="border-t border-gray-100 p-6 space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="chapterDropdown"
              className="block text-sm font-medium text-gray-700"
            >
              Choose a chapter to illustrate
            </label>
            <select
              id="chapterDropdown"
              className="block w-full rounded-lg border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm bg-white"
            />
          </div>

          <button
            onClick={handleParseAndGenerateImage}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
          >
            <Wand2 className="w-4 h-4" />
            <span>Generate Image</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;