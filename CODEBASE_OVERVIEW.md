# Visuai Codebase Overview

This document provides an architectural overview of the Visuai codebase, explaining how the various components, modules, and serverless functions interconnect to enable the conversion of EPUB chapters into AI-generated images.

---

## Table of Contents

1. [Project Root](#project-root)
2. [Frontend (src)](#frontend-src)
   - [Core Pages](#core-pages)
   - [Components](#components)
   - [Core Functions](#core-functions)
   - [Utilities & Config](#utilities--config)
   - [Styling](#styling)
3. [Serverless Functions (functions)](#serverless-functions-functions)
4. [Build & Deployment](#build--deployment)
5. [Scripts & Dependencies](#scripts--dependencies)
6. [Data Flow & Process](#data-flow--process)

---

## Project Root

```
/ (project root)
├─ assets/         Static assets (images, etc.)
├─ functions/      Netlify serverless functions (Express apps)
├─ public/         CRA public folder (index.html, favicon, etc.)
├─ src/            React application source code
├─ build/          CRA production build output
├─ node_modules/   Installed dependencies
├─ package.json    Project metadata, scripts, dependencies
├─ netlify.toml    Netlify build & deploy configuration
├─ README.md       High-level project description
└─ CODEBASE_OVERVIEW.md (this document)
```

The project is a Create React App (CRA) frontend, with Netlify Functions for backend AI integration.

---

## Frontend (src)

```
/src
├─ components/       Reusable UI components
├─ pages/            Route-level pages (e.g., About)
├─ coreFunctions/    Business logic: EPUB parsing, prompt generation, image creation
├─ utils/            API endpoint configuration
├─ styles/           SCSS styling files
├─ output/           (Optional) local image output storage
├─ App.js            Main app, router, state management
├─ index.js          React entry point
├─ index.css         Global CSS imports
├─ reportWebVitals.js
├─ setupTests.js     Testing setup
└─ utils.js          Misc utilities
```

### Core Pages

- **`src/pages/About.js`**: Static page with information about the app.

### Components

- **`Navbar.js`**: Top navigation bar, handles sample book download.
- **`FileUpload.js`**: File input for EPUB files, error display.
- **`ImageDisplay.js`**: Shows chapter title, generated prompt, image, and navigation controls.
- (Additional UI components in `src/components/` directory.)

### Core Functions (`src/coreFunctions`)

- **`service.js`**: Implements client-side services:
  - `handleFileChange`: Parses EPUB file, builds TOC, extracts cover image.
  - `loadChapter`: Retrieves chapter text, invokes `processChapter`.
  - Google Analytics setup and event logging.
  - `handleDownloadSampleBook`: Downloads a sample EPUB.

- **`bookLogic.js`**: EPUB.js integration:
  - `getChapterPrompt`: Converts a chapter DOM element to plain text.
  - `getNextChapter`: Calculates next chapter/subitem indices from TOC.

- **`generation.js`**: Communicates with AI endpoints:
  - `findChapterPrompt`: Calls segmentation API to extract descriptive text.
  - `generatePromptFromText`: Calls ChatGPT endpoint to build a DALL·E prompt.
  - `generateImageFromPrompt`: Calls image API to generate the final image.
  - `processChapter`: Orchestrates the above calls and updates UI cues.

### Utilities & Config (`src/utils`)

- **`apiConfig.js`**: Defines HTTP endpoints for:
  - `segmentAPI`: Segment extraction service
  - `chatAPI`: Prompt generation service
  - `imageAPI`: Stable-diffusion image service

### Styling (`src/styles`)

- SCSS partials (`_base.scss`, `_variables.scss`) and component-specific styles:
  - `Navbar.scss`, `FileUpload.scss`, `ImageDisplay.scss`, `App.scss`, `AccessCode.scss`
- Uses Tailwind CSS for utility-first styling and dynamic gradients/backgrounds.

---

## Serverless Functions (functions)

These Netlify Functions (Express apps) expose AI-powered endpoints:

```
/functions
├─ server.js         Main Express server handling `/api/chatgpt` and `/api/generateImage`
├─ chatgpt.js        Separate ChatGPT endpoint (unused/legacy?)
└─ generateImage.js  Separate DALL·E endpoint (commented out)
```

- **`server.js`**: Single Express app:
  - `POST /.netlify/functions/server/api/chatgpt`: Sends chapter text to ChatGPT for prompt crafting.
  - `POST /.netlify/functions/server/generateImage`: Sends prompt to DALL·E 3 for image URL.
  - CORS enabled, environment-based API key loading via `dotenv`.
  - Exports `handler` via `serverless-http` for Netlify.

---

## Build & Deployment

- **Netlify**:
  - `netlify.toml`: Build command `npm run build`, functions at `functions/`, publish `build/`.
- **Local Development**:
  - `npm run dev`: Concurrently runs `npm start` (CRA) and `npm run server` (local Express).
- **Production Build**:
  - `npm run build` generates optimized static assets in `/build`.

---

## Scripts & Dependencies

- **Major Dependencies**:
  - React, React Router, Material UI, Emotion, Tailwind CSS
  - `epubjs` for EPUB parsing
  - `openai` SDK for AI API calls
  - `axios` for HTTP requests
  - `serverless-http` for Netlify Functions

- **Scripts** (in `package.json`):
  - `start`, `build`, `test`, `eject` (CRA)
  - `server`: `node server.js` (local Express)
  - `dev`: Run both frontend and backend

---

## Data Flow & Process

1. **User Uploads EPUB**: `FileUpload` triggers `handleFileChange`:
   - Parses file via EPUB.js, extracts TOC and cover image.
2. **User Clicks Generate**: `loadChapter` invoked:
   - Retrieves chapter DOM, extracts raw text (`getChapterPrompt`).
   - `processChapter` in `generation.js`:
     1. Calls `segmentAPI` to find a descriptive segment.
     2. Calls `chatAPI` to build a DALL·E prompt.
     3. Calls `imageAPI` to generate the image URL.
     4. Returns `{ displayPrompt, imageUrl }`.
3. **UI Update**: `ImageDisplay` shows prompt and image, loading spinners, and next/prev controls.
4. **Navigation**: `getNextChapter` computes next chapter indices.

---

For further details on any module or function, please refer to the corresponding source files.

---

*Generated by the development team to assist new contributors in understanding Visuai’s architecture.*