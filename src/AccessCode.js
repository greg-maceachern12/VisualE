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
      <a
              className="nav-link"
              href={`mailto:greg@visuai.io?subject=Access%20Code%20For%20Pro&body=%20Please%20grant%20me%20access%20to%20Visuai%20Pro`}
            >No Code? Request Access</a>
      {/* <Link to="/access" className="nav-link access">
              Or Request Access
      </Link> */}

    </div>
  );
}

export default AccessCode;