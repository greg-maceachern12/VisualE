// About.js
import React from "react";
import { Link } from "react-router-dom";

function About() {
  return (
    <div className="about-container">
      <h2>About Visuai</h2>
      <p>
        Visuai is an innovative project that combines the power of AI and ePub reading to generate captivating images based on the content of chapters in ePub books. By leveraging advanced natural language processing and image generation techniques, Visuai brings the stories to life, creating visual representations that enhance the reading experience.
      </p>
      <p>
        With Visuai, users can easily upload their ePub files and watch as the application intelligently analyzes the text, skipping over non-story chapters such as the table of contents and dedications. The AI-powered system then processes the relevant chapters, extracting key information and generating unique image prompts that capture the essence of the story.
      </p>
      <p>
        Users have the flexibility to customize the generated images by selecting from a range of styles, color schemes, and compositions. Whether you prefer oil paintings, hyper-realistic renderings, or watercolor illustrations, Visuai offers a diverse array of options to suit your preferences.
      </p>
      <p>
        Visuai aims to revolutionize the way we engage with ePub books, providing a immersive and visually stimulating experience. By bridging the gap between text and imagery, Visuai opens up new possibilities for readers, writers, and artists alike.
      </p>
      <Link to="/" className="back-button">Back to Home</Link>
    </div>
  );
}

export default About;