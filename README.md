# Text Correction

Lightweight client-side JavaScript package that adds an AI text correction button (with undo/redo) to textareas and contenteditable elements. It works with any OpenAI-compatible Chat Completions API, e.g. OpenAI or a local Ollama.

## Features

- Correction button (✎) with undo (↶) and redo (↷) on every matching editor, shown while the editor is focused.
- Works with textareas, contenteditable elements, editors added later and same-origin iframes.
- Any OpenAI-compatible Chat Completions API; connection settings are passed in by the host app.
- Plain ES modules, no runtime dependencies, no build step required.

## Installation

The package is not published on npm. Install it from GitHub or from a local folder:

```pwsh
# From GitHub
npm install github:alxy122/text_correction

# From a local checkout
npm install ../path/to/text_correction
```

## Usage

In the browser (through a bundler such as Vite, Webpack or Rollup):

```js
import { provideTextCorrection } from "text-correction";

provideTextCorrection(document, {
    baseUrl: "http://localhost:11434/v1",   // OpenAI-compatible API, e.g. https://api.openai.com/v1
    apiKey: "ollama",                        // optional for local servers like Ollama
    model: "qwen2.5:7b-instruct",
    selector: "textarea, [contenteditable]"  // optional, defaults to DEFAULT_EDITOR_SELECTOR
});
```

Elements with the attribute `no-ai-correction` are skipped by the default selector.

The correction function can also be used on its own, e.g. in Node:

```js
import { getTextCorrection } from "text-correction";

const corrected = await getTextCorrection("Das ist ein Tset.", {
    baseUrl: "https://api.openai.com/v1",
    apiKey: process.env.API_KEY,
    model: "gpt-4o-mini"
});
```

Note: in the browser the API key ends up in the client code and is visible to users. Use a key without sensitive permissions or route requests through your own backend.

### Exports

- `provideTextCorrection(doc, options)` — decorates all matching editors in `doc` (and same-origin iframes) and watches for new ones.
- `getTextCorrection(text, { baseUrl, apiKey, model })` — returns the corrected text or `null`.
- `DEFAULT_EDITOR_SELECTOR` — the default editor selector.

## Project structure

- `text_correction/index.js` — package entry point.
- `text_correction/provide.js` — top-level initializer for a document.
- `text_correction/ai/ai.js` — request to the Chat Completions API.
- `text_correction/ce/text-io.js` — text I/O helpers for contenteditable elements.
- `text_correction/core/` — `decorate.js`, `history.js`, `iframes.js`, `editors-observer.js`.
- `text_correction/dom/` — `icons.js`, `positioning.js`, spinner CSS.
- `test/browser/` — browser demo page, served with Vite.
- `test/node/` — Node project that imports the package like a consumer would.

## Testing locally

Both tests read their settings from `.env` in the project root:

1. Copy `.env.template` to `.env` and set `BASE_URL`, `API_KEY` and `MODEL`.
2. Install dependencies: `npm install`

### Browser demo

```pwsh
npm run dev
```

Open `http://localhost:8080/`, click into one of the editors and use the ✎ button. Vite reads `.env` and injects the values into `test/browser/main.js` as `process.env.*`.

### Node import test

```pwsh
npm run test:node
```

Installs the package into `test/node` via `file:../..`, imports it with `import { getTextCorrection } from "text-correction"` and corrects a sample sentence. Pass your own text with `npm --prefix test/node test -- "Dein Text"`.
