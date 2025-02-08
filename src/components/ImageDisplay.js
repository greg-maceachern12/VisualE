import React from "react";
import AudioPlayer from "./AudioPlayer";

const ImageDisplay = ({
  chapterTitle,
  isLoading,
  imageUrl,
  displayPrompt,
  handleNextChapter,
  audioURL,
  error,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {chapterTitle && (
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {chapterTitle}
        </h2>
      )}
      
      <AudioPlayer className="px-4" audioURL={audioURL} isLoading={isLoading} />

      <div className="relative min-h-[400px] bg-white/50 backdrop-blur-sm rounded-lg shadow-sm">
        {error ? (
          <div className="p-8 flex flex-col items-center gap-4">
            <p className="text-red-600">Error: {error}</p>
            <button
              onClick={handleNextChapter}
              className="py-2 px-4 text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Try Next Chapter
            </button>
          </div>
        ) : !isLoading ? (
          <div className="relative">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Generated from chapter"
                className="w-full h-auto rounded-lg"
              />
            ) : (
              <div className="p-8 text-center text-gray-500">
                No content selected
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-pulse space-y-4">
              <div className="h-48 w-96 bg-gray-200 rounded"></div>
              <div className="space-y-2">
                <div className="h-4 w-48 bg-gray-200 rounded"></div>
                <div className="h-4 w-64 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        )}

        {displayPrompt && !isLoading && !error && (
          <div className="p-4 text-center">
            <p className="italic text-gray-600">{displayPrompt}</p>
            {displayPrompt !== "No content selected" && (
              <button
                className="mt-4 py-2.5 px-4 text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
                onClick={handleNextChapter}
              >
                Next Chapter
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageDisplay;