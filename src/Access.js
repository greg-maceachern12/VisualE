import ReactGA from "react-ga";
import React, { useEffect } from "react";
import "./Access.scss";

function Access() {
  useEffect(() => {
    // Track page views
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  return (
    <div className="about-container">
      <form name="waitlist" netlify>
        <label for="email">
          <b>Request Access to the Pro Version</b>
        </label>
        <div class="form-row">
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            required
          />
          <button type="submit">Request</button>
        </div>
      </form>
    </div>
  );
}

export default Access;
