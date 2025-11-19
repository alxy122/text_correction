import { provideTextCorrection } from "./text_correction/provide.js";

// Configurable selector(s) for elements that should get the correction button.
// Edit this constant to control which elements the script decorates.
// Example: only textareas -> "textarea:not([no-ai-correction])"
export const EDITOR_SELECTOR = "textarea:not([no-ai-correction]), [contenteditable]:not([contenteditable='false']):not([no-ai-correction])";

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
    init().then(() => {});
}

async function init() {
    // Pass the selector to the provider so it decorates only the desired elements.
    provideTextCorrection(document, EDITOR_SELECTOR);
}