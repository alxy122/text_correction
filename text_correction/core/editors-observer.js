/**
 * @module text_correction/core
 */

/**
 * @file Editor discovery and decoration for existing and newly added editors.
 */

import {decorateEditable} from "./decorate.js";

/**
 * Decorates each node in a NodeList as an editable, if applicable.
 * @param {Iterable<Element>} nodeList - NodeList or array of elements to process.
 * @param {Document} doc - The document owning the elements.
 * @param {WeakSet<Element>} processed - Per-document set to avoid double decoration.
 * @param {Object} aiConfig - API connection settings.
 */
export function handleNewEditors(nodeList, doc, processed, aiConfig) {
    nodeList.forEach((el) => decorateEditable(el, doc, processed, aiConfig));
}

/**
 * Observes the document for newly added editors (textarea/contenteditable).
 * Returns the MutationObserver instance.
 * @param {Document} doc - The document to observe.
 * @param {WeakSet<Element>} processed - Per-document set to avoid double decoration.
 * @param {string} editorSelector - Selector for editor elements to decorate.
 * @param {Object} aiConfig - API connection settings.
 * @returns {MutationObserver} - The created MutationObserver instance.
 */
export function observeNewEditors(doc, processed, editorSelector, aiConfig) {
    const mo = new doc.defaultView.MutationObserver(muts => {
        for (const m of muts) {
            for (const n of m.addedNodes) {
                if (n.nodeType !== Node.ELEMENT_NODE) continue;
                const el = n;
                try {
                    if (el.matches && el.matches(editorSelector)) {
                        handleNewEditors([el], doc, processed, aiConfig);
                        continue;
                    }
                } catch (e) {
                    // matches may throw for some nodes — fallback to inner query
                }

                const inner = n.querySelectorAll?.(editorSelector);
                if (inner && inner.length) handleNewEditors(inner, doc, processed, aiConfig);
            }
        }
    });
    if (doc.body) mo.observe(doc.body, { childList: true, subtree: true });
    return mo;
}
