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

/**
 * Provides text correction UI for a given document.
 * Idempotent per document.
 * @function
 * @param {Document} [doc=document] - The document to enhance. Defaults to the global document.
 * @param {string} editorSelector - Selector for editor elements to decorate.
 */
/** Default selector for editor elements. Can be overridden by caller. */
export function provideTextCorrection(doc = document, editorSelector) {
    if (doc[DOC_STARTED_KEY]) return;
    doc[DOC_STARTED_KEY] = true;

    // One-time per doc
    if (!doc[DOC_INIT_KEY]) {
        doc[DOC_INIT_KEY] = true;
        ensureSpinnerCSS(doc);
    }

    // Per-document processed set to avoid double decoration
    const processed = new doc.defaultView.WeakSet();

    // Decorate existing editors (use provided selector)
    handleNewEditors(
        doc.querySelectorAll(editorSelector),
        doc,
        processed
    );

    // Observe future editors (pass selector through)
    observeNewEditors(doc, processed, editorSelector);

    // Same-origin iframes
    const provideInIframe = (idoc) => {
        try { provideTextCorrection(idoc, editorSelector); } catch { /* ignore */ }
    };
    scanIframes(doc, provideInIframe);
    observeIframes(doc, provideInIframe);
}
