import React, { useEffect } from "react";
import ReactGA from "react-ga";
import { Link } from "react-router-dom";
import { Github, ExternalLink, ArrowLeft } from 'lucide-react';

function About() {
  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            About Visuai
          </h1>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800/50 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors shadow-lg backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to App
          </Link>
        </div>

        {/* Main Content */}
        <div className="prose prose-invert prose-slate max-w-none">
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-8 border border-slate-700/50 space-y-6">
            <p className="text-slate-300">
              Welcome to Visuai - a project inspired by the rich visual
              descriptions found in recent fictional books I've been reading, from
              the likes of the Dune series, the Way of Kings and Eragon.
            </p>

            <p className="italic text-slate-400">
              While reading these books, I found that authors significantly invest in crafting rich
              visual details for many of their environments, characters, scenes etc. My brain struggled to fully
              comprehend and visualize this. I often found myself searching Google for fan renditions of
              the characters to aid my imagination rather than lean on the descriptions provided by the author.
            </p>

            <p className="text-slate-300">
              See the{" "}
              <a 
                href="https://landvisuai.netlify.app/" 
                target="_blank" 
                rel="noreferrer"
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                landing page
              </a>{" "}
              for examples of such scenes.
            </p>

            <p className="text-slate-300">
              It became apparent that the authors were essentially providing
              well-written prompts to generate this content, encompassing scenes,
              characters, environments, and more, for the reader. What was missing was
              an interface to connect these elements together.
            </p>

            <p className="text-slate-300">
              I would love to ship this as a Kindle/iBooks extension, directly
              integrated into the reading experience, automatically generating visuals for the
              user or based on highlighted content. Until Amazon or Apple opens up an
              extensions marketplace, Visuai will operate as a self-serve platform.
            </p>

            <p className="text-slate-300">
              For now, users can browse chapter by chapter and/or select a specific
              chapter to explore a visual representation of that
              portion of the book. In the{" "}
              <a 
                href="https://pro.visuai.io" 
                target="_blank" 
                rel="noreferrer"
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                pro version
              </a>
              , you can upload a whole epub and Visuai will generate visuals for the entire book,
              adding them to the beginning of each chapter.
            </p>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-slate-200">Planned Improvements</h2>
              <ul className="list-disc pl-6 space-y-2 text-slate-300">
                <li>
                  Migrate to Midjourney for consistent characters in the generation
                  (massively important!) once the API is opened up.
                </li>
                <li>Utilization of control nets for enhanced image generation</li>
                <li>Implementation of a subscription model and/or payment schema</li>
              </ul>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <p className="text-red-400 font-medium">
                Please don't go crazy on the generations... this eats up my OpenAI/SD credits
              </p>
            </div>
          </div>

          {/* Footer Links */}
          <div className="flex flex-wrap gap-4 mt-8">
            <a
              href="https://github.com/greg-maceachern12/VisualE"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800/50 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors shadow-lg backdrop-blur-sm"
            >
              <Github className="w-4 h-4 mr-2" />
              Github
            </a>
            <a
              href="https://landvisuai.netlify.app/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800/50 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors shadow-lg backdrop-blur-sm"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Landing Page
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;