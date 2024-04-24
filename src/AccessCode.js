import React, { useState } from "react";
import "./AccessCode.scss";

function AccessCode({ onAccessGranted }) {
  const [accessCode, setAccessCode] = useState("");

  const handleAccessCodeChange = (e) => {
    setAccessCode(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (accessCode === "illustration") {
      onAccessGranted();
    } else {
      alert("Invalid access code. Please try again.");
    }
  };

  return (
    <div className="access-code-container">
      <h1>Enter Access Code</h1>
      <h3>These API call's ain't free :(</h3>
      <form onSubmit={handleSubmit}>
        <input
          value={accessCode}
          onChange={handleAccessCodeChange}
          placeholder="Access Code"
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default AccessCode;