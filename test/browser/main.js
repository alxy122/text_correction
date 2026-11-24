import { provideTextCorrection } from "text-correction";

// Selector for elements that should get the correction button.
// Example: only textareas -> "textarea:not([no-ai-correction])"
const EDITOR_SELECTOR = "textarea:not([no-ai-correction]), [contenteditable]:not([contenteditable='false']):not([no-ai-correction])";

function init() {
    provideTextCorrection(document, {
        // Injected from .env by vite.config.js
        baseUrl: process.env.BASE_URL,
        apiKey: process.env.API_KEY,
        model: process.env.MODEL,
        selector: EDITOR_SELECTOR
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
    init();
}
