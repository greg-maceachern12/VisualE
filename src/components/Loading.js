import React from 'react';
import { mirage } from "ldrs";

mirage.register();

const Loading = ({ isLoading, loadingInfo }) => {
  if (!isLoading) return null;

  return (
    <div className="loading-container">
      <l-mirage size="111" speed="2.9" color="#CDB8FF"></l-mirage>
      <p>{loadingInfo}</p>
    </div>
  );
};

export default Loading;