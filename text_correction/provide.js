/**
 * @module text_correction
 */

/**
 * @file Top-level initializer for a document: inject CSS, decorate editors,
 * observe editors/iframes, and prevent double-init.
 */

import {handleNewEditors, observeNewEditors} from "./core/editors-observer.js";
import {observeIframes, scanIframes} from "./core/iframes.js";
import {ensureSpinnerCSS} from "./dom/spinner-css.js";

/** @constant {string} - Key to mark a document as initialized. */
const DOC_INIT_KEY = "__text_corr_init__";
/** @constant {string} - Key to mark a document as having started processing. */
const DOC_STARTED_KEY = "__text_corr_started__";

/** @constant {string} - Default selector for editor elements that get the correction button. */
export const DEFAULT_EDITOR_SELECTOR =
    "textarea:not([no-ai-correction]), [contenteditable]:not([contenteditable='false']):not([no-ai-correction])";

/**
 * @typedef {Object} TextCorrectionOptions
 * @property {string} baseUrl - Base URL of an OpenAI-compatible API, e.g. "https://api.openai.com/v1".
 * @property {string} [apiKey] - API key, sent as Bearer token. Optional for local servers like Ollama.
 * @property {string} model - Model name, e.g. "gpt-4o-mini" or "qwen2.5:7b-instruct".
 * @property {string} [selector=DEFAULT_EDITOR_SELECTOR] - Selector for editor elements to decorate.
 */

/**
 * Provides text correction UI for a given document.
 * Idempotent per document.
 * @function
 * @param {Document} doc - The document to enhance.
 * @param {TextCorrectionOptions} options - API connection settings and editor selector.
 */
export function provideTextCorrection(doc, options) {
    const { baseUrl, apiKey, model, selector = DEFAULT_EDITOR_SELECTOR } = options || {};
    if (!baseUrl) throw new Error("provideTextCorrection: option 'baseUrl' is required");
    if (!model) throw new Error("provideTextCorrection: option 'model' is required");
    const aiConfig = { baseUrl, apiKey, model };

    if (doc[DOC_STARTED_KEY]) return;
    doc[DOC_STARTED_KEY] = true;

    // One-time per doc
    if (!doc[DOC_INIT_KEY]) {
        doc[DOC_INIT_KEY] = true;
        ensureSpinnerCSS(doc);
    }

    // Per-document processed set to avoid double decoration
    const processed = new doc.defaultView.WeakSet();

    // Decorate existing editors
    handleNewEditors(doc.querySelectorAll(selector), doc, processed, aiConfig);

    // Observe future editors
    observeNewEditors(doc, processed, selector, aiConfig);

    // Same-origin iframes
    const provideInIframe = (idoc) => {
        try { provideTextCorrection(idoc, options); } catch { /* ignore */ }
    };
    scanIframes(doc, provideInIframe);
    observeIframes(doc, provideInIframe);
}
