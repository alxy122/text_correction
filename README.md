# Text Correction

This project is a lightweight client-side JavaScript text correction/demo toolkit. It contains a small demo (`index.html`) and a set of modular JavaScript components under the `text_correction/`, `core/`, and `dom/` folders that provide text input handling, editing helpers, and an AI integration placeholder.

## Features

- Demo UI: open `index.html` to try the interactive demo.
- Modular code: functionality is split into small files under `text_correction/`, `core/`, and `dom/` so you can reuse parts independently.
- Simple AI integration hook: the `text_correction/ai/` directory contains the AI-related module(s) used by the demo.

## Files of interest

- `index.html` — demo page and entry point for manual testing.
- `main.js` — bootstraps the demo UI.
- `text_correction/provide.js` — top-level project provider wiring (integration entry point).
- `text_correction/ai/ai.js` — AI-related logic used by the demo.
- `text_correction/ce/text-io.js` — text I/O helpers for the contenteditable editor.
- `text_correction/core/` — core helpers: `decorate.js`, `history.js`, `iframes.js`, `editors-observer.js`.
- `dom/` — DOM utilities such as `icons.js`, `positioning.js`, and spinner CSS helpers.

If you plan to embed functionality into another project, inspect `main.js` and `text_correction/provide.js` to see how modules are wired together.

## How to test locally

Some browsers restrict module and file access when opening `index.html` directly from disk. Use a simple local HTTP server to run the demo. From PowerShell you can run either:

```pwsh
# Using Python 3 (if installed)
py -3 -m http.server 8080

# Or if Python maps to `python` on your PATH
python -m http.server 8080

# Or using Node (no global install required if you have npm):
npx http-server -p 8080
```

Then open your browser to: `http://localhost:8080/index.html`.

Testing steps:

1. Open the demo page in your browser.
2. Enter or paste some sample text into the editor area.
3. Use the UI controls (e.g., a "correct" or similar button in the demo) to request correction/suggestions.
4. Observe visual suggestions, replacements, or highlights in the editor and view the browser console for logs.

## Integration into other systems

The codebase is modular and intended to be embedded in other front-end systems (single-page apps, CMS plugins, browser extensions, etc.). General guidance:

- Copy the `text_correction/` folder (and any required `core/` or `dom/` helpers) into your target project.
- Include or import the required script files from your HTML or bundler. The demo uses `main.js` as the entry — adapt that wiring to your host app.
- If you use a bundler (Webpack, Vite, Rollup), treat the modules as local source files and import them into your bundle.
- Ensure the host application provides any runtime dependencies the modules expect (DOM containers, event hooks, or any backend endpoints if you connect a remote AI service).

Because the project intentionally keeps logic modular, you can migrate only the parts you need (for example, just the text I/O and editor helpers) and integrate them with your own UI.

