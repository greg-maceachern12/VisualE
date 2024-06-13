import React, { useState } from "react";
import "./AccessCode.scss";

function AccessCode({ onAccessGranted }) {
  const [accessCode, setAccessCode] = useState("");

  const handleAccessCodeChange = (e) => {
    setAccessCode(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (accessCode === "fullbook") {
      onAccessGranted();
    } else {
      alert("Invalid access code. Please try again.");
    }
  };

  return (
    <div className="access-code-container">
      <h1>Enter Password</h1>
      <form onSubmit={handleSubmit}>
        <input
          value={accessCode}
          onChange={handleAccessCodeChange}
          placeholder="password"
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default AccessCode;