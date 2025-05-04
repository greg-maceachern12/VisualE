# Visuale Codebase Overview

This document provides an overview of the Visuale React application codebase, explaining its structure, key components, and overall data flow.

## Project Structure

The core application code resides within the `src/` directory.

```
src/
├── App.js                  # Main application component (routing, layout, core state)
├── App.test.js             # Basic tests for App component
├── index.js                # Application entry point (renders App)
├── index.css               # Global CSS (minimal)
├── logo.svg                # App logo
├── reportWebVitals.js      # Web performance monitoring setup
├── setupTests.js           # Jest test setup
├── utils.js                # (Seems unused or deprecated)
├── components/             # Reusable UI components
│   ├── About.js
│   ├── AccessCode.js
│   ├── Account.js
│   ├── AuthPage.js
│   ├── FileUpload.js
│   ├── Loading.js
│   ├── Navbar.js
│   ├── PaymentStep.js
│   ├── PaymentSuccess.js
│   └── ... (associated .scss files in src/styles)
├── coreFunctions/          # Core application logic
│   ├── bookLogic.js        # EPUB parsing, chapter processing, image injection logic
│   ├── generation.js       # Handles calls to external AI APIs for text/image generation
│   └── service.js          # Service layer: API interactions, payment, download, analytics
├── gradBG/                 # Gradient background effect
│   ├── gradBG.js
│   └── gradBG.scss
├── output/                 # (Currently empty - likely for build/generated files)
├── pages/                  # (Currently empty - routing handled in App.js)
├── styles/                 # SCSS stylesheets (component-specific and base styles)
│   ├── App.scss
│   ├── Navbar.scss
│   ├── _base.scss
│   ├── _variables.scss
│   └── ... (other component styles)
└── utils/                  # Utility functions and configurations
    ├── apiConfig.js        # Configuration for backend API endpoints
    ├── epubUtils.js        # Helper functions for EPUB processing (e.g., Base64 conversion)
    └── supabaseClient.js   # Supabase client initialization for auth/database
```

## Technology Stack

*   **Frontend Framework**: React
*   **Routing**: React Router (`react-router-dom`)
*   **Styling**: SCSS with Tailwind CSS utility classes
*   **State Management**: React Hooks (`useState`, `useEffect`, `useCallback`)
*   **EPUB Parsing**: EPUB.js
*   **Authentication & DB**: Supabase
*   **Payment**: Stripe
*   **Analytics**: Google Analytics (`react-ga`)
*   **AI Services (Backend - Abstracted)**: Likely OpenAI (for text segmentation/prompting) and Stable Diffusion (for image generation), accessed via API endpoints defined in `apiConfig.js`.

## Application Flow

1.  **Initialization (`index.js`, `App.js`)**: React app is rendered. `App.js` initializes state, sets up routing, and checks the user's authentication status with Supabase. Google Analytics is initialized.
2.  **Authentication (`AuthPage.js`, `Account.js`, `supabaseClient.js`)**: Users can sign up/log in via Supabase. `App.js` listens for auth changes and updates the UI accordingly. User metadata (like premium status) is fetched/updated.
3.  **Access/Payment (`AccessCode.js`, `PaymentStep.js`, `service.js`, `apiConfig.js`)**:
    *   The app might initially require an access code (`isAccessGranted` state).
    *   Non-premium users are shown a payment step (`PaymentStep.js`).
    *   Clicking "Pay Now" triggers `handlePayNow` (`service.js`), which calls the backend `payAPI` to create a Stripe Checkout session.
    *   After successful payment, Stripe redirects back to `/payment-success`. Supabase user metadata is updated to reflect premium status (`isPremiumUser` state in `App.js`).
4.  **EPUB Upload (`FileUpload.js`, `service.js`)**: Premium users can upload an EPUB file. Basic validation ensures it's an EPUB.
5.  **EPUB Processing & Image Generation (`bookLogic.js`, `generation.js`, `service.js`, `apiConfig.js`)**:
    *   The `handleParseAndGenerateImage` function (`service.js`) orchestrates the process.
    *   `parseEpubFile` (`bookLogic.js`) uses EPUB.js to parse the file in the browser, extracting metadata, text content, and structure.
    *   `processAllChapters` (`bookLogic.js`) iterates through the book's chapters.
    *   For each relevant chapter:
        *   `findChapterSegment` (`generation.js`) calls the `OpenAiSegmentAPI` backend endpoint to find a descriptive text segment.
        *   `generatePromptFromSegment` (`generation.js`) calls the `OpenAiChatAPI` backend endpoint to create an image generation prompt from the segment.
        *   `generateImageFromPrompt` (`generation.js`) calls the `SDimageAPI` backend endpoint (likely Stable Diffusion) to generate an image based on the prompt, returning an image URL.
        *   Existing images are removed from the chapter HTML (`removeImages` in `bookLogic.js`).
        *   The new image URL is prepended as an `<img>` tag to the chapter's HTML content (`addChapter` in `bookLogic.js`).
    *   The processed content (chapters with new image tags, metadata) is collected.
6.  **Download (`service.js`, `apiConfig.js`)**:
    *   The user clicks "Download Now".
    *   `handleDownloadBook` (`service.js`) sends the processed book data (title, author, cover, chapter content with image URLs) to the `downloadAPI` backend endpoint.
    *   The backend generates the final EPUB file (presumably combining the content and packaging it), stores it (e.g., cloud storage), and returns a download URL.
    *   The backend also logs the generated book in the Supabase `generated_books` table and resets the user's premium status via Supabase Auth.
    *   The frontend receives the download URL and initiates the file download in the browser.

## Key Components & Modules

*   **`App.js`**: The central hub managing routing, global state (user, loading, file), and coordinating interactions between components and services.
*   **`src/components/`**: Contains all standard UI elements. Each component is generally self-contained and receives data/callbacks via props.
*   **`src/coreFunctions/service.js`**: Acts as a service layer, abstracting away direct API calls, payment logic, download procedures, and analytics integration. It's called by UI components/`App.js` to perform actions.
*   **`src/coreFunctions/bookLogic.js`**: Encapsulates the logic specific to handling EPUB files using EPUB.js, processing chapters, and preparing content for image generation/final output.
*   **`src/coreFunctions/generation.js`**: Responsible *solely* for interacting with the backend AI APIs (segmentation, prompt generation, image generation).
*   **`src/utils/apiConfig.js`**: Centralizes the URLs for all backend API endpoints, making them easy to manage.
*   **`src/utils/supabaseClient.js`**: Configures and exports the Supabase client instance for authentication and database interactions.
*   **`src/styles/`**: Manages the visual appearance using SCSS, often structured per-component.

This overview should provide a solid understanding of how the Visuale application is structured and operates. 