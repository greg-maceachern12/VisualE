// About.js
import React from "react";
import { Link } from "react-router-dom";

function About() {
  return (
    <div className="about-container">
      <h2>About Visuai</h2>
      <p className="aboutText">
        Welcome to Visuai - a project inspired by the captivating visual
        descriptions found in recent fiction books I've been immersed in, from
        the likes of Dune, the Way of Kings and Eragon (again).
        <br></br>
        <i>
          I discovered that authors invest significant effort in crafting rich
          visual details for many scenes, and my mind struggled to fully
          visualize them. See the landing page for examples.
        </i>{" "}
        I often found myself searching online for fan renditions of the
        characters to aid my imagination.
        <br></br>
        It became apparent that the authors were essentially providing
        well-written prompts to generate this content, encompassing scenes,
        characters, environments, and more, for the reader. What was missing was
        an interface to seamlessly connect these elements together.
        <br></br>
        <br></br>
        Thus, Visuai was born!
        <br></br>
        <br></br>
        IMO, the ideal user experience would be a Kindle extension
        directly integrated into the product, automatically generating visuals for
        the user or based on highlighted content. Until Amazon opens up Kindle
        extensions, Visuai will operate as a self-serve platform.
        <br></br>
        The longer-term vision for this app is to enable users to:
        <ol>
          <li>Upload their epub files</li>
          <li>Have the app generate and cache images for each chapter</li>
          <li>Integrate the images inline with the text</li>
        </ol>
        For now, users can browse chapter by chapter and/or select a specific
        chapter <i>(coming soon)</i> to explore a visual representation of that
        portion of the book.
        <br></br>
        There are numerous improvements planned for Visuai, including:
        <ol>
          <li>Utilization of control nets for enhanced image generation</li>
          <li>Caching of AI-generated images for future use</li>
          <li>Implementation of a subscription model and/or payment schema</li>
          <li>Move to Groq for faster inference on parts of the generation.</li>
        </ol>
        Until then, please enjoy!<br></br>
        If you're reading this <b>please don't go crazy on the generations.. this eats up my OpenAI credit :(</b>
      </p>
      <Link to="/" className="back-button">
        Back to App
      </Link>
      <br></br>
      <br></br>
      <a href="https://github.com/greg-maceachern12/VisualE">Github</a>
      <br></br>
      <a href="https://landvisuai.netlify.app/">Landing Page</a>
    </div>
  );
}

export default About;
