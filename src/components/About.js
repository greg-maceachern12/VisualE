// About.js
import React, { useEffect } from "react";
import ReactGA from "react-ga";
import { Link } from "react-router-dom";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../styles/About.scss";

function About() {
  useEffect(() => {
    // Track page views
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  return (
    <div className="about-container">
      <h2>About Visuai</h2>
      <Link to="/" className="link-button">
          Back to App
        </Link>
      <p className="aboutText">
        Welcome to Visuai - a project inspired by the rich visual
        descriptions found in recent fictional books I've been reading, from
        the likes of the Dune series, the Way of Kings and Eragon.
        <br></br><br></br>
        <i>
          While reading these books, I found that that authors significantly invest in crafting rich
          visual details for many of their environments, characters, scenes etc. My brain struggled to fully
          comprehend and visualize this. I often found myself searching Google for fan renditions of
          the characters to aid my imagination rather than lean on the descriptions provided by the author.
        </i>
        <br></br>
         See the <a href="https://landvisuai.netlify.app/" target="_blank" rel="noreferrer">landing page</a> for
        examples of such scenes.
        <br></br><br></br>
        It became apparent that the authors were essentially providing
        well-written prompts to generate this content, encompassing scenes,
        characters, environments, and more, for the reader. What was missing was
        an interface to connect these elements together.
        <br></br>
        <br></br>
        <br></br>
        I would love to ship this as a Kindle/iBooks extension, directly
        integrated into the reading experience, automatically generating visuals for the
        user or based on highlighted content. Until Amazon or Apple opens up an
        extensions marketplace, Visuai will operate as a self-serve platform.
        <br></br><br></br>
        For now, users can browse chapter by chapter and/or select a specific
        chapter to explore a visual representation of that
        portion of the book. In the <a href='pro.visuai.app' target="_blank" rel="noreferrer">pro version</a>, you can upload a whole epub and Visuai will generate visuals for the entire book,
        adding them to the beginning of each chapter.
        <br></br><br></br>
        There are numerous improvements planned for Visuai, including:
        <ol>
          <li>
            Migrate to Midjourney for consistent characters in the generation
            (massively important!) once the API is opened up.
          </li>
          <li>Utilization of control nets for enhanced image generation</li>
          <li>Implementation of a subscription model and/or payment schema</li>
        </ol>
        Until then, please enjoy!<br></br>
        If you're reading this{" "}
        <b>
          please don't go crazy on the generations.. this eats up my OpenAI/SD
          credits
        </b>
        <br></br>
        <br></br>
        <Link to="/" className="link-button">
          Back to App
        </Link>
      </p>
      <br></br>
      <br></br>
      <a
        href="https://github.com/greg-maceachern12/VisualE"
        className="link-button"
      >
        <FontAwesomeIcon icon={faGithub} />
        Github
      </a>
      <br />
      <a href="https://landvisuai.netlify.app/" className="link-button">
        <FontAwesomeIcon icon={faExternalLinkAlt} />
        Landing Page
      </a>
    </div>
  );
}

export default About;
