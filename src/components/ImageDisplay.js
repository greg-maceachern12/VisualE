import React from 'react';
import { Skeleton } from "@mui/material";

const ImageDisplay = ({ chapterTitle, isLoading, imageUrl, displayPrompt, handleNextChapter }) => {
  return (
    <div className="chapterContainer">
      <h2>{chapterTitle}</h2>
      <div className="container">
        {!isLoading ? (
          <>
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Generated from chapter"
                className="generatedImage"
              />
            )}
            <div className="chapterPrompt">
              <p><i>{displayPrompt}</i></p>
              <button id="nextbtn" onClick={handleNextChapter}>
                Next Chapter
              </button>
            </div>
          </>
        ) : (
          <div className="loadingContainer">
            <div className="skeletonWrapper">
              <Skeleton variant="rounded" width={400} height={300} animation="wave" />
              <div className="textSkeletons">
                <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                <Skeleton variant="text" sx={{ fontSize: "1rem" }} animation="wave" />
                <Skeleton variant="text" sx={{ fontSize: "1rem" }} animation="wave" />
                <Skeleton variant="text" sx={{ fontSize: "1rem" }} animation="wave" />
                <Skeleton variant="text" sx={{ fontSize: "1rem" }} animation={false} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageDisplay;